import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tripService, bookingService, paymentService } from '../services/api'

const PAYMENT_METHODS = [
  {
    id: 'VNPAY',
    label: 'VNPay',
    icon: '💳',
    desc: 'Thanh toán qua cổng VNPay (ATM, QR, Visa)',
  },
  {
    id: 'CASH',
    label: 'Tiền mặt',
    icon: '💵',
    desc: 'Thanh toán trực tiếp tại quầy',
  },
]

export default function BookingPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()

  const [trip, setTrip] = useState(null)
  const [seats, setSeats] = useState([])
  const [selected, setSelected] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('VNPAY')
  const [step, setStep] = useState(1) // 1: chọn ghế, 2: chọn thanh toán
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      tripService.getTripById(tripId),
      tripService.getSeatsByTrip(tripId).catch(() => ({ data: [] })),
    ])
      .then(([t, s]) => { setTrip(t.data); setSeats(s.data || []) })
      .catch(() => setError('Không tải được thông tin chuyến đi'))
      .finally(() => setLoading(false))
  }, [tripId])

  const toggleSeat = (seat) => {
    if (!seat.isAvailable) return
    setError('')
    setSelected(prev => {
      const exists = prev.find(s => s.seatId === seat.seatId)
      if (exists) return prev.filter(s => s.seatId !== seat.seatId)
      if (prev.length >= 5) { setError('Chỉ được chọn tối đa 5 ghế'); return prev }
      return [...prev, seat]
    })
  }

  const goToPaymentStep = () => {
    if (!selected.length) { setError('Vui lòng chọn ít nhất một ghế'); return }
    setError('')
    setStep(2)
  }

  const handleBook = async () => {
    setSubmitting(true)
    setError('')
    try {
      // 1. Tạo booking
      const { data: booking } = await bookingService.createBooking({
        tripId: Number(tripId),
        seatIds: selected.map(s => s.seatId),
      })

      if (paymentMethod === 'VNPAY') {
        // 2a. Lấy URL VNPay rồi redirect
        const { data } = await paymentService.createVNPayPayment(booking.bookingId)
        window.location.href = data.paymentUrl
      } else {
        // 2b. CASH: tạo payment thường
        await paymentService.createPayment({ bookingId: booking.bookingId, paymentMethod: 'CASH' })
        navigate('/my-bookings')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt vé thất bại, vui lòng thử lại')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={centerStyle}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem' }}>🔄</div><p>Đang tải...</p>
      </div>
    </div>
  )

  const total = trip ? trip.price * selected.length : 0
  const seatRows = []
  for (let i = 0; i < seats.length; i += 4) seatRows.push(seats.slice(i, i + 4))

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 10, padding: '5rem 1.5rem 3rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Back button */}
        <button
          onClick={() => step === 2 ? setStep(1) : navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1rem', fontFamily: 'Nunito,sans-serif' }}
        >
          ← {step === 2 ? 'Quay lại chọn ghế' : 'Quay lại'}
        </button>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[{ n: 1, label: 'Chọn ghế' }, { n: 2, label: 'Thanh toán' }].map(({ n, label }) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step >= n ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 800, color: 'white',
              }}>{n}</div>
              <span style={{ fontSize: '0.85rem', color: step >= n ? 'white' : 'var(--text-muted)', fontWeight: step === n ? 700 : 400 }}>{label}</span>
              {n < 2 && <span style={{ color: 'var(--text-muted)', margin: '0 0.25rem' }}>›</span>}
            </div>
          ))}
        </div>

        {/* Trip info card */}
        {trip && (
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.4rem' }}>
                {trip.route?.departureCity} <span style={{ color: 'var(--sakura)' }}>→</span> {trip.route?.destinationCity}
              </h1>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>🕐 {new Date(trip.departureTime).toLocaleString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                <span>🚌 {trip.bus?.busName || 'Xe khách'}</span>
                <span>{trip.availableSeats} ghế trống</span>
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, background: 'linear-gradient(90deg,#FF6B9D,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {Number(trip.price).toLocaleString('vi-VN')}đ/ghế
            </div>
          </div>
        )}

        {/* ── STEP 1: Chọn ghế ── */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
            {/* Seat map */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Chọn ghế</h2>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
                {[['#1E3A5F', 'rgba(255,255,255,0.15)', 'Còn trống'], ['#FF6B9D', '#FF6B9D', 'Đã chọn'], ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'Đã đặt']].map(([bg, border, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: 20, height: 20, background: bg, border: `1px solid ${border}`, borderRadius: 4 }} />
                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Seat grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {seatRows.map((row, ri) => (
                  <div key={ri} style={{ display: 'flex', gap: '0.5rem' }}>
                    {row.map(seat => {
                      const isSelected = selected.find(s => s.seatId === seat.seatId)
                      return (
                        <button
                          key={seat.seatId}
                          onClick={() => toggleSeat(seat)}
                          disabled={!seat.isAvailable}
                          title={`${seat.seatNumber} - ${seat.seatType}`}
                          style={{
                            width: 52, height: 52, borderRadius: 8,
                            border: isSelected ? '2px solid #FF6B9D' : '1px solid rgba(255,255,255,0.15)',
                            background: !seat.isAvailable
                              ? 'rgba(255,255,255,0.07)'
                              : isSelected
                                ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)'
                                : '#1E3A5F',
                            color: 'white', cursor: seat.isAvailable ? 'pointer' : 'not-allowed',
                            fontSize: '0.7rem', fontWeight: 700,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                          }}
                        >
                          <span>{seat.seatNumber}</span>
                          <span style={{ fontSize: '0.6rem', opacity: 0.75 }}>
                            {seat.seatType === 'VIP' ? '⭐' : seat.seatType === 'WINDOW' ? '🪟' : ''}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary sidebar */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '1.5rem', position: 'sticky', top: '5rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Tóm tắt</h3>

              {selected.length === 0
                ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa chọn ghế nào</p>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {selected.map(s => (
                      <div key={s.seatId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>Ghế {s.seatNumber} ({s.seatType})</span>
                        <span>{Number(trip?.price).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                    <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                      <span>Tổng cộng</span>
                      <span style={{ color: '#FF6B9D' }}>{total.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                )
              }

              {error && <p style={{ color: '#FF6B9D', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{error}</p>}

              <button
                onClick={goToPaymentStep}
                disabled={!selected.length}
                style={{
                  width: '100%', padding: '0.85rem',
                  background: selected.length ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'rgba(255,255,255,0.1)',
                  color: 'white', border: 'none', borderRadius: 12,
                  fontWeight: 800, fontSize: '1rem', cursor: selected.length ? 'pointer' : 'not-allowed',
                  fontFamily: 'Nunito,sans-serif',
                }}
              >
                Tiếp tục →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Chọn phương thức thanh toán ── */}
        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
            {/* Payment methods */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Chọn phương thức thanh toán</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.25rem', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                      background: paymentMethod === method.id ? 'rgba(255,107,157,0.12)' : 'rgba(255,255,255,0.04)',
                      border: paymentMethod === method.id ? '2px solid #FF6B9D' : '1px solid rgba(255,255,255,0.12)',
                      transition: 'all 0.2s', width: '100%', fontFamily: 'Nunito,sans-serif',
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{method.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: 'white', marginBottom: '0.2rem' }}>{method.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{method.desc}</div>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: paymentMethod === method.id ? '2px solid #FF6B9D' : '2px solid rgba(255,255,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {paymentMethod === method.id && (
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF6B9D' }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'VNPAY' && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(255,107,157,0.06)', borderRadius: 10, border: '1px solid rgba(255,107,157,0.2)' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                    💡 Bạn sẽ được chuyển sang cổng thanh toán <strong style={{ color: 'white' }}>VNPay</strong> để hoàn tất giao dịch.
                    Hỗ trợ: thẻ ATM nội địa, ví VNPay, QR Pay.
                  </p>
                </div>
              )}
            </div>

            {/* Summary + confirm */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '1.5rem', position: 'sticky', top: '5rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Xác nhận đặt vé</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Tuyến</span>
                  <span style={{ color: 'white', fontWeight: 600 }}>{trip?.route?.departureCity} → {trip?.route?.destinationCity}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Số ghế</span>
                  <span style={{ color: 'white', fontWeight: 600 }}>{selected.length} ghế ({selected.map(s => s.seatNumber).join(', ')})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Phương thức</span>
                  <span style={{ color: 'white', fontWeight: 600 }}>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</span>
                </div>
                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Tổng cộng</span>
                  <span style={{ color: '#FF6B9D' }}>{total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {error && <p style={{ color: '#FF6B9D', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{error}</p>}

              <button
                onClick={handleBook}
                disabled={submitting}
                style={{
                  width: '100%', padding: '0.85rem',
                  background: submitting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#FF6B9D,#7B2FBE)',
                  color: 'white', border: 'none', borderRadius: 12,
                  fontWeight: 800, fontSize: '1rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Nunito,sans-serif',
                  boxShadow: submitting ? 'none' : '0 4px 20px rgba(255,107,157,0.35)',
                }}
              >
                {submitting
                  ? '⏳ Đang xử lý...'
                  : paymentMethod === 'VNPAY'
                    ? '💳 Thanh toán VNPay'
                    : '✅ Xác nhận đặt vé'}
              </button>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                🔒 Giao dịch được bảo mật bởi VNPay
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const centerStyle = {
  minHeight: '100vh', display: 'flex', alignItems: 'center',
  justifyContent: 'center', position: 'relative', zIndex: 10,
}
