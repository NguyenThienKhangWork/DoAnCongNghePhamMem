import { useEffect, useState } from 'react'
import { tripService } from '../../services/api'

function StatusBadge({ status }) {
  const map = {
    ACTIVE: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50', label: 'Hoạt động' },
    INACTIVE: { bg: 'rgba(158,158,158,0.15)', color: '#9E9E9E', label: 'Không hoạt động' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status }
  return (
    <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
      {s.label}
    </span>
  )
}

function formatVND(v) { return v ? Number(v).toLocaleString('vi-VN') + ' ₫' : '-' }

export default function AdminRoutes() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tripService.getAllRoutes()
      .then(res => setRoutes(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const thStyle = {
    padding: '0.85rem 1rem', textAlign: 'left',
    color: '#FF6B9D', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap',
  }
  const tdStyle = { padding: '0.8rem 1rem', fontSize: '0.85rem', color: '#ccc' }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#B0A0CC', fontSize: '0.9rem' }}>
          Tổng cộng <strong style={{ color: '#FF6B9D' }}>{routes.length}</strong> tuyến đường
        </span>
      </div>

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
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Điểm đi</th>
                  <th style={thStyle}>Điểm đến</th>
                  <th style={thStyle}>Khoảng cách</th>
                  <th style={thStyle}>Thời gian</th>
                  <th style={thStyle}>Giá cơ bản</th>
                  <th style={thStyle}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {routes.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#7B5FA0' }}>Chưa có tuyến đường nào</td>
                  </tr>
                ) : routes.map((r, i) => (
                  <tr key={r.routeId} style={{
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  }}>
                    <td style={{ ...tdStyle, color: '#FF6B9D', fontWeight: 700 }}>#{r.routeId}</td>
                    <td style={{ ...tdStyle, color: 'white', fontWeight: 600 }}>{r.departureCity}</td>
                    <td style={{ ...tdStyle, color: 'white', fontWeight: 600 }}>{r.destinationCity}</td>
                    <td style={tdStyle}>{r.distanceKm ? `${r.distanceKm} km` : '-'}</td>
                    <td style={tdStyle}>{r.estimatedHours ? `${r.estimatedHours} giờ` : '-'}</td>
                    <td style={{ ...tdStyle, color: '#FFD700', fontWeight: 700 }}>{formatVND(r.basePrice)}</td>
                    <td style={tdStyle}><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
