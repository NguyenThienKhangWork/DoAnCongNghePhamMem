import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = []; const start = Math.max(0, page - 2); const end = Math.min(totalPages - 1, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  const btn = (active, disabled) => ({ padding: '0.35rem 0.8rem', borderRadius: 8, fontWeight: 600, fontSize: '0.82rem', cursor: disabled ? 'not-allowed' : 'pointer', border: active ? 'none' : '1px solid rgba(255,107,157,0.3)', background: active ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'transparent', color: disabled ? '#555' : (active ? 'white' : '#B0A0CC') })
  return (
    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', padding: '1rem 0' }}>
      <button onClick={() => onChange(page - 1)} disabled={page === 0} style={btn(false, page === 0)}>← Trước</button>
      {pages.map(p => <button key={p} onClick={() => onChange(p)} style={btn(p === page, false)}>{p + 1}</button>)}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1} style={btn(false, page >= totalPages - 1)}>Tiếp →</button>
    </div>
  )
}

const TYPE_MAP = {
  BOOKING_CONFIRMED: { label: 'Xác nhận vé',   color: '#4CAF50', bg: 'rgba(76,175,80,0.12)' },
  TRIP_REMINDER:     { label: 'Nhắc chuyến đi', color: '#2196F3', bg: 'rgba(33,150,243,0.12)' },
  PROMOTION:         { label: 'Khuyến mãi',     color: '#FF6B9D', bg: 'rgba(255,107,157,0.12)' },
  REFUND_PROCESSED:  { label: 'Hoàn tiền',      color: '#9C27B0', bg: 'rgba(156,39,176,0.12)' },
  SYSTEM:            { label: 'Hệ thống',       color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
}

export default function AdminNotifications() {
  const [items, setItems]         = useState([])
  const [page, setPage]           = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotal] = useState(0)
  const [loading, setLoading]     = useState(false)
  const [filterRead, setFilterRead] = useState('ALL')

  const fetch = (p = 0) => {
    setLoading(true)
    adminService.getNotifications(p, 10)
      .then(res => { setItems(res.data?.content || []); setTotalPages(res.data?.totalPages || 0); setTotal(res.data?.totalElements || 0); setPage(p) })
      .catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetch(0) }, [])

  const filtered = filterRead === 'ALL' ? items
    : filterRead === 'READ'   ? items.filter(n => n.isRead)
    : items.filter(n => !n.isRead)

  const thStyle = { padding: '0.85rem 1rem', textAlign: 'left', color: '#FF6B9D', fontSize: '0.8rem', fontWeight: 700 }
  const tdStyle = { padding: '0.75rem 1rem', fontSize: '0.83rem', color: '#ccc' }

  return (
    <div>
      {/* Stats + filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 12, padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🔔</span>
            <div>
              <div style={{ color: '#B0A0CC', fontSize: '0.72rem' }}>Tổng thông báo</div>
              <div style={{ color: '#FF6B9D', fontWeight: 900, fontSize: '1.1rem' }}>{totalElements}</div>
            </div>
          </div>
          <div style={{ background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 12, padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📬</span>
            <div>
              <div style={{ color: '#B0A0CC', fontSize: '0.72rem' }}>Chưa đọc (trang này)</div>
              <div style={{ color: '#FFD700', fontWeight: 900, fontSize: '1.1rem' }}>{items.filter(n => !n.isRead).length}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['ALL', 'UNREAD', 'READ'].map(f => (
            <button key={f} onClick={() => setFilterRead(f)} style={{ padding: '0.4rem 1rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: filterRead === f ? 'none' : '1px solid rgba(255,107,157,0.3)', background: filterRead === f ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'transparent', color: filterRead === f ? 'white' : '#B0A0CC' }}>
              {f === 'ALL' ? 'Tất cả' : f === 'UNREAD' ? 'Chưa đọc' : 'Đã đọc'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ padding: '3rem', textAlign: 'center', color: '#B0A0CC' }}>⏳ Đang tải...</div> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,107,157,0.08)' }}>
                  {['ID', 'Người nhận', 'Loại', 'Tiêu đề', 'Nội dung', 'Trạng thái', 'Ngày'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#7B5FA0' }}>Không có thông báo</td></tr>
                  : filtered.map((n, i) => {
                    const t = TYPE_MAP[n.notificationType] || { label: n.notificationType, color: '#fff', bg: 'rgba(255,255,255,0.08)' }
                    return (
                      <tr key={n.notificationId} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                        <td style={{ ...tdStyle, color: '#FF6B9D', fontWeight: 700 }}>#{n.notificationId}</td>
                        <td style={{ ...tdStyle, color: 'white' }}>{n.user?.fullName || '-'}</td>
                        <td style={tdStyle}><span style={{ background: t.bg, color: t.color, padding: '0.2rem 0.6rem', borderRadius: 10, fontSize: '0.72rem', fontWeight: 700 }}>{t.label}</span></td>
                        <td style={{ ...tdStyle, color: 'white', maxWidth: 180 }}>{n.title || '-'}</td>
                        <td style={{ ...tdStyle, maxWidth: 260, color: '#B0A0CC', fontSize: '0.78rem' }}>{n.message ? n.message.substring(0, 80) + (n.message.length > 80 ? '...' : '') : '-'}</td>
                        <td style={tdStyle}>
                          <span style={{ background: n.isRead ? 'rgba(76,175,80,0.12)' : 'rgba(255,152,0,0.12)', color: n.isRead ? '#4CAF50' : '#FF9800', padding: '0.2rem 0.6rem', borderRadius: 10, fontSize: '0.72rem', fontWeight: 700 }}>
                            {n.isRead ? '✓ Đã đọc' : '● Chưa đọc'}
                          </span>
                        </td>
                        <td style={tdStyle}>{n.createdAt ? new Date(n.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ borderTop: '1px solid rgba(255,107,157,0.1)', padding: '0 1rem' }}>
          <Pagination page={page} totalPages={totalPages} onChange={fetch} />
        </div>
      </div>
    </div>
  )
}
