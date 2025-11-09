import { databases, realtime } from '../lib/appwriteConfig';
import { DATABASE_ID, WORKSPACES_COLLECTION_ID } from '../lib/appwriteConfig';
import { ID, Query } from 'appwrite';

class WorkspaceService {
  // Create a new workspace
  async createWorkspace({ name, description, ownerId, ownerName }) {
    try {
      const workspaceId = ID.unique();
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId,
        {
          name,
          // description: description || '', // Add 'description' attribute in Appwrite first
          ownerId,
          ownerName,
          members: [ownerId],
          memberNames: JSON.stringify({ [ownerId]: ownerName }), // Stored as JSON string
          // createdAt: new Date().toISOString(), // Add 'createdAt' attribute (DateTime) in Appwrite first
          settings: JSON.stringify({ // Stored as JSON string
            voiceChatEnabled: true,
            voiceChatMuted: [],
            textChatEnabled: true,
          })
        }
      );
      return workspace;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  }

  // Get workspace by ID
  async getWorkspace(workspaceId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId
      );
    } catch (error) {
      console.error('Error getting workspace:', error);
      throw error;
    }
  }

  // Get user's workspaces
  async getUserWorkspaces(userId) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        [
          Query.contains('members', userId)
          // Note: Removed orderDesc - add createdAt attribute in Appwrite to enable sorting
        ]
      );
    } catch (error) {
      console.error('Error getting user workspaces:', error);
      throw error;
    }
  }

  // Join workspace
  async joinWorkspace(workspaceId, userId, userName) {
    try {
      const workspace = await this.getWorkspace(workspaceId);
      
      if (!workspace.members.includes(userId)) {
        const updatedMembers = [...workspace.members, userId];
        const currentMemberNames = JSON.parse(workspace.memberNames || '{}');
        const updatedMemberNames = { 
          ...currentMemberNames, 
          [userId]: userName 
        };
        
        return await databases.updateDocument(
          DATABASE_ID,
          WORKSPACES_COLLECTION_ID,
          workspaceId,
          {
            members: updatedMembers,
            memberNames: JSON.stringify(updatedMemberNames)
          }
        );
      }
      return workspace;
    } catch (error) {
      console.error('Error joining workspace:', error);
      throw error;
    }
  }

  // Leave workspace
  async leaveWorkspace(workspaceId, userId) {
    try {
      const workspace = await this.getWorkspace(workspaceId);
      const updatedMembers = workspace.members.filter(id => id !== userId);
      
      const currentMemberNames = JSON.parse(workspace.memberNames || '{}');
      const updatedMemberNames = { ...currentMemberNames };
      delete updatedMemberNames[userId];
      
      return await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId,
        {
          members: updatedMembers,
          memberNames: JSON.stringify(updatedMemberNames)
        }
      );
    } catch (error) {
      console.error('Error leaving workspace:', error);
      throw error;
    }
  }

  // Update workspace settings
  async updateWorkspaceSettings(workspaceId, settings) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId,
        { settings }
      );
    } catch (error) {
      console.error('Error updating workspace settings:', error);
      throw error;
    }
  }

  // Subscribe to workspace updates (real-time)
  subscribeToWorkspace(workspaceId, callback) {
    return realtime.subscribe(
      `databases.${DATABASE_ID}.collections.${WORKSPACES_COLLECTION_ID}.documents.${workspaceId}`,
      callback
    );
  }

  // Delete workspace (owner only)
  async deleteWorkspace(workspaceId) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId
      );
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw error;
    }
  }
}

export default new WorkspaceService();
