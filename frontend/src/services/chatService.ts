// Chat API service functions

import { UserChat, ChatMessage } from '../types/chat.types';
import { getBackendUrl } from '../lib/env-config';

const backendUrl = getBackendUrl();

export class ChatService {
  static async fetchUserChats(userId: string): Promise<UserChat[]> {
    const url = `${backendUrl}/users/${userId}/chats`;

    // console.log('🔍 Fetching user chats:', { url, backendUrl, userId });

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // console.log('📡 Response status:', response.status);
      // console.log('📡 Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: UserChat[] = await response.json();
      // console.log('✅ Fetched chats:', data);
      return data.sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  }

  static async fetchChatMessages(chatId: string, userId: string): Promise<ChatMessage[]> {
    const url = `${backendUrl}/users/${userId}/chats/${chatId}/messages`;

    // console.log('🔍 Fetching chat messages:', { url, chatId, userId });

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // console.log('📡 Messages response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Messages response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: ChatMessage[] = await response.json();
      // console.log('✅ Fetched messages:', data);
      return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('❌ Fetch messages error:', error);
      throw error;
    }
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

  static async deleteChat(chatId: string, userId: string, idToken?: string): Promise<void> {
    const url = `${backendUrl}/users/${userId}/chats/${chatId}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
  }
}
