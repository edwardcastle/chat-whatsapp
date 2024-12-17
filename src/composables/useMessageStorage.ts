import { ref } from 'vue';
import type { Message } from '../types/message';
import { getStorageItem, setStorageItem } from '../utils/storage';

const MESSAGES_STORAGE_KEY = 'messages';
const messageStore = ref<Message[]>(getStorageItem(MESSAGES_STORAGE_KEY, []));

export function useMessageStorage() {
  const saveMessage = (message: Message) => {
    messageStore.value = [...messageStore.value, message];
    setStorageItem(MESSAGES_STORAGE_KEY, messageStore.value);
  };

  const updateMessage = (updatedMessage: Message) => {
    messageStore.value = messageStore.value.map(message =>
      message.id === updatedMessage.id ? updatedMessage : message
    );
    setStorageItem(MESSAGES_STORAGE_KEY, messageStore.value);
  };

  const deleteMessage = (messageId: string) => {
    messageStore.value = messageStore.value.filter(message => message.id !== messageId);
    setStorageItem(MESSAGES_STORAGE_KEY, messageStore.value);
  };

  return {
    messages: messageStore,
    saveMessage,
    updateMessage,
    deleteMessage,
  };
}