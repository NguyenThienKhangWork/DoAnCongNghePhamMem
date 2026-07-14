import { useState, useRef, useEffect } from 'react'

// ──────────────────────────────────────────────
// OpenRouter API key — đọc từ biến môi trường Vite
// Tạo file .env tại miyuki-frontend/ với nội dung:
//   VITE_OPENROUTER_API_KEY=your_api_key_here
// ──────────────────────────────────────────────
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'openai/gpt-4o-mini'

// System prompt — làm cho AI chỉ trả lời về MiYuki Express
const SYSTEM_PROMPT = `Bạn là Miyuki-chan 🌸, trợ lý AI chăm sóc khách hàng thân thiện của **MiYuki Express** — hệ thống đặt vé xe khách trực tuyến tại Việt Nam.

Nhiệm vụ của bạn:
- Hỗ trợ khách hàng về đặt vé, tra cứu chuyến, chọn ghế, thanh toán, hủy vé, hoàn tiền.
- Cung cấp thông tin về các tuyến đường (30 tuyến toàn quốc).
- Giải đáp thắc mắc về tài khoản, thay đổi thông tin cá nhân.
- Hướng dẫn sử dụng ứng dụng.
- Giọng điệu: thân thiện, vui vẻ, chuyên nghiệp, thỉnh thoảng dùng emoji phù hợp.
- Luôn trả lời bằng tiếng Việt trừ khi khách hỏi bằng tiếng Anh.
- Nếu câu hỏi nằm ngoài phạm vi MiYuki Express, nhẹ nhàng chuyển hướng về chủ đề đặt vé xe.

Thông tin nền:
- Website: MiYuki Express (hệ thống đặt vé xe khách)
- Các tuyến phổ biến: Hà Nội ↔ TP.HCM, Hà Nội ↔ Đà Nẵng, TP.HCM ↔ Vũng Tàu, TP.HCM ↔ Đà Lạt...
- Loại ghế: REGULAR, VIP, WINDOW
- Trạng thái vé: PENDING → CONFIRMED → COMPLETED
- Hỗ trợ hủy vé và hoàn tiền
- Tài khoản demo: demo@miyuki.vn / Demo@123456
- Liên hệ hỗ trợ: support@miyuki.vn`

// ──────────────────────────────────────────────
// Gọi OpenRouter API (OpenAI-compatible)
// ──────────────────────────────────────────────
async function callOpenRouter(history, userMessage) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
  ]

  // Đưa lịch sử vào
  for (const msg of history) {
    messages.push({ role: msg.role, content: msg.content })
  }

  // Thêm tin nhắn mới nhất
  messages.push({ role: 'user', content: userMessage })

  const body = {
    model: OPENROUTER_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 512,
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'MiYuki Express',
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }

  const data = await res.json()
  return data?.choices?.[0]?.message?.content || 'Xin lỗi, tôi không hiểu câu hỏi này. Bạn có thể hỏi lại không? 🌸'
}

// ──────────────────────────────────────────────
// Gợi ý câu hỏi nhanh
// ──────────────────────────────────────────────
const QUICK_QUESTIONS = [
  '🎫 Cách đặt vé xe?',
  '❌ Hủy vé như thế nào?',
  '💸 Chính sách hoàn tiền?',
  '🚌 Có những tuyến nào?',
  '🪑 Loại ghế nào tốt nhất?',
  '📋 Tra cứu vé đã đặt',
]

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
export default function AIChatBox() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Mình là Miyuki-chan 🌸, trợ lý AI của MiYuki Express.\n\nMình có thể giúp bạn đặt vé, tra cứu chuyến, hỗ trợ hủy vé và nhiều hơn nữa!\n\nBạn cần hỗ trợ gì không? ✨'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input khi mở chat
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    setInput('')
    setShowQuick(false)
    setError(null)

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      // Chỉ truyền history (không kể tin chào đầu)
      const history = newMessages.slice(1, -1) // bỏ tin chào và tin vừa gửi
      const reply = await callOpenRouter(history, userText)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      const errMsg = err?.message || String(err)
      setError(errMsg)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `😔 Xin lỗi, mình gặp sự cố:\n${errMsg}`
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Xin chào! Mình là Miyuki-chan 🌸, trợ lý AI của MiYuki Express.\n\nMình có thể giúp bạn đặt vé, tra cứu chuyến, hỗ trợ hủy vé và nhiều hơn nữa!\n\nBạn cần hỗ trợ gì không? ✨'
    }])
    setShowQuick(true)
    setError(null)
  }

  // Render text với xuống dòng
  const renderText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <>
      {/* ── Nút mở chat ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Mở chat hỗ trợ AI"
        style={{
          position: 'fixed',
          bottom: '1.8rem',
          right: '1.8rem',
          zIndex: 999,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: open
            ? 'linear-gradient(135deg, #7B2FBE, #FF6B9D)'
            : 'linear-gradient(135deg, #FF6B9D, #7B2FBE)',
          border: '2px solid rgba(255,255,255,0.25)',
          boxShadow: '0 4px 24px rgba(255,107,157,0.5), 0 0 0 4px rgba(255,107,157,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          transition: 'all 0.3s ease',
          transform: open ? 'rotate(15deg) scale(1.05)' : 'scale(1)',
        }}
      >
        {open ? '✕' : '🌸'}
      </button>

      {/* Pulse ring khi đóng */}
      {!open && (
        <div style={{
          position: 'fixed',
          bottom: '1.8rem',
          right: '1.8rem',
          zIndex: 998,
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: '2px solid rgba(255,107,157,0.5)',
          animation: 'chatPulse 2s ease-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* ── Chat panel ── */}
      <div style={{
        position: 'fixed',
        bottom: '5.5rem',
        right: '1.8rem',
        zIndex: 998,
        width: 380,
        maxWidth: 'calc(100vw - 2rem)',
        height: 520,
        maxHeight: 'calc(100vh - 8rem)',
        background: 'rgba(13,27,42,0.97)',
        borderRadius: 20,
        border: '1px solid rgba(255,107,157,0.35)',
        boxShadow: '0 8px 40px rgba(123,47,190,0.4), 0 2px 8px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
        pointerEvents: open ? 'all' : 'none',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        backdropFilter: 'blur(16px)',
      }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #7B2FBE 0%, #FF6B9D 100%)',
          padding: '0.9rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          flexShrink: 0,
        }}>
          {/* Avatar */}
          <div style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            border: '2px solid rgba(255,255,255,0.4)',
            flexShrink: 0,
          }}>🌸</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>
              Miyuki-chan
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{
                width: 7, height: 7,
                background: '#4ade80',
                borderRadius: '50%',
                display: 'inline-block',
                boxShadow: '0 0 6px #4ade80',
              }} />
              AI Chăm sóc khách hàng · OpenAI
            </div>
          </div>

          {/* Nút xóa chat */}
          <button
            onClick={clearChat}
            title="Xóa lịch sử"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: 8,
              padding: '0.28rem 0.5rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            🗑 Xóa
          </button>
        </div>

        {/* ── Messages ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          scrollBehavior: 'smooth',
        }}>

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: '0.4rem',
            }}>
              {/* Avatar bot */}
              {msg.role === 'assistant' && (
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7B2FBE, #FF6B9D)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  flexShrink: 0,
                  marginBottom: 2,
                }}>🌸</div>
              )}

              <div style={{
                maxWidth: '78%',
                padding: '0.6rem 0.85rem',
                borderRadius: msg.role === 'user'
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #7B2FBE, #FF6B9D)'
                  : 'rgba(255,255,255,0.08)',
                border: msg.role === 'user'
                  ? 'none'
                  : '1px solid rgba(255,107,157,0.2)',
                color: 'white',
                fontSize: '0.85rem',
                lineHeight: 1.55,
                wordBreak: 'break-word',
              }}>
                {renderText(msg.content)}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem' }}>
              <div style={{
                width: 28, height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7B2FBE, #FF6B9D)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', flexShrink: 0,
              }}>🌸</div>
              <div style={{
                padding: '0.6rem 0.9rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,107,157,0.2)',
                borderRadius: '16px 16px 16px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}>
                {[0, 1, 2].map(d => (
                  <span key={d} style={{
                    width: 7, height: 7,
                    background: '#FF6B9D',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: `typingDot 1.2s ease-in-out ${d * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Câu hỏi gợi ý ── */}
        {showQuick && messages.length <= 1 && (
          <div style={{
            padding: '0 0.9rem 0.6rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            flexShrink: 0,
          }}>
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  background: 'rgba(255,107,157,0.12)',
                  border: '1px solid rgba(255,107,157,0.3)',
                  color: '#FFB3CC',
                  borderRadius: 50,
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,107,157,0.25)'
                  e.currentTarget.style.borderColor = 'rgba(255,107,157,0.6)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,107,157,0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255,107,157,0.3)'
                  e.currentTarget.style.color = '#FFB3CC'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* ── Input area ── */}
        <div style={{
          padding: '0.7rem 0.9rem',
          borderTop: '1px solid rgba(255,107,157,0.15)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-end',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.02)',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi... (Enter để gửi)"
            rows={1}
            disabled={loading}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,107,157,0.3)',
              borderRadius: 12,
              color: 'white',
              padding: '0.6rem 0.85rem',
              fontSize: '0.85rem',
              fontFamily: 'Nunito, sans-serif',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
              maxHeight: 80,
              overflowY: 'auto',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,157,0.7)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,107,157,0.3)'}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #FF6B9D, #7B2FBE)'
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              transition: 'all 0.25s',
              flexShrink: 0,
              boxShadow: input.trim() && !loading
                ? '0 2px 12px rgba(255,107,157,0.4)'
                : 'none',
            }}
            aria-label="Gửi"
          >
            {loading ? '⏳' : '➤'}
          </button>
        </div>

        {/* Powered by */}
        <div style={{
          textAlign: 'center',
          padding: '0.3rem',
          fontSize: '0.65rem',
          color: 'rgba(176,160,204,0.5)',
          flexShrink: 0,
        }}>
          ✨ Powered by OpenRouter · GPT-4o mini
        </div>
      </div>

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes chatPulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          70%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
          30%           { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  )
}
