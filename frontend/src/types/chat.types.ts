// Chat-related type definitions

export interface ChatMessage {
  id: string; // Document ID from Firestore
  userId: string;
  message: string;
  timestamp: string;
}

export interface UserChat {
  id: string;
  title: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface NewMessagePayload {
  userId: string;
  message: string;
  timestamp: string;
  chatId?: string | null; // Optional chatId
}

export interface ChatResponse {
  id: string;
  timestamp: string;
  newChatId?: string;
}

export interface ChatState {
  chatHistory: ChatMessage[];
  currentMessage: string;
  selectedChatId: string | null;
  userChats: UserChat[];
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  editingChatId: string | null;
  newChatTitle: string;
}
