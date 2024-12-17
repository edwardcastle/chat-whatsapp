<script setup lang="ts">
import { computed } from 'vue';
import { validatePhoneNumber } from '../../utils/validation';

const props = defineProps<{
  isConnected: boolean;
  recipientNumber: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'connect'): void;
  (e: 'update:number', value: string): void;
}>();

const isValidNumber = computed(() => validatePhoneNumber(props.recipientNumber));
</script>

<template>
  <div class="p-4 border-b border-gray-200">
    <div v-if="!isConnected">
      <div class="space-y-2">
        <input
          :value="recipientNumber"
          @input="e => emit('update:number', (e.target as HTMLInputElement).value)"
          type="tel"
          placeholder="Enter WhatsApp number (e.g., +1234567890)"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          :class="{ 'border-red-500': error }"
        />
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      </div>
      <button
        @click="emit('connect')"
        :disabled="!isValidNumber"
        class="mt-2 w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Connect
      </button>
    </div>
    <div v-else class="flex items-center gap-2">
      <div class="w-3 h-3 bg-green-500 rounded-full"></div>
      <span class="font-medium">Connected to: {{ recipientNumber }}</span>
    </div>
  </div>
</template>