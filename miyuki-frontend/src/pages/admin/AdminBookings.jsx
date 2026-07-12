import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { th, td, TableCard, LoadingRow, EmptyRow, ErrorBanner, FilterTabs, RefreshButton, Pagination } from '../../components/admin/AdminTable'

const fmtVND = v => v ? Number(v).toLocaleString('vi-VN') + ' ₫' : '-'
const fmtDate = dt => dt ? new Date(dt).toLocaleDateString('vi-VN') : '-'
const fmtDT = dt => {
  if (!dt) return '-'
  const d = new Date(dt)
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function BookingBadge({ status }) {
  const map = {
    PENDING:   { bg: 'rgba(255,193,7,0.15)',  color: '#FFD700', label: '⏳ Chờ xử lý' },
    CONFIRMED: { bg: 'rgba(76,175,80,0.15)',  color: '#4CAF50', label: '✅ Xác nhận' },
    CANCELLED: { bg: 'rgba(244,67,54,0.15)',  color: '#F44336', label: '❌ Đã huỷ' },
    COMPLETED: { bg: 'rgba(33,150,243,0.15)', color: '#2196F3', label: '✔ Hoàn thành' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status }
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{s.label}</span>
}

function PaymentBadge({ status }) {
  const map = {
    UNPAID:   { bg: 'rgba(255,152,0,0.15)', color: '#FF9800', label: 'Chưa TT' },
    PAID:     { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50', label: 'Đã TT' },
    REFUNDED: { bg: 'rgba(158,158,158,0.15)', color: '#9E9E9E', label: 'Hoàn tiền' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status }
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{s.label}</span>
}

function StatsCard({ icon, label, value, color }) {
  return (
    <div style={{ flex: 1, minWidth: 150, background: 'rgba(13,27,42,0.95)', border: `1px solid ${color || 'rgba(255,107,157,0.2)'}`, borderRadius: 12, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
      <span style={{ fontSize: '1.6rem' }}>{icon}</span>
      <div>
        <div style={{ color: '#B0A0CC', fontSize: '0.72rem', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 900, background: 'linear-gradient(135deg,#FF6B9D,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
      </div>
    </div>
  )
}

function BookingDetailModal({ booking, onClose, onAction, updating }) {
  if (!booking) return null
  const row = (label, value) => (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 0' }}>
      <span style={{ color: '#7B5FA0', fontSize: '0.82rem', width: 140, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'white', fontSize: '0.85rem' }}>{value || '-'}</span>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}>
      <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,107,157,0.3)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 520 }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ color: '#FF6B9D', fontSize: '0.72rem', fontWeight: 700, letterSpacing: 1 }}>MÃ VÉ</div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'monospace', marginTop: '0.15rem' }}>{booking.bookingCode}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ccc', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
        {row('Khách hàng', booking.user?.fullName || '-')}
        {row('Email', booking.user?.email || '-')}
        {row('Tuyến đường', booking.trip?.route ? `${booking.trip.route.departureCity} → ${booking.trip.route.destinationCity}` : '-')}
        {row('Giờ khởi hành', fmtDT(booking.trip?.departureTime))}
        {row('Ngày đi', fmtDate(booking.departureDate))}
        {row('Tổng tiền', fmtVND(booking.totalPrice))}
        {row('Trạng thái', <BookingBadge status={booking.bookingStatus} />)}
        {row('Phương thức', booking.paymentMethod || 'CASH')}
        {row('Thanh toán', <PaymentBadge status={booking.paymentStatus} />)}
        {row('Ngày tạo', fmtDT(booking.createdAt))}
        {booking.cancelledAt && row('Ngày huỷ', fmtDT(booking.cancelledAt))}
      </div>
    </div>
  )
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [detail, setDetail] = useState(null)
  const [updating, setUpdating] = useState(null)

  const fetchBookings = (p = 0, f = filter) => {
    setLoading(true); setError('')
    adminService.getBookings(p, 10, f)
      .then(res => { setBookings(res.data?.content || []); setTotalPages(res.data?.totalPages || 0); setTotalElements(res.data?.totalElements || 0); setPage(p) })
      .catch(err => setError(err.response?.data?.message || 'Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings(0, filter)
    adminService.getBookingStats().then(r => setStats(r.data)).catch(() => {})
  }, [filter])

  const handleAction = (id, status, label) => {
    if (!window.confirm(`${label} vé này?`)) return
    setUpdating(id)
    adminService.updateBookingStatus(id, status)
      .then(() => { setDetail(null); fetchBookings(page) })
      .catch(err => alert('Lỗi: ' + (err.response?.data?.message || err.message)))
      .finally(() => setUpdating(null))
  }

  const nextActions = (b) => {
    const acts = []
    if (b.bookingStatus === 'PENDING') acts.push(['CONFIRMED', '✅ Xác nhận', '#4CAF50'])
    if (b.bookingStatus === 'PENDING') acts.push(['CANCELLED', '❌ Huỷ', '#F44336'])
    if (b.bookingStatus === 'CONFIRMED') acts.push(['COMPLETED', '✔ Hoàn thành', '#2196F3'])
    if (b.bookingStatus === 'CONFIRMED') acts.push(['CANCELLED', '❌ Huỷ', '#F44336'])
    return acts
  }

  return (
    <div>
      <BookingDetailModal booking={detail} onClose={() => setDetail(null)} onAction={handleAction} updating={updating} />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <StatsCard icon="🎫" label="Tổng vé" value={stats?.totalBookings ?? totalElements} />
        <StatsCard icon="✅" label="Đã xác nhận" value={stats?.confirmedBookings ?? 0} color="rgba(76,175,80,0.3)" />
        <StatsCard icon="⏳" label="Đang chờ" value={stats?.pendingBookings ?? 0} color="rgba(255,215,0,0.3)" />
        <StatsCard icon="💰" label="Doanh thu" value={fmtVND(stats?.totalRevenue)} color="rgba(255,215,0,0.3)" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        <FilterTabs options={[['ALL', 'Tất cả'], ['PENDING', 'Chờ xử lý'], ['CONFIRMED', 'Xác nhận'], ['CANCELLED', 'Đã huỷ'], ['COMPLETED', 'Hoàn thành']]} value={filter} onChange={setFilter} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <RefreshButton onClick={() => fetchBookings(page, filter)} />
        </div>
      </div>

      <ErrorBanner message={error} />

      <TableCard>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr>{['Mã vé', 'Khách hàng', 'Tuyến đường', 'Ngày đi', 'Tổng tiền', 'Trạng thái', 'Thanh toán', 'Thao tác'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow colSpan={8} /> : bookings.length === 0 ? <EmptyRow colSpan={8} message="Không có đặt vé" icon="🎫" /> : bookings.map((b, i) => (
              <tr key={b.bookingId} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ ...td(), color: '#FF6B9D', fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer' }}
                  onClick={() => setDetail(b)}>{b.bookingCode}</td>
                <td style={{ ...td(), color: 'white' }}>{b.user?.fullName || '-'}</td>
                <td style={td()}>{b.trip?.route ? `${b.trip.route.departureCity} → ${b.trip.route.destinationCity}` : '-'}</td>
                <td style={td()}>{fmtDate(b.departureDate)}</td>
                <td style={{ ...td(), color: '#FFD700', fontWeight: 700 }}>{fmtVND(b.totalPrice)}</td>
                <td style={td()}><BookingBadge status={b.bookingStatus} /></td>
                <td style={td()}><PaymentBadge status={b.paymentStatus} /></td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setDetail(b)}
                      style={{ background: 'rgba(33,150,243,0.12)', color: '#2196F3', border: '1px solid rgba(33,150,243,0.35)', padding: '0.25rem 0.6rem', borderRadius: 7, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'inherit' }}>
                      👁 Xem
                    </button>
                    {nextActions(b).map(([status, label, color]) => (
                      <button key={status} disabled={updating === b.bookingId}
                        onClick={() => handleAction(b.bookingId, status, label)}
                        style={{ background: `${color}18`, color, border: `1px solid ${color}44`, padding: '0.25rem 0.6rem', borderRadius: 7, cursor: updating === b.bookingId ? 'not-allowed' : 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'inherit', opacity: updating === b.bookingId ? 0.5 : 1 }}>
                        {updating === b.bookingId ? '⏳' : label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: '1px solid rgba(255,107,157,0.1)', padding: '0 1rem' }}>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchBookings(p, filter)} />
        </div>
      </TableCard>
    </div>
  )
}
