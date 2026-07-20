import { useEffect, useState } from 'react'
import { Star, BarChart3 } from 'lucide-react'
import { adminService } from '../../services/api'
import { th, td, TableCard, LoadingRow, EmptyRow, Pagination } from '../../components/admin/AdminTable'

function Stars({ rating }) {
  return <span style={{ color: '#FFD700', display: 'inline-flex', gap: '1px', verticalAlign: 'middle' }}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={14} fill={i <= (rating || 0) ? '#FFD700' : 'none'} stroke={i <= (rating || 0) ? '#FFD700' : '#555'} />
    ))}
  </span>
}

function StatsCard({ icon: Icon, label, value }) {
  return (
    <div style={{ flex: '1 1 200px', background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 12, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
      <Icon size={24} />
      <div>
        <div style={{ color: '#B0A0CC', fontSize: '0.75rem', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 900, background: 'linear-gradient(135deg,#FF6B9D,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
      </div>
    </div>
  )
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetch = (p = 0) => {
    setLoading(true)
    adminService.getReviews(p, 10)
      .then(res => { setReviews(res.data?.content || []); setTotalPages(res.data?.totalPages || 0); setTotal(res.data?.totalElements || 0); setPage(p) })
      .catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetch(0) }, [])

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : '-'

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <StatsCard icon={Star} label="Tổng đánh giá" value={totalElements} />
        <StatsCard icon={BarChart3} label="Điểm TB trang hiện tại" value={avgRating + ' / 5'} />
      </div>

      <TableCard>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['ID', 'Khách hàng', 'Tuyến đường', 'Sao', 'Nhận xét', 'Ngày'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow colSpan={6} /> : reviews.length === 0 ? <EmptyRow colSpan={6} message="Chưa có đánh giá" icon={<Star size={32} />} /> : reviews.map((r, i) => (
              <tr key={r.reviewId} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ ...td(), color: '#FF6B9D', fontWeight: 700 }}>#{r.reviewId}</td>
                <td style={{ ...td(), color: 'white', fontWeight: 600 }}>{r.user?.fullName || '-'}</td>
                <td style={td()}>{r.trip?.route ? `${r.trip.route.departureCity} → ${r.trip.route.destinationCity}` : '-'}</td>
                <td style={td()}><Stars rating={r.rating} /></td>
                <td style={{ ...td(), maxWidth: 300 }}>
                  <span style={{ fontStyle: 'italic', color: '#B0A0CC', fontSize: '0.82rem' }}>{r.comment ? `"${r.comment}"` : '-'}</span>
                </td>
                <td style={td()}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: '1px solid rgba(255,107,157,0.1)', padding: '0 1rem' }}>
          <Pagination page={page} totalPages={totalPages} onChange={fetch} />
        </div>
      </TableCard>
    </div>
  )
}
