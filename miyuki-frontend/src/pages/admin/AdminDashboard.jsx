import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/api'

/* ── helpers ─────────────────────────────────────── */
const fmtVND = v => v ? Number(v).toLocaleString('vi-VN') + ' ₫' : '0 ₫'
const fmtDate = dt => { try { return new Date(dt).toLocaleDateString('vi-VN') } catch { return '-' } }
const fmtDT = dt => {
  if (!dt) return '-'
  const d = new Date(dt)
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

/* ── sub-components ──────────────────────────────── */
function StatCard({ icon, label, value, sub, color, to }) {
  const inner = (
    <div style={{
      background: 'rgba(13,27,42,0.95)',
      border: `1px solid ${color || 'rgba(255,107,157,0.2)'}`,
      borderRadius: 16, padding: '1.25rem 1.5rem',
      flex: 1, minWidth: 170,
      transition: 'transform 0.15s, box-shadow 0.15s',
      cursor: to ? 'pointer' : 'default',
    }}
      onMouseEnter={e => { if (to) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,157,0.15)' } }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
        {to && <span style={{ color: '#7B5FA0', fontSize: '0.75rem' }}>→</span>}
      </div>
      <div style={{ color: '#B0A0CC', fontSize: '0.8rem', fontWeight: 600, margin: '0.5rem 0 0.25rem' }}>{label}</div>
      <div style={{
        fontSize: '1.9rem', fontWeight: 900,
        background: 'linear-gradient(135deg,#FF6B9D,#FFD700)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1.1,
      }}>{value}</div>
      {sub && <div style={{ color: '#7B5FA0', fontSize: '0.72rem', marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none', flex: 1, minWidth: 170, display: 'contents' }}>{inner}</Link> : inner
}

function BookingBadge({ status }) {
  const map = {
    PENDING:   { bg: 'rgba(255,193,7,0.15)',  color: '#FFD700', label: '⏳ Chờ xử lý' },
    CONFIRMED: { bg: 'rgba(76,175,80,0.15)',  color: '#4CAF50', label: '✅ Xác nhận' },
    CANCELLED: { bg: 'rgba(244,67,54,0.15)',  color: '#F44336', label: '❌ Đã huỷ' },
    COMPLETED: { bg: 'rgba(33,150,243,0.15)', color: '#2196F3', label: '✔ Hoàn thành' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status }
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.73rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.label}</span>
}

function TripBadge({ status }) {
  const map = {
    SCHEDULED: { bg: 'rgba(33,150,243,0.15)', color: '#2196F3', label: '📅 Lên lịch' },
    ONGOING:   { bg: 'rgba(76,175,80,0.15)',  color: '#4CAF50', label: '🚌 Đang chạy' },
    COMPLETED: { bg: 'rgba(158,158,158,0.15)',color: '#9E9E9E', label: '✔ Hoàn thành' },
    CANCELLED: { bg: 'rgba(244,67,54,0.15)',  color: '#F44336', label: '❌ Đã huỷ' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status }
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.73rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.label}</span>
}

function SectionCard({ title, children, action }) {
  return (
    <div style={{ background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,107,157,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

const th = { padding: '0.75rem 1rem', textAlign: 'left', color: '#FF6B9D', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(255,107,157,0.06)', whiteSpace: 'nowrap' }
const td = (extra = {}) => ({ padding: '0.7rem 1rem', fontSize: '0.83rem', color: '#ccc', borderTop: '1px solid rgba(255,255,255,0.04)', ...extra })

/* ── main component ──────────────────────────────── */
export default function AdminDashboard() {
  const [stats,    setStats]    = useState(null)
  const [bookings, setBookings] = useState([])
  const [trips,    setTrips]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [sRes, bRes, tRes] = await Promise.all([
        adminService.getStats(),
        adminService.getBookings(0, 6),
        adminService.getTrips(0, 5),
      ])
      setStats(sRes.data)
      setBookings(bRes.data?.content || [])
      setTrips(tRes.data?.content || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Không tải được dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div style={{ textAlign: 'center', color: '#B0A0CC', padding: '5rem 2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite', display: 'inline-block' }}>🌸</div>
      <div style={{ fontSize: '0.9rem' }}>Đang tải dữ liệu...</div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <div style={{ color: '#f87171', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>
      <button onClick={load} style={{ background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
        🔄 Thử lại
      </button>
    </div>
  )

  const revenue = stats?.totalRevenue ? Number(stats.totalRevenue) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── KPI row 1 ── */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <StatCard icon="👥" label="Tổng người dùng"  value={stats?.totalUsers ?? 0}    to="/admin/users"    />
        <StatCard icon="🚌" label="Tổng chuyến đi"   value={stats?.totalTrips ?? 0}    to="/admin/trips"    />
        <StatCard icon="🎫" label="Tổng đặt vé"      value={stats?.totalBookings ?? 0} to="/admin/bookings" />
        <StatCard icon="💰" label="Doanh thu"         value={fmtVND(revenue)}           color="rgba(255,215,0,0.25)" />
      </div>

      {/* ── KPI row 2 ── */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <StatCard icon="📅" label="Đặt vé hôm nay"     value={stats?.todayBookings  ?? 0} sub="so với hôm qua" />
        <StatCard icon="🗺️" label="Tuyến đang hoạt động" value={stats?.activeRoutes  ?? 0} to="/admin/routes" />
        <StatCard icon="⭐" label="Đánh giá"            value={stats?.totalReviews   ?? 0} to="/admin/reviews" />
        <StatCard icon="💸" label="Hoàn tiền chờ duyệt" value={stats?.pendingRefunds ?? 0} color="rgba(244,67,54,0.2)" to="/admin/refunds" />
      </div>

      {/* ── 2-column row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Recent bookings */}
        <SectionCard
          title="🎫 Đặt vé gần đây"
          action={<Link to="/admin/bookings" style={{ color: '#FF6B9D', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>Xem tất cả →</Link>}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={th}>Mã vé</th>
                <th style={th}>Khách hàng</th>
                <th style={th}>Giá</th>
                <th style={th}>Trạng thái</th>
              </tr></thead>
              <tbody>
                {bookings.length === 0
                  ? <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#7B5FA0' }}>Chưa có đặt vé</td></tr>
                  : bookings.map(b => (
                    <tr key={b.bookingId}>
                      <td style={td({ color: '#FF6B9D', fontWeight: 700, fontFamily: 'monospace' })}>{b.bookingCode}</td>
                      <td style={td({ color: 'white' })}>{b.user?.fullName || '-'}</td>
                      <td style={td({ color: '#FFD700', fontWeight: 700 })}>{fmtVND(b.totalPrice)}</td>
                      <td style={td()}><BookingBadge status={b.bookingStatus} /></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Upcoming trips */}
        <SectionCard
          title="🚌 Chuyến đi sắp tới"
          action={<Link to="/admin/trips" style={{ color: '#FF6B9D', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>Xem tất cả →</Link>}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={th}>Tuyến</th>
                <th style={th}>Giờ đi</th>
                <th style={th}>Ghế trống</th>
                <th style={th}>Trạng thái</th>
              </tr></thead>
              <tbody>
                {trips.length === 0
                  ? <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#7B5FA0' }}>Không có chuyến</td></tr>
                  : trips.map(t => (
                    <tr key={t.tripId}>
                      <td style={td({ color: 'white', fontWeight: 600 })}>
                        {t.route ? `${t.route.departureCity} → ${t.route.destinationCity}` : '-'}
                      </td>
                      <td style={td({ color: '#B0A0CC', fontSize: '0.78rem' })}>{fmtDT(t.departureTime)}</td>
                      <td style={td({ textAlign: 'center', color: t.availableSeats > 5 ? '#4CAF50' : '#FF9800', fontWeight: 700 })}>{t.availableSeats ?? '-'}</td>
                      <td style={td()}><TripBadge status={t.status} /></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* ── Quick actions ── */}
      <div style={{ background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 16, padding: '1.25rem 1.5rem' }}>
        <div style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>⚡ Thao tác nhanh</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { icon: '➕', label: 'Thêm chuyến đi', to: '/admin/trips', color: '#FF6B9D' },
            { icon: '👥', label: 'Quản lý users', to: '/admin/users', color: '#7B2FBE' },
            { icon: '💸', label: 'Duyệt hoàn tiền', to: '/admin/refunds', color: '#F44336' },
            { icon: '📋', label: 'Xem đặt vé', to: '/admin/bookings', color: '#2196F3' },
            { icon: '🗺️', label: 'Tuyến đường', to: '/admin/routes', color: '#4CAF50' },
          ].map(a => (
            <Link key={a.to} to={a.to} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: `${a.color}18`,
              border: `1px solid ${a.color}44`,
              color: a.color,
              padding: '0.5rem 1.1rem',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = `${a.color}30`}
              onMouseLeave={e => e.currentTarget.style.background = `${a.color}18`}
            >
              {a.icon} {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Refresh footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={load} style={{ background: 'transparent', border: '1px solid rgba(255,107,157,0.3)', color: '#FF6B9D', padding: '0.35rem 1rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'inherit' }}>
          🔄 Làm mới
        </button>
      </div>
    </div>
  )
}
