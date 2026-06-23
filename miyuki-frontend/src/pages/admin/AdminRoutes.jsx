import { useEffect, useState } from 'react'
import { tripService } from '../../services/api'
import { th, td, TableCard, LoadingRow, EmptyRow } from '../../components/admin/AdminTable'

function StatusBadge({ status }) {
  const map = {
    ACTIVE:   { bg: 'rgba(76,175,80,0.15)',   color: '#4CAF50', label: 'Hoạt động' },
    INACTIVE: { bg: 'rgba(158,158,158,0.15)', color: '#9E9E9E', label: 'Không hoạt động' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status }
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{s.label}</span>
}

const fmtVND = v => v ? Number(v).toLocaleString('vi-VN') + ' ₫' : '-'

export default function AdminRoutes() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tripService.getAllRoutes()
      .then(res => setRoutes(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#B0A0CC', fontSize: '0.9rem' }}>
          Tổng cộng <strong style={{ color: '#FF6B9D' }}>{!loading ? routes.length : '...'}</strong> tuyến đường
        </span>
      </div>

      <TableCard>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['ID', 'Điểm đi', 'Điểm đến', 'Khoảng cách', 'Thời gian', 'Giá cơ bản', 'Trạng thái'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow colSpan={7} /> : routes.length === 0 ? <EmptyRow colSpan={7} message="Chưa có tuyến đường nào" /> : routes.map((r, i) => (
              <tr key={r.routeId} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ ...td(), color: '#FF6B9D', fontWeight: 700 }}>#{r.routeId}</td>
                <td style={{ ...td(), color: 'white', fontWeight: 600 }}>{r.departureCity}</td>
                <td style={{ ...td(), color: 'white', fontWeight: 600 }}>{r.destinationCity}</td>
                <td style={td()}>{r.distanceKm ? `${r.distanceKm} km` : '-'}</td>
                <td style={td()}>{r.estimatedHours ? `${r.estimatedHours} giờ` : '-'}</td>
                <td style={{ ...td(), color: '#FFD700', fontWeight: 700 }}>{fmtVND(r.basePrice)}</td>
                <td style={td()}><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  )
}
