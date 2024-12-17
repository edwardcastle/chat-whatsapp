export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  direction: 'incoming' | 'outgoing';
}
