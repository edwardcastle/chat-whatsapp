<script setup lang="ts">
import { computed } from 'vue';
import ChatMessage from './Message.vue';
import type { Message } from '../../types/message';

const props = defineProps<{
  messages: Message[];
}>();

const sortedMessages = computed(() => 
  [...props.messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
);
</script>

<template>
  <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
    <ChatMessage
      v-for="message in sortedMessages"
      :key="message.id"
      :message="message"
    />
  </div>
</template>