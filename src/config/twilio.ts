export const TWILIO_CONFIG = {
  API_URL: import.meta.env.VITE_TWILIO_API_URL,
  AUTH_TOKEN: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
  ACCOUNT_SID: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
  PHONE_NUMBER: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
} as const;