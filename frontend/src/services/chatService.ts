// Chat API service functions

import { UserChat, ChatMessage, NewMessagePayload, ChatResponse } from '../types/chat.types';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export class ChatService {
  static async fetchUserChats(userId: string): Promise<UserChat[]> {
    const url = `${backendUrl}/users/${userId}/chats`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UserChat[] = await response.json();
    return data.sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
  }

  static async fetchChatMessages(chatId: string, userId: string): Promise<ChatMessage[]> {
    const url = `${backendUrl}/users/${userId}/chats/${chatId}/messages`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatMessage[] = await response.json();
    return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  static async sendMessage(payload: NewMessagePayload): Promise<ChatResponse> {
    const url = `${backendUrl}/message`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async updateChatTitle(chatId: string, title: string, userId: string): Promise<void> {
    const url = `${backendUrl}/users/${userId}/chats/${chatId}/title`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}
