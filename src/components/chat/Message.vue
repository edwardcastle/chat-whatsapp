<script setup lang="ts">
import { computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { useMessageStatus } from '../../composables/useMessageStatus';
import type { Message } from '../../types/message';

const props = defineProps<{
  message: Message;
}>();

const { statusIcon, statusClass } = useMessageStatus(props.message);

const formattedTime = computed(() => 
  formatDistanceToNow(props.message.timestamp, { addSuffix: true })
);

const messageClass = computed(() => [
  'max-w-[70%] rounded-lg p-3 mb-2',
  props.message.direction === 'incoming'
    ? 'bg-gray-200 self-start rounded-bl-none'
    : 'bg-green-500 text-white self-end rounded-br-none'
]);
</script>

<template>
  <div :class="messageClass">
    <p class="text-sm">{{ message.content }}</p>
    <div class="flex items-center justify-end gap-1 mt-1">
      <span class="text-xs opacity-75">{{ formattedTime }}</span>
      <span 
        v-if="message.direction === 'outgoing'" 
        class="text-xs"
        :class="statusClass"
      >
        {{ statusIcon }}
      </span>
    </div>
  </div>
</template>