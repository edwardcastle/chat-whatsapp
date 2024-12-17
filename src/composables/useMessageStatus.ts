import { computed } from 'vue';
import type { Message } from '../types/message';

export function useMessageStatus(message: Message) {
  const statusIcon = computed(() => {
    switch (message.status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'failed':
        return '⚠️';
      default:
        return '⌛';
    }
  });

  const statusClass = computed(() => {
    switch (message.status) {
      case 'failed':
        return 'text-red-500';
      case 'delivered':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  });

  return {
    statusIcon,
    statusClass
  };
}