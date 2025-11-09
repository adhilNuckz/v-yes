import { account, client } from '../lib/appwriteConfig';
import { ID, OAuthProvider } from 'appwrite';

class AuthService {
  // Create account with email and password
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      if (userAccount) {
        return await this.login({ email, password });
      }
      return userAccount;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  // Login with email and password
  async login({ email, password }) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Login with GitHub OAuth
  async loginWithGithub() {
    try {
      // Redirect to GitHub OAuth
      account.createOAuth2Session(
        OAuthProvider.Github,
        `${window.location.origin}/workspaces`, // Success redirect
        `${window.location.origin}/login`, // Failure redirect
      );
    } catch (error) {
      console.error('Error with GitHub login:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Get user preferences
  async getUserPreferences() {
    try {
      return await account.getPrefs();
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  }

  // Update user preferences
  async updateUserPreferences(prefs) {
    try {
      return await account.updatePrefs(prefs);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}

export default new AuthService();
