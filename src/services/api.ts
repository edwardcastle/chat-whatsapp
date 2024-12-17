import {TwilioService} from "./twilioService.ts";

const twilioService = new TwilioService();

export const sendMessage = async (phoneNumber: string, content: string) => {
  if (!content.trim()) return;

  try {
    return await twilioService.sendMessage(
      phoneNumber,
      content
    );

  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
