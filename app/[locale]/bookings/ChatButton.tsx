"use client"

import { useChatStore } from "@/lib/store/useChatStore"
import { MessageSquare } from "lucide-react"

interface ChatButtonProps {
  chatId: string
  recipientName: string
}

export default function ChatButton({ chatId, recipientName }: ChatButtonProps) {
  const { openChat } = useChatStore()

  return (
    <button
      onClick={() => openChat(chatId, recipientName)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-orange-600 rounded-full transition-colors shadow-md shadow-primary/20"
    >
      <MessageSquare className="w-3.5 h-3.5" />
      Chat with Owner
    </button>
  )
}
