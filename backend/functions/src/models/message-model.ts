import * as admin from "firebase-admin";
import {FieldValue} from "firebase-admin/firestore";

/**
 * Interface for a message document returned from the database.
 */
interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
}

/**
 * Add a new message to a specific chat document
 * @param {string} userId The ID of the user.
 * @param {string} chatId The ID of the chat.
 * @param {object} messageData Include message, who and when
 * @param {string} messageData.userId The ID of the user who sent the message.
 * @param {string} messageData.message The content of the message.
 * @param {string} messageData.timestamp The timestamp of the message.
 * @return {void}
 */
export async function addMessageToChat(
  userId: string,
  chatId: string,
  messageData: {userId: string; message: string; timestamp: string}
) : Promise<admin.firestore.DocumentReference> {
  const db = admin.firestore();

  const newMessageRef = await db.collection("users").doc(userId)
    .collection("chats").doc(chatId).collection("messages").add({
      userId: messageData.userId,
      message: messageData.message,
      timestamp: FieldValue.serverTimestamp(),
    });
  return newMessageRef;
}

/**
 * Fetches all messages for a specific chat.
 * @param {string} userId The ID of the user.
 * @param {string} chatId The ID of the chat.
 * @return {Promise<ChatMessage[]>} An array of messages for the specified chat.
 */
export async function getMessagesByChatId(
  userId: string,
  chatId: string
) : Promise<ChatMessage[]> {
  const db = admin.firestore();

  const messagesRef = db.collection("users").doc(userId)
    .collection("chats").doc(chatId).collection("messages")
    .orderBy("timestamp", "asc");
  const snapshot = await messagesRef.get();
  const chatMessages: ChatMessage[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    chatMessages.push({
      id: doc.id,
      userId: data.userId,
      message: data.message,
      timestamp: data.timestamp ?
        (data.timestamp as admin.firestore.Timestamp).toDate().toISOString() :
        new Date().toISOString(),
    });
  });
  return chatMessages;
}
