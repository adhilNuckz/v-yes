import { Client, Account, Databases, Functions, Storage } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);
const storage = new Storage(client);

// Realtime is accessed through the client object itself
const realtime = client;

// Configuration constants
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const WORKSPACES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_WORKSPACES_COLLECTION_ID;
export const MESSAGES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID;
export const CODE_SESSIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CODE_SESSIONS_COLLECTION_ID;

export { client, account, databases, functions, storage, realtime };
