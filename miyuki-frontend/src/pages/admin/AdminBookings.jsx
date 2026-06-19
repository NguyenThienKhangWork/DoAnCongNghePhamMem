import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = []
  const start = Math.max(0, page - 2)
  const end = Math.min(totalPages - 1, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return (
    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
      <button onClick={() => onChange(page - 1)} disabled={page === 0} style={btnPage(false, page === 0)}>← Trước</button>
      {start > 0 && <span style={{ color: '#7B5FA0' }}>...</span>}
      {pages.map(p => <button key={p} onClick={() => onChange(p)} style={btnPage(p === page, false)}>{p + 1}</button>)}
      {end < totalPages - 1 && <span style={{ color: '#7B5FA0' }}>...</span>}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1} style={btnPage(false, page >= totalPages - 1)}>Tiếp →</button>
    </div>
  )
}
function btnPage(active, disabled) {
  return {
    padding: '0.35rem 0.8rem', borderRadius: 8,
    border: active ? 'none' : '1px solid rgba(255,107,157,0.3)',
    background: active ? 'linear-gradient(135deg, #FF6B9D, #7B2FBE)' : 'transparent',
    color: disabled ? '#555' : (active ? 'white' : '#B0A0CC'),
    fontWeight: 600, fontSize: '0.82rem', cursor: disabled ? 'not-allowed' : 'pointer',
  }
}

function BookingBadge({ status }) {
  const map = {
    PENDING: { bg: 'rgba(255,193,7,0.15)', color: '#FFD700', label: 'Chờ xử lý' },
    CONFIRMED: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50', label: 'Xác nhận' },
    CANCELLED: { bg: 'rgba(244,67,54,0.15)', color: '#F44336', label: 'Đã huỷ' },
    COMPLETED: { bg: 'rgba(33,150,243,0.15)', color: '#2196F3', label: 'Hoàn thành' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status }
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{s.label}</span>
}

function PaymentBadge({ status }) {
  const map = {
    UNPAID: { bg: 'rgba(255,152,0,0.15)', color: '#FF9800', label: 'Chưa TT' },
    PAID: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50', label: 'Đã TT' },
    REFUNDED: { bg: 'rgba(158,158,158,0.15)', color: '#9E9E9E', label: 'Hoàn tiền' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status }
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{s.label}</span>
}

function formatVND(v) { return v ? Number(v).toLocaleString('vi-VN') + ' ₫' : '-' }
function formatDate(dt) { return dt ? new Date(dt).toLocaleDateString('vi-VN') : '-' }

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)

  const fetchBookings = (p = 0) => {
    setLoading(true)
    adminService.getBookings(p, 10)
      .then(res => {
        setBookings(res.data?.content || [])
        setTotalPages(res.data?.totalPages || 0)
        setTotalElements(res.data?.totalElements || 0)
        setPage(p)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings(0)
    adminService.getBookingStats()
      .then(r => setStats(r.data))
      .catch(console.error)
  }, [])

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.bookingStatus === filter)

  const thStyle = {
    padding: '0.85rem 1rem', textAlign: 'left',
    color: '#FF6B9D', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap',
  }
  const tdStyle = { padding: '0.75rem 1rem', fontSize: '0.83rem', color: '#ccc' }

  const statItems = [
    { label: 'Tổng vé', value: stats?.totalBookings ?? totalElements, icon: '🎫' },
    { label: 'Đã xác nhận', value: stats?.confirmedBookings ?? 0, icon: '✅' },
    { label: 'Đang chờ', value: stats?.pendingBookings ?? 0, icon: '⏳' },
    { label: 'Doanh thu', value: formatVND(stats?.totalRevenue), icon: '💰' },
  ]

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {statItems.map(item => (
          <div key={item.label} style={{
            flex: 1, minWidth: 160,
            background: 'rgba(13,27,42,0.95)',
            border: '1px solid rgba(255,107,157,0.2)',
            borderRadius: 12, padding: '1rem 1.2rem',
            display: 'flex', alignItems: 'center', gap: '0.8rem',
          }}>
            <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
            <div>
              <div style={{ color: '#B0A0CC', fontSize: '0.75rem', fontWeight: 600 }}>{item.label}</div>
              <div style={{
                fontSize: '1.2rem', fontWeight: 900,
                background: 'linear-gradient(135deg, #FF6B9D, #FFD700)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.4rem 1rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            border: filter === f ? 'none' : '1px solid rgba(255,107,157,0.3)',
            background: filter === f ? 'linear-gradient(135deg, #FF6B9D, #7B2FBE)' : 'transparent',
            color: filter === f ? 'white' : '#B0A0CC',
          }}>
            {{ ALL: 'Tất cả', PENDING: 'Chờ xử lý', CONFIRMED: 'Xác nhận', CANCELLED: 'Đã huỷ', COMPLETED: 'Hoàn thành' }[f]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(13,27,42,0.95)',
        border: '1px solid rgba(255,107,157,0.2)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#B0A0CC' }}>⏳ Đang tải...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,107,157,0.08)' }}>
                  {['Mã vé', 'Khách hàng', 'Tuyến đường', 'Ngày đi', 'Tổng tiền', 'Trạng thái vé', 'Thanh toán'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#7B5FA0' }}>Không có đặt vé</td>
                  </tr>
                ) : filtered.map((b, i) => (
                  <tr key={b.bookingId} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ ...tdStyle, color: '#FF6B9D', fontWeight: 700 }}>{b.bookingCode}</td>
                    <td style={{ ...tdStyle, color: 'white' }}>{b.user?.fullName || '-'}</td>
                    <td style={tdStyle}>
                      {b.trip?.route ? `${b.trip.route.departureCity} → ${b.trip.route.destinationCity}` : '-'}
                    </td>
                    <td style={tdStyle}>{formatDate(b.departureDate)}</td>
                    <td style={{ ...tdStyle, color: '#FFD700', fontWeight: 700 }}>{formatVND(b.totalPrice)}</td>
                    <td style={tdStyle}><BookingBadge status={b.bookingStatus} /></td>
                    <td style={tdStyle}><PaymentBadge status={b.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ borderTop: '1px solid rgba(255,107,157,0.1)', padding: '0 1rem' }}>
          <Pagination page={page} totalPages={totalPages} onChange={fetchBookings} />
        </div>
      </div>
    </div>
  )
}
