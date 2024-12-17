import axios from 'axios';
import {Message} from "../types/message.ts";

export class TwilioService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:3000'; // Your backend server URL
  }

  async sendMessage(to: string, content: string): Promise<Message> {
    try {
      const response = await axios.post(`${this.baseURL}/api/send-message`, {
        to,
        content
      });

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
