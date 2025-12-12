import { StreamChat } from 'stream-chat';
import { ENV } from '../env.js';

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error('Stream API key or secret is missing');
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData);
        console.log("User upserted successfully:", userData);
    } catch (error) {
        console.error('Error upserting Stream user:', error);
    }
}

export const deleteStreamUser = async (userID) => {
    try {
        await chatClient.upsertUser(userID);
        console.log(`User with ID ${userID} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting Stream user:', error);
    }
}