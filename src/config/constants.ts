export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_ENDPOINTS = {
  SEND_MESSAGE: '/api/messages',
  GET_MESSAGES: '/api/messages',
} as const;