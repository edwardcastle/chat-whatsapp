<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');
const emit = defineEmits<{
  (e: 'send', message: string): void;
}>();

const sendMessage = () => {
  if (message.value.trim()) {
    emit('send', message.value);
    message.value = '';
  }
};
</script>

<template>
  <div class="flex gap-2 p-4 border-t border-gray-200">
    <input
      v-model="message"
      type="text"
      placeholder="Type a message..."
      class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
      @keyup.enter="sendMessage"
    />
    <button
      @click="sendMessage"
      class="px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none"
    >
      Send
    </button>
  </div>
</template>
