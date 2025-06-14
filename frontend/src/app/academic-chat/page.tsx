'use client';

// Declare global variables available in the local environment
declare const __app_id: string;

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { Button } from './../components/Button';
import { Input } from './../components/ui/input';
//import { ScrollArea } from './../components/ui/scroll-area';
import { Home, Send } from 'lucide-react';
//import { Paperclip, ArrowUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define a type for chat messages received from the backend
interface ChatMessage {
  id: string; // Document ID from Firestore
  userId: string;
  message: string;
  timestamp: string; // ISO string from backend
}

//Define a type for a chat entry in the sidebar
interface UserChat {
  id: string;
  title: string;
  createdAt: string; // ISO string
  lastUpdatedAt: string; //ISO string
}

export default function Component() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [userChats, setUserChats] = useState<UserChat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // // Dynamically constrct the backend URL using __app_id
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  // const backendUrl: string = `http://us-central1-${appId}.cloudfunctions.net/api`;

  // Ensure this environment variable is set in your .env.local for local dev,
  // and in your Firebase config for deployment.
  const backendUrl: string = 'http://localhost:5001/academico-ai/us-central1/api';
  // process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001/academico-ai/us-central1/api';

  // Log the constructed backend URL for debugging
  useEffect(() => {
    console.log('--- Frontend Debug Info ---');
    console.log('__app_id (raw):', typeof __app_id !== 'undefined' ? __app_id : 'undefined/not-available');
    console.log('appId (derived):', appId);
    console.log('Backend URL being used:', backendUrl);
    console.log('---------------------------');
  }, [appId, backendUrl]); // Log once on component mount

  // Scroll to the latest message whenever chatHistory updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Fetch chat history on component mount or user change
  // useEffect(() => {
  //   const fetchChatHistory = async () => {
  //     // Ensure user data is loaded and user is signed in
  //     if (!isLoaded || !isSignedIn || !user?.id) return;

  //     try {
  //       const response = await fetch(`${backendUrl}/chat-history/${user.id}`);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data: ChatMessage[] = await response.json();
  //       setChatHistory(data);
  //     } catch (error) {
  //       console.error('Failed to fetch chat history:', error);
  //     }
  //   };

  //   fetchChatHistory();
  // }, [isLoaded, isSignedIn, user?.id, backendUrl]); // Depend on user ID and backend URL

  // Function to fetch the list of all chats for the user
  const fetchUserChats = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    setIsLoadingChats(true);
    try {
      const url = `${backendUrl}/users/${user.id}/chats`;
      console.log('Fetching user chats from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: UserChat[] = await response.json();
      setUserChats(data);
      // Automatically select the most recent chat if available
      if (data.length > 0 && !selectedChatId) {
        setSelectedChatId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch user chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  }, [isLoaded, isSignedIn, user?.id, backendUrl, selectedChatId]);
  //Fetch user chats on component mount or user change
  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);
  // Function to fetch messages for a specific chat
  const fetchMessagesForChat = useCallback(
    async (chatId: string) => {
      if (!isLoaded || !isSignedIn || !user?.id || !chatId) return;
      setIsLoadingMessages(true);
      try {
        const url = `${backendUrl}/users/${user.id}/chats/${chatId}/messages`;
        console.log('Fetching messages for chat from:', url);
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

  // Effect to load messages when selectedChatId changes
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
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
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
      console.log('Sending message to: ', url, 'with payload:', newMessagePayload);
      // POST to the updated message endpoint
      // const response = await fetch(`${backendUrl}/chat`, {
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
        // Add the new chat to the userChats list (sort by lastUpdatedAt for correct display)
        setUserChats((prevChats) =>
          [
            {
              id: savedResponse.newChatId,
              title: currentMessage.substring(0, 30) + (currentMessage.length > 30 ? '...' : ''),
              createdAt: new Date().toISOString(),
              lastUpdatedAt: new Date().toISOString(),
            },
            ...prevChats,
          ].sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime())
        );
      } else if (selectedChatId && !savedResponse.newChatId) {
        setUserChats((prevChats) =>
          prevChats
            .map((chat) => (chat.id === selectedChatId ? { ...chat, lastUpdatedAt: new Date().toISOString() } : chat))
            .sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime())
        );
      }
      // Add the new message to chat history with the ID from the backend
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { ...newMessagePayload, id: savedResponse.id, timestamp: savedResponse.timestamp } as ChatMessage,
      ]);
      setCurrentMessage(''); // Clear the input field
    } catch (error) {
      console.error('Failed to send message:', error);
      // TODO: Optionally, show an error message to the user
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

  // Get username safely
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

        {/* <div className="px-4 mb-4" style={{ margin: 6 }}>
          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 justify-center gap-2">
            <PenTool className="w-4 h-4" />
            New chat
          </Button>
        </div> */}
        <div className="mb-4">
          <button
            className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200 ease-in-out"
            onClick={handleNewChat}
          >
            {/* Using inline SVG for PenTool icon */}
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
          <h3 className="text-sm font-medium opacity-90" style={{ margin: 12 }}>
            Chats ({userChats.length})
          </h3>
          <div className="space-y-2">
            {isLoadingChats ? (
              <p className="text-white/70 text-sm pl-2">Loading chats...</p>
            ) : userChats.length === 0 ? (
              <p className="text-white/70 text-sm pl-2">No chats yet. Start a new one!</p>
            ) : (
              userChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`w-full text-left py-2 px-3 rounded-lg text-white text-sm transition duration-200 ease-in-out
                    ${selectedChatId === chat.id ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  {chat.title}
                </button>
              ))
            )}
          </div>

          {/* <ScrollArea className="h-full">
            <div className="space-y-1">
              Display fetched chat history snippets
              {chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant="outline"
                  className="w-60 justify-start text-white hover:bg-white/20 h-8 text-sm font-normal "
                >
                  {chat.message.substring(0, 30)}
                  {chat.message.length > 30 ? '...' : ''}
                </Button>
              ))}
            </div>
          </ScrollArea> */}
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
            {/* Display full chat messages */}
            {/* {chatHistory.map((chat) => (
              <div key={chat.id} className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <p className="text-gray-800 text-sm">{chat.message}</p>
                <p className="text-gray-500 text-xs text-right mt-1">
                  {new Date(chat.timestamp).toLocaleString()} - {chat.userId === user.id ? 'You' : 'Bot'}
                </p>
              </div>
            ))} */}
            <div ref={chatEndRef} />

            {/* Action Buttons (as before) */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Button
                variant="outline"
                className="h-16 bg-purple-100 border-purple-200 hover:bg-purple-150 text-purple-700 text-xs font-medium flex flex-col items-center justify-center gap-1"
              >
                <span className="text-center leading-tight">Generate Search Knowledge Graph</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 bg-purple-100 border-purple-200 hover:bg-purple-150 text-purple-700 text-xs font-medium flex flex-col items-center justify-center gap-1"
              >
                <span className="text-center leading-tight">Search Knowledge Graph</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 bg-purple-100 border-purple-200 hover:bg-purple-150 text-purple-700 text-xs font-medium flex flex-col items-center justify-center gap-1"
              >
                <span className="text-center leading-tight">Generate Full Context Knowledge Graph</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 bg-purple-100 border-purple-200 hover:bg-purple-150 text-purple-700 text-xs font-medium flex flex-col items-center justify-center gap-1"
              >
                <span className="text-center leading-tight">Full Context Knowledge Graph</span>
              </Button>
            </div> */}
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
                {/* <Button size="small" variant="outline" className="h-8 w-8 p-0">
                  <Paperclip className="w-4 h-4" />
                </Button> */}
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
                <Button
                  size="small"
                  variant="outline"
                  className="h-8 w-8 p-0 justify-center"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4 " />
                </Button>
                {/* <Button size="small" className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600">
                  <ArrowUp className="w-4 h-4 text-white" onClick={handleSendMessage} />
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
