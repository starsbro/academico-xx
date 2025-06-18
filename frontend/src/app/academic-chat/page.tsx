'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { Input } from './../components/ui/input';
import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define a type for chat messages received from the backend
interface ChatMessage {
  id: string; // Document ID from Firestore
  userId: string;
  message: string;
  timestamp: string;
}

//Define a type for a chat entry in the sidebar
interface UserChat {
  id: string;
  title: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export default function Component() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [userChats, setUserChats] = useState<UserChat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialChatFetchRef = useRef(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // environment variable in .env.local
  const backendUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL!;

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
      const url = `${backendUrl}/users/${user.id}/chats`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: UserChat[] = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
      setUserChats(sortedData);
    } catch (error) {
      console.error('Failed to fetch user chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  }, [isLoaded, isSignedIn, user?.id, backendUrl]);

  //Fetch user chats on component mount or user change
  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  // Effect for initial application loadS
  useEffect(() => {
    // Only run this logic once on component mount for a given user
    if (isLoaded && isSignedIn && user?.id && !initialChatFetchRef.current) {
      const initialLoadAndSelect = async () => {
        setIsLoadingChats(true);
        try {
          const url = `${backendUrl}/users/${user.id}/chats`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: UserChat[] = await response.json();
          const sortedData = data.sort(
            (a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
          );
          setUserChats(sortedData);

          if (selectedChatId === null && sortedData.length > 0) {
            setSelectedChatId(sortedData[0].id);
          }
        } catch (error) {
          console.error('Failed to fetch and select initial user chats:', error);
        } finally {
          setIsLoadingChats(false);
          initialChatFetchRef.current = true;
        }
      };
      initialLoadAndSelect();
    }
  }, [isLoaded, isSignedIn, user?.id, backendUrl, selectedChatId]);

  // Function to fetch messages for a specific chat
  const fetchMessagesForChat = useCallback(
    async (chatId: string) => {
      if (!isLoaded || !isSignedIn || !user?.id || !chatId) {
        setIsLoadingMessages(false);
        setChatHistory([]);
        return;
      }
      setIsLoadingMessages(true);
      try {
        const url = `${backendUrl}/users/${user.id}/chats/${chatId}/messages`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ChatMessage[] = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error(`Failed to fetch chat history for chat ${chatId}:`, error);
        setChatHistory([]);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [isLoaded, isSignedIn, user?.id, backendUrl]
  );

  useEffect(() => {
    if (selectedChatId) {
      fetchMessagesForChat(selectedChatId);
    } else {
      setChatHistory([]);
    }
  }, [selectedChatId, fetchMessagesForChat]);

  // Handles starting a new chat
  const handleNewChat = () => {
    setSelectedChatId(null);
    setChatHistory([]);
    setCurrentMessage('');
    setEditingChatId(null);
    initialChatFetchRef.current = false;
    fetchUserChats();
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setEditingChatId(null);
  };

  const handleSendMessage = async () => {
    // Only send if message is not empty and user is available
    if (!currentMessage.trim() || !user?.id) return;

    // Data structure to send to the backend (id is generated by Firestore)
    const newMessagePayload: {
      userId: string;
      message: string;
      timestamp: string;
      chatId?: string | null; // Optional chatId
    } = {
      userId: user.id,
      message: currentMessage.trim(),
      timestamp: new Date().toISOString(), // Send ISO string
    };

    if (selectedChatId) {
      // Include chatId if an existing chat is selected
      newMessagePayload.chatId = selectedChatId;
    }

    try {
      const url = `${backendUrl}/message`;
      // console.log('Sending message to: ', url, 'with payload:', newMessagePayload);
      // POST to the updated message endpoint
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessagePayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedResponse = await response.json();

      // If a new chat was creted, update selectedChatId and the userChats list
      if (savedResponse.newChatId && !selectedChatId) {
        setSelectedChatId(savedResponse.newChatId);
        fetchUserChats();
      } else if (selectedChatId && !savedResponse.newChatId) {
        fetchUserChats();
      }
      // Add the new message to chat history with the ID from the backend
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { ...newMessagePayload, id: savedResponse.id, timestamp: savedResponse.timestamp } as ChatMessage,
      ]);
      setCurrentMessage(''); // Clear the input field
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Function to handle navigation to the home page
  const handleGoHome = () => {
    router.push('/');
  };

  //  New Function for Editing Chat Title
  const handleEditChatTitle = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setNewChatTitle(currentTitle);
  };

  const handleSaveChatTitle = async (chatId: string) => {
    if (!newChatTitle.trim() || !user?.id) return;

    try {
      const url = `${backendUrl}/users/${user.id}/chats/${chatId}/title`;
      const response = await fetch(url, {
        method: 'PUT', // Use PUT for updating a resource
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newChatTitle.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // After saving, refresh the chat list in the sidebar to show the updated title
      fetchUserChats();

      setEditingChatId(null);
      setNewChatTitle('');
    } catch (error) {
      console.error('Failed to update chat title:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setNewChatTitle('');
  };

  // Loading state / not signed in
  if (!isLoaded || !isSignedIn) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Academico.ai</h1>
          <div className="flex items-center gap-3">{isLoaded && <UserButton />}</div>
        </div>
      </header>
    );
  }

  const username: string = user.username || user.fullName || user.emailAddresses[0]?.emailAddress || 'Guest';

  return (
    <div className="flex h-128 bg-gray-50 gap-4 rounded-lg">
      {/* Left Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-400 to-blue-600 text-white flex flex-col">
        <div className="p-4 flex items-center gap-3" style={{ margin: 12 }}>
          <UserButton />
          <span className="font-medium">Academic {username}</span>
          <div onClick={handleGoHome}>
            <Home className="w-5 h-5 ml-auto text-gray-600 cursor-pointer" />
          </div>
        </div>
        <div className="px-4 mb-4" style={{ margin: 6 }}>
          <button
            className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200 ease-in-out"
            onClick={handleNewChat}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-pen-tool"
            >
              <path d="m12 19 7-7 3 3-7 7-3-3z" />
              <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="m2 2 7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            New chat
          </button>
        </div>

        <div className="flex-1 px-4">
          <h3 className="text-sm font-medium opacity-90 pl-2" style={{ margin: 12 }}>
            Chats ({userChats.length})
          </h3>
          <div className="space-y-2">
            {isLoadingChats ? (
              <p className="text-white/70 text-sm pl-2">Loading chats...</p>
            ) : userChats.length === 0 ? (
              <p className="text-white/70 text-sm pl-2">No chats yet. Start a new one!</p>
            ) : (
              userChats.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between group">
                  {editingChatId === chat.id ? (
                    <input
                      type="text"
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      className="flex-1 bg-white/20 text-white px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveChatTitle(chat.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                  ) : (
                    <button
                      className={`w-full text-left py-2 px-3 rounded-lg text-white text-sm transition duration-200 ease-in-out
                        ${selectedChatId === chat.id ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      {chat.title}
                    </button>
                  )}
                  {editingChatId === chat.id ? (
                    <div className="flex ml-2">
                      <button
                        className="text-white/70 hover:text-white p-1 rounded-full"
                        onClick={() => handleSaveChatTitle(chat.id)}
                        title="Save"
                      >
                        {/* Save icon inline SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </button>
                      <button
                        className="text-white/70 hover:text-white p-1 rounded-full"
                        onClick={handleCancelEdit}
                        title="Cancel"
                      >
                        {/* X icon inline SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-x"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-white/70 hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      onClick={() => handleEditChatTitle(chat.id, chat.title)}
                      title="Edit title"
                    >
                      {/* Edit icon inline SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-pencil"
                      >
                        <path d="M12.1 17.5 1.5 22l4.5-10.6M17.1 14.9L22 10l-4.9-4.9c-.9-.9-2.2-.9-3.1 0L12.1 6.9c-.9.9-.9 2.2 0 3.1L17.1 14.9Z" />
                        <path d="M7.6 15.8L4 20l4.2-3.6" />
                      </svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {isLoadingMessages && selectedChatId ? (
              <p className="text-gray-600 text-center text-lg mt-20">Loading messages...</p>
            ) : chatHistory.length === 0 && !selectedChatId ? (
              <div className="text-center text-gray-500 mt-20">
                <p className="text-2xl font-semibold mb-2">Welcome to Academico.ai!</p>
                <p className="text-lg">Start a new conversation by typing your first message below.</p>
                <p className="text-sm mt-4">
                  You are interacting as: <span className="font-bold">{username}</span>
                </p>
              </div>
            ) : chatHistory.length === 0 && selectedChatId ? (
              <div className="text-center text-gray-500 mt-20">
                <p className="text-lg font-semibold">No messages in this chat yet.</p>
                <p className="text-sm">Be the first to say something!</p>
              </div>
            ) : chatHistory.length === 0 && selectedChatId ? (
              <div className="text-center text-gray-500 mt-20">
                <p className="text-lg font-semibold">No messages in this chat yet.</p>
                <p className="text-sm">Be the first to say something!</p>
              </div>
            ) : (
              // Display full chat messages
              chatHistory.map((chat) => (
                <div key={chat.id} className="bg-white rounded-lg p-4 shadow-sm mb-4">
                  <p className="text-gray-800 text-sm">{chat.message}</p>
                  <p className="text-gray-500 text-xs text-right mt-1">
                    {new Date(chat.timestamp).toLocaleString()} - {chat.userId === user.id ? 'You' : 'Bot'}
                  </p>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-fuchsia-100 rounded-2xl p-4">
          <div className="max-w-3xl mx-8">
            <div className="relative">
              <Input
                placeholder="I am thinking about..."
                className="pr-20 h-12 text-lg"
                value={currentMessage || ''}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={!isSignedIn}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={!isSignedIn || currentMessage.trim() === ''} // Disable send if no message or not signed in
                >
                  {/* Using inline SVG for Send icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-send"
                  >
                    <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                    <path d="M15 7L7 15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
