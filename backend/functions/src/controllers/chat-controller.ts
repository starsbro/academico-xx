import {Request, Response} from "express";
import * as chatModel from "../models/chat-model";
// import * as messageModel from "../models/message-model";
import {FieldValue} from "firebase-admin/firestore";

// eslint-disable-next-line @typescript-eslint/no-empty-function
// console.log = function() {};

/**
 * Handles fetching all chats for a specific user.
 * @param {express.Request} req The request from a specific user
 * @param {express.Response} res The respons of a server
 */
export async function getChats(req:Request, res: Response) {
  const requestedUserId = req.params.userId;
  // console.log(`Controller: Fetching chats for user: ${requestedUserId}`);

  try {
    const userChats = await chatModel.getChatsByUserId(requestedUserId);
    res.status(200).json(userChats);
    // console.log(`Controller: Fetched ${userChats.length}
    //         chats for user ${requestedUserId}`);
  } catch (error) {
    console.error(`Controller: Error fetching user chats 
            for ${requestedUserId}:`, error);
    res.status(500)
      .send("Internal Server Error: Could not fetch user chats.");
  }
}

/**
 * Handles updating the title of a specific chat.
 * @param {Express.Request} req
 * The request of update chat title from a specific user
 * @param {Express.Response} res
 * The response of a server
 * @return {void}
 */
export async function updateChatTitle(req:Request, res: Response) {
  const requestedUserId = req.params.userId;
  const requestedChatId = req.params.chatId;
  const {title} = req.body;

  // console.log(`Controller: Updating title for chat
  //       ${requestedUserId} to: ${title}`);

  if (!title) {
    res.status(400).send("Missing required field: title.");
    return;
  }

  try {
    await chatModel.updateChat(requestedUserId, requestedChatId, {
      title: title,
      lastUpdatedAt: FieldValue.serverTimestamp(),
    });
    // console.log(`Controller: Chat ${requestedChatId}
    //         title updated to: ${title}`);
    res.status(200).json({
      status: "success",
      message: "Chat title updated successfully.",
    });
  } catch (error) {
    console.error(`Controller: Error updating chat title for chat 
            ${requestedChatId}:`, error);
    res.status(500)
      .send("Internal Server Error: Could not update chat title.");
  }
}
