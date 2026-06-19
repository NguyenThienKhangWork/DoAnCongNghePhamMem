import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tripService, bookingService, paymentService } from '../services/api'

export default function BookingPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [seats, setSeats] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    Promise.all([
      tripService.getTripById(tripId),
      tripService.getSeatsByTrip(tripId).catch(() => ({ data: [] }))
    ]).then(([t, s]) => { setTrip(t.data); setSeats(s.data || []) })
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

  const handleBook = async () => {
    if (!selected.length) { setError('Vui lòng chọn ít nhất một ghế'); return }
    setSubmitting(true); setError('')
    try {
      const { data: booking } = await bookingService.createBooking({ tripId: Number(tripId), seatIds: selected.map(s => s.seatId) })
      await paymentService.createPayment({ bookingId: booking.bookingId, paymentMethod: 'CASH' })
      setDone(true)
      setTimeout(() => navigate('/my-bookings'), 3000)
    } catch (err) { setError(err.response?.data?.message || 'Đặt vé thất bại, vui lòng thử lại') }
    finally { setSubmitting(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}><div style={{ fontSize: '3rem' }}>🔄</div><p>Đang tải...</p></div>
    </div>
  )

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 24, padding: '3rem', textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.75rem' }}>Đặt vé thành công!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Vé của bạn đã được xác nhận. Đang chuyển hướng...</p>
        <button onClick={() => navigate('/my-bookings')} style={{ background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: 50, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
          Xem vé của tôi
        </button>
      </div>
    </div>
  )

  const total = trip ? trip.price * selected.length : 0
  const seatRows = []
  for (let i = 0; i < seats.length; i += 4) seatRows.push(seats.slice(i, i + 4))

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 10, padding: '5rem 1.5rem 3rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1rem', fontFamily: 'Nunito,sans-serif' }}>← Quay lại</button>

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Seat map */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Chọn ghế</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
              {[['#1E3A5F','rgba(255,255,255,0.15)','Còn trống'],['#FF6B9D','#FF6B9D','Đã chọn'],['rgba(255,255,255,0.1)','rgba(255,255,255,0.1)','Đã đặt']].map(([bg, border, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 20, height: 20, background: bg, border: `1px solid ${border}`, borderRadius: 4 }} />
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
            {seatRows.length > 0 ? (
              <div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>🚘 Đầu xe (Tài xế)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                  {seatRows.map((row, ri) => (
                    <div key={ri} style={{ display: 'flex', gap: '0.4rem' }}>
                      {row.map((seat, ci) => {
                        const isSel = !!selected.find(s => s.seatId === seat.seatId)
                        return (
                          <button key={seat.seatId} onClick={() => toggleSeat(seat)} disabled={!seat.isAvailable} title={seat.seatNumber}
                            style={{ width: 44, height: 44, borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: seat.isAvailable ? 'pointer' : 'not-allowed', border: `1px solid ${!seat.isAvailable ? 'rgba(255,255,255,0.1)' : isSel ? '#FF6B9D' : 'rgba(255,255,255,0.2)'}`, background: !seat.isAvailable ? 'rgba(255,255,255,0.05)' : isSel ? '#FF6B9D' : '#1E3A5F', color: !seat.isAvailable ? 'rgba(255,255,255,0.3)' : isSel ? 'white' : 'var(--text)', transition: 'all 0.15s', marginRight: ci === 1 ? '1rem' : 0, boxShadow: isSel ? '0 4px 12px rgba(255,107,157,0.4)' : 'none' }}>
                            {seat.seatNumber}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p>Ghế sẽ được cấp tự động khi đặt vé</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Tóm tắt</h2>
            {selected.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Chưa chọn ghế nào</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                {selected.map(s => (
                  <div key={s.seatId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Ghế {s.seatNumber}</span>
                    <span>{Number(trip.price).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tổng cộng</span>
              <span style={{ fontSize: '1.3rem', background: 'linear-gradient(90deg,#FF6B9D,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{Number(total).toLocaleString('vi-VN')}đ</span>
            </div>
            {error && <div style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', padding: '0.6rem 0.8rem', borderRadius: 8, fontSize: '0.82rem', marginBottom: '1rem' }}>{error}</div>}
            <button onClick={handleBook} disabled={!selected.length || submitting}
              style={{ background: !selected.length || submitting ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.85rem', width: '100%', borderRadius: 12, fontWeight: 800, cursor: !selected.length || submitting ? 'not-allowed' : 'pointer', fontFamily: 'Nunito,sans-serif', opacity: !selected.length || submitting ? 0.5 : 1, fontSize: '0.95rem' }}>
              {submitting ? 'Đang xử lý...' : `🎫 Đặt ${selected.length || ''} ghế`}
            </button>
            <p style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: '0.75rem' }}>Bằng cách đặt vé, bạn đồng ý với điều khoản của MiYuki Express</p>
          </div>
        </div>
      </div>
    </div>
  )
}
