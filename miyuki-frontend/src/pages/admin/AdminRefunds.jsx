import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { th, td, TableCard, LoadingRow, EmptyRow, Pagination } from '../../components/admin/AdminTable'

const STATUS_MAP = {
  PENDING:   { label: 'Chờ duyệt',  color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  APPROVED:  { label: 'Đã duyệt',   color: '#2196F3', bg: 'rgba(33,150,243,0.12)' },
  COMPLETED: { label: 'Hoàn thành', color: '#4CAF50', bg: 'rgba(76,175,80,0.12)' },
  REJECTED:  { label: 'Từ chối',    color: '#F44336', bg: 'rgba(244,67,54,0.12)' },
}

function StatsCard({ icon, label, value }) {
  return (
    <div style={{ flex: '1 1 180px', background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 12, padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <div>
        <div style={{ color: '#B0A0CC', fontSize: '0.72rem', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, background: 'linear-gradient(135deg,#FF6B9D,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
      </div>
    </div>
  )
}

export default function AdminRefunds() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(null)

  const fetch = (p = 0) => {
    setLoading(true)
    adminService.getRefunds(p, 10)
      .then(res => { setItems(res.data?.content || []); setPages(res.data?.totalPages || 0); setTotal(res.data?.totalElements || 0); setPage(p) })
      .catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetch(0) }, [])

  const handleStatus = (id, status) => {
    setUpdating(id)
    adminService.updateRefundStatus(id, status)
      .then(() => fetch(page))
      .catch(err => alert(err.response?.data?.message || 'Lỗi cập nhật'))
      .finally(() => setUpdating(null))
  }

  const totalAmt = items.reduce((s, r) => s + Number(r.refundAmount || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <StatsCard icon="💸" label="Tổng yêu cầu" value={total} />
        <StatsCard icon="⏳" label="Chờ duyệt" value={items.filter(r => r.refundStatus === 'PENDING').length} />
        <StatsCard icon="💰" label="Tổng tiền hoàn (trang này)" value={totalAmt.toLocaleString('vi-VN') + 'đ'} />
      </div>

      <TableCard>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['ID', 'Mã vé', 'Khách hàng', 'Số tiền hoàn', 'Lý do', 'Trạng thái', 'Hành động'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow colSpan={7} /> : items.length === 0 ? <EmptyRow colSpan={7} message="Chưa có yêu cầu hoàn tiền" icon="💸" /> : items.map((r, i) => {
              const st = STATUS_MAP[r.refundStatus] || STATUS_MAP.PENDING
              return (
                <tr key={r.refundId} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <td style={{ ...td(), color: '#FF6B9D', fontWeight: 700 }}>#{r.refundId}</td>
                  <td style={{ ...td(), color: 'white', fontFamily: 'monospace' }}>{r.booking?.bookingCode || '-'}</td>
                  <td style={{ ...td(), color: 'white' }}>{r.booking?.user?.fullName || '-'}</td>
                  <td style={{ ...td(), color: '#FFD700', fontWeight: 700 }}>{Number(r.refundAmount || 0).toLocaleString('vi-VN')}đ</td>
                  <td style={{ ...td(), maxWidth: 220, color: '#B0A0CC', fontSize: '0.78rem' }}>{r.refundReason || '-'}</td>
                  <td style={td()}>
                    <span style={{ background: st.bg, color: st.color, padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{st.label}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {r.refundStatus === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => handleStatus(r.refundId, 'APPROVED')} disabled={updating === r.refundId}
                          style={{ background: 'rgba(33,150,243,0.15)', color: '#2196F3', border: '1px solid rgba(33,150,243,0.4)', padding: '0.25rem 0.7rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                          ✓ Duyệt
                        </button>
                        <button onClick={() => handleStatus(r.refundId, 'REJECTED')} disabled={updating === r.refundId}
                          style={{ background: 'rgba(244,67,54,0.15)', color: '#F44336', border: '1px solid rgba(244,67,54,0.4)', padding: '0.25rem 0.7rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                          ✕ Từ chối
                        </button>
                      </div>
                    )}
                    {r.refundStatus === 'APPROVED' && (
                      <button onClick={() => handleStatus(r.refundId, 'COMPLETED')} disabled={updating === r.refundId}
                        style={{ background: 'rgba(76,175,80,0.15)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.4)', padding: '0.25rem 0.7rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                        💰 Hoàn tiền
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div style={{ borderTop: '1px solid rgba(255,107,157,0.1)', padding: '0 1rem' }}>
          <Pagination page={page} totalPages={totalPages} onChange={fetch} />
        </div>
      </TableCard>
    </div>
  )
}
