import { create } from 'zustand';

interface ChatStore {
  isOpen: boolean;
  chatId: string | null;
  recipientName: string | null;
  openChat: (chatId: string, recipientName: string) => void;
  closeChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  chatId: null,
  recipientName: null,
  openChat: (chatId, recipientName) => set({ isOpen: true, chatId, recipientName }),
  closeChat: () => set({ isOpen: false, chatId: null, recipientName: null }),
}));
