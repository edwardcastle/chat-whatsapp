import { io, Socket } from 'socket.io-client';
import {Message} from "../types/message.ts";

export class WebSocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private connectionHandlers: ((status: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  constructor(private readonly serverUrl: string = 'http://localhost:3000') {}

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(this.serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.notifyConnectionHandlers(true);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.notifyConnectionHandlers(false);
    });

    this.socket.on('whatsapp-message', (message: Message) => {
      this.notifyMessageHandlers(message);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
        console.error('Max reconnection attempts reached');
        this.socket?.close();
      }
    });
  }

  onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onConnectionChange(handler: (status: boolean) => void) {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  private notifyMessageHandlers(message: Message) {
    this.messageHandlers.forEach(handler => handler(message));
  }

  private notifyConnectionHandlers(status: boolean) {
    this.connectionHandlers.forEach(handler => handler(status));
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
