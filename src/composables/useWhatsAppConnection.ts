import { ref, watch } from 'vue';
import { validatePhoneNumber } from '../utils/validation';
import { getStorageItem, setStorageItem } from '../utils/storage';

const LAST_NUMBER_KEY = 'lastPhoneNumber';

export function useWhatsAppConnection() {
  const recipientNumber = ref(getStorageItem(LAST_NUMBER_KEY, ''));
  const isConnected = ref(false);
  const connectionError = ref('');

  watch(recipientNumber, (newValue) => {
    connectionError.value = '';
    setStorageItem(LAST_NUMBER_KEY, newValue);
  });

  const connect = () => {
    if (!validatePhoneNumber(recipientNumber.value)) {
      connectionError.value = 'Please enter a valid phone number';
      return false;
    }
    isConnected.value = true;
    connectionError.value = '';
    return true;
  };

  const disconnect = () => {
    isConnected.value = false;
    recipientNumber.value = '';
  };

  return {
    recipientNumber,
    isConnected,
    connectionError,
    connect,
    disconnect
  };
}