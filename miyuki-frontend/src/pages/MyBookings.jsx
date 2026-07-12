import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingService, refundService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS = {
  PENDING:   { label: 'Chờ xác nhận', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  CONFIRMED: { label: 'Đã xác nhận',  color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  CANCELLED: { label: 'Đã hủy',        color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  COMPLETED: { label: 'Hoàn thành',   color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
}
const REFUND_STATUS = {
  PENDING:   { label: 'Chờ duyệt',  color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  APPROVED:  { label: 'Đã duyệt',   color: '#2196F3', bg: 'rgba(33,150,243,0.12)' },
  COMPLETED: { label: 'Hoàn thành', color: '#4CAF50', bg: 'rgba(76,175,80,0.12)' },
  REJECTED:  { label: 'Từ chối',    color: '#F44336', bg: 'rgba(244,67,54,0.12)' },
}

const PAYMENT = {
  UNPAID:   { label: 'Chưa thanh toán', color: '#fb923c' },
  PAID:     { label: 'Đã thanh toán',   color: '#4ade80' },
  REFUNDED: { label: 'Đã hoàn tiền',    color: '#c084fc' },
}

function safeDate(dt) {
  if (!dt) return '-'
  try {
    const d = new Date(dt)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch { return '-' }
}

function safeDateShort(dt) {
  if (!dt) return '-'
  try {
    const d = new Date(dt)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('vi-VN')
  } catch { return '-' }
}

export default function MyBookings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [filter, setFilter] = useState('ALL')
  const [error, setError] = useState('')
  const [refunding, setRefunding] = useState(null)
  const [showRefundModal, setShowRefundModal] = useState(null)
  const [refundReason, setRefundReason] = useState('')
  const [submittingRefund, setSubmittingRefund] = useState(false)
  const [refunds, setRefunds] = useState([])

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await bookingService.getMyBookings()
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError('Không tải được danh sách vé')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy vé này?')) return
    setCancelling(id)
    try {
      await bookingService.cancelBooking(id)
      await fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Hủy vé thất bại')
    } finally {
      setCancelling(null)
    }
  }

  const handleRequestRefund = async () => {
    if (!showRefundModal) return
    setSubmittingRefund(true)
    try {
      await refundService.requestRefund({
        userId: user.userId,
        bookingId: showRefundModal.bookingId,
        reason: refundReason,
      })
      alert('Yêu cầu hoàn tiền đã được gửi!')
      setShowRefundModal(null)
      setRefundReason('')
      await fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Gửi yêu cầu thất bại')
    } finally {
      setSubmittingRefund(false)
    }
  }

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.bookingStatus === filter)

  return (
    <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '5rem 1.5rem 3rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem' }}>🎫 Vé Của Tôi</h1>

        {/* Refund modal */}
        {showRefundModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setShowRefundModal(null)}>
            <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,107,157,0.3)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 440 }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ color: '#FF6B9D', fontWeight: 800, fontSize: '1.1rem' }}>💸 Yêu cầu hoàn tiền</div>
                <button onClick={() => setShowRefundModal(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ccc', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>
              <div style={{ color: '#B0A0CC', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                Vé <strong style={{ color: 'white', fontFamily: 'monospace' }}>{showRefundModal.bookingCode}</strong> sẽ được hoàn tiền <strong style={{ color: '#FFD700' }}>{Number(showRefundModal.totalPrice).toLocaleString('vi-VN')}₫</strong>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#B0A0CC', fontSize: '0.8rem', fontWeight: 600 }}>Lý do hoàn tiền (không bắt buộc)</label>
                <textarea value={refundReason} onChange={e => setRefundReason(e.target.value)}
                  style={{ width: '100%', marginTop: '0.4rem', padding: '0.7rem', borderRadius: 10, border: '1px solid rgba(255,107,157,0.3)', background: 'rgba(13,27,42,0.8)', color: 'white', fontSize: '0.85rem', resize: 'vertical', fontFamily: 'inherit', minHeight: 80 }}
                  placeholder="Nhập lý do hoàn tiền..." />
              </div>
              <button onClick={handleRequestRefund} disabled={submittingRefund}
                style={{ width: '100%', background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: 12, fontWeight: 800, cursor: submittingRefund ? 'wait' : 'pointer', fontFamily: 'inherit', fontSize: '0.95rem', opacity: submittingRefund ? 0.7 : 1 }}>
                {submittingRefund ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'transparent',
              border: filter === s ? 'none' : '1px solid rgba(255,255,255,0.2)',
              color: filter === s ? 'white' : '#B0A0CC',
              padding: '0.4rem 1rem', borderRadius: 50, fontSize: '0.82rem',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito,sans-serif'
            }}>
              {s === 'ALL' ? `Tất cả (${bookings.length})` : STATUS[s]?.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#B0A0CC' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
            <p>Đang tải vé của bạn...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#f87171' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p>{error}</p>
            <button onClick={fetchBookings} style={{ marginTop: '1rem', background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: 10, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', fontWeight: 700 }}>Thử lại</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,107,157,0.35)', borderRadius: 20, padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎫</div>
            <p style={{ color: '#B0A0CC', marginBottom: '1.5rem' }}>
              {filter === 'ALL' ? 'Bạn chưa có vé nào' : 'Không có vé trong trạng thái này'}
            </p>
            <button onClick={() => navigate('/search')} style={{ background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: 50, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
              🔍 Tìm Chuyến Đi
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(b => {
              const st  = STATUS[b.bookingStatus]  || STATUS.PENDING
              const py  = PAYMENT[b.paymentStatus] || PAYMENT.UNPAID
              const canCancel = ['PENDING', 'CONFIRMED'].includes(b.bookingStatus)
              const departure = b.trip?.route?.departureCity  || '?'
              const destination = b.trip?.route?.destinationCity || '?'

              return (
                <div key={b.bookingId} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,107,157,0.35)', borderRadius: 16, padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      {/* Route */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{departure}</span>
                        <span style={{ color: '#FF6B9D' }}>→</span>
                        <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{destination}</span>
                      </div>
                      {/* Details */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1.5rem', fontSize: '0.82rem', color: '#B0A0CC', marginBottom: '0.75rem' }}>
                        <span>📅 {safeDate(b.trip?.departureTime)}</span>
                        <span>🎫 Mã: <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '0.8rem' }}>{b.bookingCode}</span></span>
                        <span style={{ color: py.color }}>💳 {py.label}</span>
                        <span>🕐 Đặt: {safeDateShort(b.createdAt)}</span>
                      </div>
                      {/* Status badge */}
                      <span style={{ display: 'inline-block', background: st.bg, color: st.color, border: `1px solid ${st.color}40`, padding: '0.2rem 0.8rem', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700 }}>
                        {st.label}
                      </span>
                    </div>
                    {/* Price + cancel */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, background: 'linear-gradient(90deg,#FF6B9D,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' }}>
                        {Number(b.totalPrice || 0).toLocaleString('vi-VN')}đ
                      </div>
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(b.bookingId)}
                          disabled={cancelling === b.bookingId}
                          style={{ background: 'transparent', border: '1px solid rgba(248,113,113,0.4)', color: '#f87171', padding: '0.35rem 1rem', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Nunito,sans-serif', fontWeight: 700, opacity: cancelling === b.bookingId ? 0.5 : 1 }}>
                          {cancelling === b.bookingId ? 'Đang hủy...' : 'Hủy vé'}
                        </button>
                      )}
                      {b.bookingStatus === 'CANCELLED' && b.paymentStatus === 'PAID' && (
                        <button
                          onClick={() => setShowRefundModal({ bookingId: b.bookingId, bookingCode: b.bookingCode, totalPrice: b.totalPrice })}
                          style={{ marginTop: '0.4rem', background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', border: 'none', color: 'white', padding: '0.35rem 1rem', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Nunito,sans-serif', fontWeight: 700 }}>
                          💸 Yêu cầu hoàn tiền
                        </button>
                      )}
                      {b.paymentStatus === 'REFUNDED' && (
                        <div style={{ marginTop: '0.4rem', background: 'rgba(192,132,252,0.12)', color: '#c084fc', padding: '0.25rem 0.7rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700 }}>
                          ✅ Đã hoàn tiền
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
