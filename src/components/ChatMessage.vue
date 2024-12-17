<script setup lang="ts">
import {formatDistanceToNow} from 'date-fns';
import type {Message} from '../types/message';

defineProps<{
  message: Message;
}>();
</script>

<template>
  <div :class="message.direction === 'incoming' ? 'flex justify-end' : ' flex justify-start'">
    <div
        :class="[
      'max-w-[100%] rounded-lg p-3 mb-2',
      message.direction === 'incoming'
        ? 'bg-gray-200 rounded-bl-none'
        : 'bg-green-500 text-white self-end rounded-br-none'
    ]"
    >
      <p class="text-sm">{{ message.content }}</p>
      <div class="flex items-center justify-end gap-1 mt-1">
      <span class="text-xs opacity-75">
        {{ formatDistanceToNow(message.timestamp, {addSuffix: true}) }}
      </span>
        <span v-if="message.direction === 'outgoing'" class="text-xs">
        {{ message.status === 'sent' ? '✓' : message.status === 'failed' ? '⚠️' : '⌛' }}
      </span>
      </div>
    </div>
  </div>
</template>
