// Custom hook for managing chat state and operations

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { ChatMessage, UserChat } from '../types/chat.types';
import { ChatService } from '../services/chatService';

export const useChat = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [userChats, setUserChats] = useState<UserChat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [intentionalNewChat, setIntentionalNewChat] = useState(false);
  const initialChatFetchRef = useRef(false);
  const { isLoaded, isSignedIn, user } = useUser();

  // Scroll to the latest message whenever chatHistory updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Function to fetch the list of all chats for the user
  const fetchUserChats = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      setIsLoadingChats(false);
      setUserChats([]);
      return;
    }

    setIsLoadingChats(true);
    try {
      const data = await ChatService.fetchUserChats(user.id);
      setUserChats(data);
    } catch (error) {
      console.error('Failed to fetch user chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  }, [isLoaded, isSignedIn, user?.id]);

  // Function to fetch messages for a specific chat
  const fetchMessagesForChat = useCallback(
    async (chatId: string) => {
      if (!user?.id) return;

      setIsLoadingMessages(true);
      try {
        const data = await ChatService.fetchChatMessages(chatId, user.id);
        setChatHistory(data);
      } catch (error) {
        console.error(`Failed to fetch chat history for chat ${chatId}:`, error);
        setChatHistory([]);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [user?.id]
  );

  // Handle new chat creation
  const handleNewChat = useCallback(() => {
    setIntentionalNewChat(true);
    setSelectedChatId(null);
    setChatHistory([]);
    setCurrentMessage('');
    setEditingChatId(null);
    setIsLoadingMessages(false);
    initialChatFetchRef.current = false;
  }, []);

  // Handle chat selection
  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    setEditingChatId(null);
  }, []);

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !user?.id) return;

    const newMessagePayload = {
      userId: user.id,
      message: currentMessage.trim(),
      timestamp: new Date().toISOString(),
      ...(selectedChatId && { chatId: selectedChatId }),
    };

    try {
      setIntentionalNewChat(false); // Reset the flag when sending a message
      const savedResponse = await ChatService.sendMessage(newMessagePayload);

      // If a new chat was created, update selectedChatId and the userChats list
      if (savedResponse.newChatId && !selectedChatId) {
        setSelectedChatId(savedResponse.newChatId);
        fetchUserChats();
      } else if (selectedChatId && !savedResponse.newChatId) {
        fetchUserChats();
      }

      // Add the new message to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { ...newMessagePayload, id: savedResponse.id, timestamp: savedResponse.timestamp } as ChatMessage,
      ]);
      setCurrentMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [currentMessage, user?.id, selectedChatId, fetchUserChats]);

  // Handle saving chat title
  const handleSaveChatTitle = useCallback(
    async (chatId: string) => {
      if (!newChatTitle.trim()) {
        setEditingChatId(null);
        setNewChatTitle('');
        return;
      }

      try {
        if (!user?.id) return;
        await ChatService.updateChatTitle(chatId, newChatTitle.trim(), user.id);
        await fetchUserChats();
        setEditingChatId(null);
        setNewChatTitle('');
      } catch (error) {
        console.error('Failed to update chat title:', error);
      }
    },
    [newChatTitle, fetchUserChats, user?.id]
  );

  // Handle editing chat title
  const handleEditChatTitle = useCallback((chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setNewChatTitle(currentTitle);
  }, []);

  // Handle canceling edit
  const handleCancelEdit = useCallback(() => {
    setEditingChatId(null);
    setNewChatTitle('');
  }, []);

  // Handle key press for sending messages
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Effects
  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessagesForChat(selectedChatId);
    } else {
      setChatHistory([]);
    }
  }, [selectedChatId, fetchMessagesForChat]);

  // Initial load effect
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id && !initialChatFetchRef.current) {
      const initialLoadAndSelect = async () => {
        setIsLoadingChats(true);
        try {
          const data = await ChatService.fetchUserChats(user.id);
          setUserChats(data);

          if (selectedChatId === null && data.length > 0 && !intentionalNewChat) {
            setSelectedChatId(data[0].id);
          }
        } catch (error) {
          console.error('Error during initial fetch:', error);
        } finally {
          setIsLoadingChats(false);
          initialChatFetchRef.current = true;
        }
      };

      initialLoadAndSelect();
    }
  }, [isLoaded, isSignedIn, user?.id, selectedChatId, intentionalNewChat]);

  return {
    // State
    chatHistory,
    currentMessage,
    selectedChatId,
    userChats,
    isLoadingChats,
    isLoadingMessages,
    editingChatId,
    newChatTitle,
    chatEndRef,

    // Actions
    setCurrentMessage,
    setNewChatTitle,
    handleNewChat,
    handleSelectChat,
    handleSendMessage,
    handleSaveChatTitle,
    handleEditChatTitle,
    handleCancelEdit,
    handleKeyPress,
    fetchUserChats,

    // User data
    isLoaded,
    isSignedIn,
    user,
  };
};
