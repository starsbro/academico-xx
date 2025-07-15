import { ChatMessage, UserChat } from '../types/chat.types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  const { user } = useAuth();

  // Optimistically add a message to chat history (for user or AI thinking placeholder)
  const addMessageToChat = (msg: Partial<ChatMessage> & { userId: string; message: string }) => {
    setChatHistory((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        ...msg,
      } as ChatMessage,
    ]);
  };

  // Fetch all chats for the user
  const fetchUserChats = useCallback(async () => {
    if (!user?.uid) {
      setIsLoadingChats(false);
      setUserChats([]);
      return;
    }
    setIsLoadingChats(true);
    try {
      const data = await ChatService.fetchUserChats(user.uid);
      setUserChats(data);
    } catch (error) {
      console.error('Failed to fetch user chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  }, [user?.uid]);

  // Fetch messages for a specific chat
  const fetchMessagesForChat = useCallback(
    async (chatId: string) => {
      if (!user?.uid) return;
      setIsLoadingMessages(true);
      try {
        const data = await ChatService.fetchChatMessages(chatId, user.uid);
        setChatHistory(data);
      } catch (error) {
        console.error(`Failed to fetch chat history for chat ${chatId}:`, error);
        setChatHistory([]);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [user?.uid]
  );

  // Create a new chat
  const handleNewChat = useCallback(async () => {
    setIntentionalNewChat(true);
    setIsLoadingMessages(true);
    setChatHistory([]);
    setCurrentMessage('');
    setEditingChatId(null);
    initialChatFetchRef.current = false;
    if (!user?.uid) {
      setIsLoadingMessages(false);
      setSelectedChatId(null);
      return;
    }
    try {
      const idToken = user && user.getIdToken ? await user.getIdToken() : null;
      if (!idToken) throw new Error('No auth token available');
      const formData = new FormData();
      formData.append('userId', user.uid);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-with-pdf`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) throw new Error('Failed to create new chat');
      const data = await response.json();
      if (data.chatId) {
        setSelectedChatId(data.chatId);
        await fetchUserChats();
        await fetchMessagesForChat(data.chatId);
      } else {
        setSelectedChatId(null);
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
      setSelectedChatId(null);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user, fetchUserChats, fetchMessagesForChat]);

  // Select a chat
  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    setEditingChatId(null);
  }, []);

  // Save chat title
  const handleSaveChatTitle = useCallback(
    async (chatId: string) => {
      if (!newChatTitle.trim()) {
        setEditingChatId(null);
        setNewChatTitle('');
        return;
      }
      try {
        if (!user?.uid) return;
        await ChatService.updateChatTitle(chatId, newChatTitle.trim(), user.uid);
        await fetchUserChats();
        setEditingChatId(null);
        setNewChatTitle('');
      } catch (error) {
        console.error('Failed to update chat title:', error);
      }
    },
    [newChatTitle, fetchUserChats, user?.uid]
  );

  // Edit chat title
  const handleEditChatTitle = useCallback((chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setNewChatTitle(currentTitle);
  }, []);

  // Cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingChatId(null);
    setNewChatTitle('');
  }, []);

  // Delete a chat
  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      if (!user?.uid || !chatId) return;
      try {
        const idToken = user.getIdToken ? await user.getIdToken() : null;
        if (!idToken) throw new Error('No auth token');
        await ChatService.deleteChat(chatId, user.uid, idToken);
        if (selectedChatId === chatId) setSelectedChatId(null);
        await fetchUserChats();
      } catch (err) {
        console.error('Failed to delete chat:', err);
      }
    },
    [user, selectedChatId, fetchUserChats]
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

  useEffect(() => {
    if (user?.uid && !initialChatFetchRef.current) {
      const initialLoadAndSelect = async () => {
        setIsLoadingChats(true);
        try {
          const data = await ChatService.fetchUserChats(user.uid);
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
  }, [user?.uid, selectedChatId, intentionalNewChat]);

  // Return all state and handlers
  return {
    chatHistory,
    currentMessage,
    selectedChatId,
    userChats,
    isLoadingChats,
    isLoadingMessages,
    editingChatId,
    newChatTitle,
    chatEndRef,

    setCurrentMessage,
    setNewChatTitle,
    handleNewChat,
    handleSelectChat,
    handleSaveChatTitle,
    handleEditChatTitle,
    handleCancelEdit,
    fetchUserChats,
    fetchMessagesForChat,
    handleDeleteChat,
    addMessageToChat,
    user,
  };
};
