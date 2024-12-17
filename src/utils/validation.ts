export const validatePhoneNumber = (number: string): boolean => {
  // Basic international phone number validation
  // Allows +, spaces, and digits
  const phoneRegex = /^\+?[\d\s]{10,15}$/;
  return phoneRegex.test(number.replace(/\s/g, ''));
};

export const validateMessage = (message: string): boolean => {
  return message.trim().length > 0 && message.length <= 1600; // Twilio's message length limit
};