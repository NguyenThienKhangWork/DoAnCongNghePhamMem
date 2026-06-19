import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = []
  const start = Math.max(0, page - 2)
  const end   = Math.min(totalPages - 1, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  const btn = (active, disabled) => ({
    padding: '0.35rem 0.8rem', borderRadius: 8, fontWeight: 600, fontSize: '0.82rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: active ? 'none' : '1px solid rgba(255,107,157,0.3)',
    background: active ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'transparent',
    color: disabled ? '#555' : (active ? 'white' : '#B0A0CC'),
  })
  return (
    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', padding: '1rem 0' }}>
      <button onClick={() => onChange(page - 1)} disabled={page === 0} style={btn(false, page === 0)}>← Trước</button>
      {start > 0 && <span style={{ color: '#7B5FA0' }}>...</span>}
      {pages.map(p => <button key={p} onClick={() => onChange(p)} style={btn(p === page, false)}>{p + 1}</button>)}
      {end < totalPages - 1 && <span style={{ color: '#7B5FA0' }}>...</span>}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1} style={btn(false, page >= totalPages - 1)}>Tiếp →</button>
    </div>
  )
}

function Stars({ rating }) {
  return (
    <span style={{ color: '#FFD700', fontSize: '0.9rem' }}>
      {'⭐'.repeat(rating || 0)}{'☆'.repeat(5 - (rating || 0))}
    </span>
  )
}

export default function AdminReviews() {
  const [reviews, setReviews]     = useState([])
  const [page, setPage]           = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotal] = useState(0)
  const [loading, setLoading]     = useState(false)

  const fetch = (p = 0) => {
    setLoading(true)
    adminService.getReviews(p, 10)
      .then(res => {
        setReviews(res.data?.content || [])
        setTotalPages(res.data?.totalPages || 0)
        setTotal(res.data?.totalElements || 0)
        setPage(p)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch(0) }, [])

  const thStyle = { padding: '0.85rem 1rem', textAlign: 'left', color: '#FF6B9D', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }
  const tdStyle = { padding: '0.75rem 1rem', fontSize: '0.83rem', color: '#ccc' }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '-'

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { icon: '⭐', label: 'Tổng đánh giá', value: totalElements },
          { icon: '📊', label: 'Điểm TB trang hiện tại', value: avgRating + ' / 5' },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 200px', background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 12, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
            <div>
              <div style={{ color: '#B0A0CC', fontSize: '0.75rem', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, background: 'linear-gradient(135deg,#FF6B9D,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#B0A0CC' }}>⏳ Đang tải...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,107,157,0.08)' }}>
                  {['ID', 'Khách hàng', 'Tuyến đường', 'Sao', 'Nhận xét', 'Ngày'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#7B5FA0' }}>Chưa có đánh giá</td></tr>
                ) : reviews.map((r, i) => (
                  <tr key={r.reviewId} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ ...tdStyle, color: '#FF6B9D', fontWeight: 700 }}>#{r.reviewId}</td>
                    <td style={{ ...tdStyle, color: 'white', fontWeight: 600 }}>{r.user?.fullName || '-'}</td>
                    <td style={tdStyle}>
                      {r.trip?.route ? `${r.trip.route.departureCity} → ${r.trip.route.destinationCity}` : '-'}
                    </td>
                    <td style={tdStyle}><Stars rating={r.rating} /></td>
                    <td style={{ ...tdStyle, maxWidth: 300 }}>
                      <span style={{ fontStyle: 'italic', color: '#B0A0CC', fontSize: '0.82rem' }}>
                        {r.comment ? `"${r.comment}"` : '-'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '-'}
                    </td>
                  </tr>
                ))}
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
