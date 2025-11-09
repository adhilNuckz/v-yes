import { databases, realtime } from '../lib/appwriteConfig';
import { DATABASE_ID, MESSAGES_COLLECTION_ID } from '../lib/appwriteConfig';
import { ID, Query } from 'appwrite';

class ChatService {
  // Send a text message
  async sendMessage({ workspaceId, userId, userName, content, type = 'text' }) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        ID.unique(),
        {
          workspaceId,
          userId,
          userName,
          content,
          type, // Required attribute
          timestamp: new Date().toISOString() // Required DateTime attribute
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get messages for a workspace
  async getMessages(workspaceId, limit = 50) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.limit(limit),
          Query.orderDesc('timestamp') // Sort messages newest first
        ]
      );
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Subscribe to messages (real-time)
  subscribeToMessages(workspaceId, callback) {
    return realtime.subscribe(
      `databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`,
      (response) => {
        // Filter messages for this workspace
        if (response.payload.workspaceId === workspaceId) {
          callback(response);
        }
      }
    );
  }

  // Delete message
  async deleteMessage(messageId) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        messageId
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

export default new ChatService();
