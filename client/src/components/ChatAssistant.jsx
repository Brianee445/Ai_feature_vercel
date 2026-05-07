import { useState, useRef, useEffect } from "react"
import { Send, Loader, Bot, User, Store } from "lucide-react"
import { askBuyerAssistant, analyzeStoreForSeller } from "../services/geminiService"

function ChatAssistant({ userType }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: userType === "buyer"
          ? "Hi! I'm your ChequeMart shopping assistant. Ask me anything about products, prices, or recommendations."
          : "Hi! I'm your ChequeMart store advisor. Paste any store link or describe a store style and I'll help you recreate it on ChequeMart."
      }
    ])
    setHistory([])
    setInput("")
  }, [userType])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage = { role: "user", text }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const newHistory = [
        ...history,
        { role: "user", parts: [{ text }] }
      ]

      const response = userType === "buyer"
        ? await askBuyerAssistant(text, history)
        : await analyzeStoreForSeller(text, history)

      const assistantMessage = { role: "assistant", text: response }
      setMessages((prev) => [...prev, assistantMessage])
      setHistory([
        ...newHistory,
        { role: "model", parts: [{ text: response }] }
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again." }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 200px)" }}>

      {/* User type indicator */}
      <div
        className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4"
        style={{ background: "#fff", border: "1px solid var(--border-color)", boxShadow: "var(--box-shadow)" }}
      >
        {userType === "buyer"
          ? <User size={16} style={{ color: "var(--accent-color)" }} />
          : <Store size={16} style={{ color: "var(--accent-color)" }} />
        }
        <p className="text-xs font-medium m-0" style={{ color: "var(--text-color)" }}>
          {userType === "buyer"
            ? "Buyer Assistant — Ask about products, prices, deals"
            : "Seller Advisor — Paste a store link for setup suggestions"
          }
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{
                background: msg.role === "user" ? "var(--accent-color)" : "#f5f0f0"
              }}
            >
              {msg.role === "user"
                ? <User size={14} color="#fff" />
                : <Bot size={14} style={{ color: "var(--accent-color)" }} />
              }
            </div>

            {/* Bubble */}
            <div
              className="rounded-2xl px-4 py-3 text-xs leading-relaxed"
              style={{
                maxWidth: "75%",
                background: msg.role === "user" ? "var(--accent-color)" : "#fff",
                color: msg.role === "user" ? "#fff" : "var(--text-color)",
                border: msg.role === "user" ? "none" : "1px solid var(--border-color)",
                boxShadow: "var(--box-shadow)",
                borderRadius: msg.role === "user"
                  ? "18px 18px 4px 18px"
                  : "18px 18px 18px 4px"
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex items-start gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#f5f0f0" }}
            >
              <Bot size={14} style={{ color: "var(--accent-color)" }} />
            </div>
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-2"
              style={{
                background: "#fff",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--box-shadow)",
                borderRadius: "18px 18px 18px 4px"
              }}
            >
              <Loader size={14} className="animate-spin" style={{ color: "var(--accent-color)" }} />
              <span className="text-xs" style={{ color: "var(--text-color-2)" }}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-3 bg-white rounded-full px-4 py-3"
        style={{ boxShadow: "var(--box-shadow)", border: "1px solid var(--border-color)" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            userType === "buyer"
              ? "Ask about a product..."
              : "Paste a store link or describe a store..."
          }
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: "var(--text-color)" }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: input.trim() && !loading ? "var(--accent-color)" : "#e0e0e0"
          }}
        >
          <Send size={15} color="#fff" />
        </button>
      </div>

    </div>
  )
}

export default ChatAssistant
