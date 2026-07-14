import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(8)

  const status      = searchParams.get('status')       // success | failed | invalid | error
  const bookingCode = searchParams.get('bookingCode')
  const amount      = searchParams.get('amount')
  const transId     = searchParams.get('transactionId')

  const isSuccess = status === 'success'

  // Auto redirect sau 8 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          navigate(isSuccess ? '/my-bookings' : '/')
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isSuccess, navigate])

  const config = {
    success: {
      emoji: '🎉',
      title: 'Thanh toán thành công!',
      subtitle: 'Vé của bạn đã được xác nhận.',
      color: '#4ade80',
      gradFrom: '#14532d',
      redirectLabel: 'Xem vé của tôi',
      redirectPath: '/my-bookings',
    },
    failed: {
      emoji: '❌',
      title: 'Thanh toán thất bại',
      subtitle: 'Giao dịch không thành công. Vui lòng thử lại.',
      color: '#f87171',
      gradFrom: '#450a0a',
      redirectLabel: 'Về trang chủ',
      redirectPath: '/',
    },
    invalid: {
      emoji: '⚠️',
      title: 'Giao dịch không hợp lệ',
      subtitle: 'Chữ ký xác thực không khớp.',
      color: '#fb923c',
      gradFrom: '#431407',
      redirectLabel: 'Về trang chủ',
      redirectPath: '/',
    },
    error: {
      emoji: '🔧',
      title: 'Lỗi hệ thống',
      subtitle: 'Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.',
      color: '#a78bfa',
      gradFrom: '#2e1065',
      redirectLabel: 'Về trang chủ',
      redirectPath: '/',
    },
  }

  const cfg = config[status] || config.error

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', zIndex: 10, padding: '2rem',
    }}>
      <div style={{
        background: 'var(--card-bg)',
        border: `1px solid ${cfg.color}44`,
        borderRadius: 24, padding: '3rem 2.5rem',
        textAlign: 'center', maxWidth: 480, width: '100%',
        boxShadow: `0 8px 40px ${cfg.color}22`,
      }}>

        {/* Icon */}
        <div style={{
          width: 90, height: 90, borderRadius: '50%', margin: '0 auto 1.5rem',
          background: `radial-gradient(circle, ${cfg.color}22, transparent)`,
          border: `2px solid ${cfg.color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem',
        }}>
          {cfg.emoji}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: cfg.color }}>
          {cfg.title}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          {cfg.subtitle}
        </p>

        {/* Details */}
        {(bookingCode || amount || transId) && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, padding: '1.25rem', marginBottom: '2rem', textAlign: 'left',
          }}>
            {bookingCode && (
              <InfoRow label="Mã đặt vé" value={<strong style={{ color: 'white', letterSpacing: 1 }}>{bookingCode}</strong>} />
            )}
            {amount && (
              <InfoRow label="Số tiền" value={<span style={{ color: cfg.color, fontWeight: 700 }}>{Number(amount).toLocaleString('vi-VN')}đ</span>} />
            )}
            {transId && transId !== '' && (
              <InfoRow label="Mã giao dịch" value={<span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{transId}</span>} />
            )}
            <InfoRow label="Cổng thanh toán" value="VNPay" last />
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(cfg.redirectPath)}
            style={{
              padding: '0.75rem 2rem',
              background: `linear-gradient(135deg, ${cfg.color}, #7B2FBE)`,
              color: 'white', border: 'none', borderRadius: 50,
              fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif',
              fontSize: '0.95rem',
            }}
          >
            {cfg.redirectLabel}
          </button>

          {!isSuccess && (
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '0.75rem 2rem',
                background: 'rgba(255,255,255,0.08)',
                color: 'white', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 50, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Nunito,sans-serif', fontSize: '0.95rem',
              }}
            >
              Thử lại
            </button>
          )}
        </div>

        {/* Countdown */}
        <p style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Tự động chuyển hướng sau <strong style={{ color: 'white' }}>{countdown}s</strong>
        </p>
      </div>
    </div>
  )
}

function InfoRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.45rem 0',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.07)',
    }}>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: '0.85rem' }}>{value}</span>
    </div>
  )
}
