import * as admin from "firebase-admin";

/**
 * Interface for a message document returned from the database.
 */
interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  source?: string;
  pdfFilename?: string;
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
  messageData: {
    userId: string;
    message: string;
    timestamp: string;
    source?: string;
    pdfFilename?: string;
  }
): Promise<admin.firestore.DocumentReference> {
  const db = admin.firestore();

  const newMessageRef = await db
    .collection("users")
    .doc(userId)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add({
      userId: messageData.userId,
      message: messageData.message,
      // Use provided timestamp instead of server timestamp
      timestamp: messageData.timestamp,
      ...(messageData.source ? { source: messageData.source } : {}),
      ...(messageData.pdfFilename ?
        {
          pdfFilename: messageData.pdfFilename,
        } :
        {}),
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
  chatId: string,
): Promise<ChatMessage[]> {
  const db = admin.firestore();

  const messagesRef = db
    .collection("users")
    .doc(userId)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .orderBy("timestamp", "asc");
  const snapshot = await messagesRef.get();
  const chatMessages: ChatMessage[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();

    // Handle both string timestamps (new) and Firestore Timestamp objects (old)
    let timestampString: string;
    if (typeof data.timestamp === "string") {
      // Already a string timestamp
      timestampString = data.timestamp;
    } else if (data.timestamp && typeof data.timestamp.toDate === "function") {
      // Firestore Timestamp object
      timestampString = (data.timestamp as admin.firestore.Timestamp)
        .toDate().toISOString();
    } else {
      // Fallback
      timestampString = new Date().toISOString();
    }

    chatMessages.push({
      id: doc.id,
      userId: data.userId,
      message: data.message,
      timestamp: timestampString,
      ...(data.source ? { source: data.source } : {}),
      ...(data.pdfFilename ? { pdfFilename: data.pdfFilename } : {}),
    });
  });
  return chatMessages;
}
