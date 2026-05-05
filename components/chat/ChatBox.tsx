"use client"

import { useEffect, useState, useRef } from "react"
import { useChatStore } from "@/lib/store/useChatStore"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, User, MessageSquare } from "lucide-react"

interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string
  created_at: string
}

export default function ChatBox() {
  const { isOpen, chatId, recipientName, closeChat } = useChatStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const supabase = createClient()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
    })
  }, [])

  useEffect(() => {
    if (!isOpen || !chatId) return

    setLoading(true)
    
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true })

      if (data) setMessages(data)
      setLoading(false)
      scrollToBottom()
    }

    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
          scrollToBottom()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isOpen, chatId])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !userId || !chatId) return

    const content = newMessage.trim()
    setNewMessage("") // Optimistic UI clear

    const { error } = await supabase.from("messages").insert([
      {
        chat_id: chatId,
        sender_id: userId,
        content: content,
      },
    ])

    if (error) {
      console.error("Error sending message:", error)
      // Optionally handle error visually
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] z-[100] flex flex-col glass-card shadow-2xl shadow-black/50 border border-primary/20 rounded-3xl overflow-hidden bg-background/95 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{recipientName || "Chat"}</h3>
              <p className="text-[10px] text-green-400 font-medium">Online</p>
            </div>
          </div>
          <button
            onClick={closeChat}
            className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-2 opacity-50">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">No messages yet. Say hi!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === userId
              return (
                <div
                  key={msg.id}
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isMine
                      ? "bg-primary text-white self-end rounded-tr-sm"
                      : "bg-white/10 text-white self-start rounded-tl-sm border border-white/5"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`text-[9px] mt-1 block ${
                      isMine ? "text-white/60 text-right" : "text-white/40"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white/5 border-t border-white/10 shrink-0">
          <form onSubmit={sendMessage} className="relative flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary/50 text-white placeholder-white/30"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
