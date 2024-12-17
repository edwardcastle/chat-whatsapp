<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, onUpdated, ref} from 'vue';
import ChatInput from './chat/ChatInput.vue';
import ChatMessage from './ChatMessage.vue';
import type {Message} from '../types/message';
import {useWhatsAppConnection} from "../composables/useWhatsAppConnection.ts";
import {getStorageItem, setStorageItem} from "../utils/storage.ts";
import {WebSocketService} from "../services/websocketService.ts";
import {sendMessage} from "../services/api.ts";
import {useMessageStorage} from "../composables/useMessageStorage.ts";

const messages = ref<Message[]>([]);
const phoneNumber = ref('');
const isConnected = ref(false);
const error = ref('');
const webSocketService = new WebSocketService();
const messageStore = useMessageStorage();

const whatsappConnection = useWhatsAppConnection();
const connectionStatus = ref<string>('Connecting...');

onMounted(async () => {
  webSocketService.connect();

  const messageUnsubscribe = webSocketService.onMessage((message) => {
    messages.value.push(message);
    messageStore.saveMessage(message)
  });

  const connectionUnsubscribe = webSocketService.onConnectionChange((status) => {
    connectionStatus.value = status ? 'Connected' : 'Disconnected';
  });

  onUnmounted(() => {
    messageUnsubscribe();
    connectionUnsubscribe();
    webSocketService.disconnect();
    whatsappConnection.connect()
  });
});

const connect = () => {
  setStorageItem('lastPhoneNumber', phoneNumber.value);
  whatsappConnection.connect()
  isConnected.value = true;
  error.value = '';
};


const handleSendMessage = async (content: string) => {
  if (!content.trim()) return;
  await sendMessage(phoneNumber.value, content);
};
</script>

<template>
  <div class="max-w-xl mx-auto bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <div v-if="!isConnected">
        <input
            v-model="phoneNumber"
            type="tel"
            placeholder="Enter WhatsApp number (e.g., +1234567890)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            :class="{ 'border-red-500': error }"
        />
        <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
        <button
            @click="connect"
            class="mt-2 w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
        >
          Connect
        </button>
      </div>
      <div v-else class="flex items-center gap-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <span class="font-medium">Connected to: {{ phoneNumber }}</span>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4">
      <ChatMessage
          v-if="isConnected"
          v-for="message in messages"
          :key="message.id"
          :message="message"
      />
    </div>

    <!-- Input -->
    <ChatInput
        v-if="isConnected"
        @send="handleSendMessage"
    />
  </div>
</template>
