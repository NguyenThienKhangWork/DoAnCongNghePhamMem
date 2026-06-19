import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = []; const s = Math.max(0, page-2); const e = Math.min(totalPages-1, page+2)
  for (let i=s; i<=e; i++) pages.push(i)
  const btn = (active, disabled) => ({ padding:'0.35rem 0.8rem', borderRadius:8, fontWeight:600, fontSize:'0.82rem', cursor: disabled?'not-allowed':'pointer', border: active?'none':'1px solid rgba(255,107,157,0.3)', background: active?'linear-gradient(135deg,#FF6B9D,#7B2FBE)':'transparent', color: disabled?'#555':(active?'white':'#B0A0CC') })
  return (
    <div style={{ display:'flex', gap:'0.4rem', justifyContent:'center', padding:'1rem 0' }}>
      <button onClick={() => onChange(page-1)} disabled={page===0} style={btn(false,page===0)}>← Trước</button>
      {pages.map(p => <button key={p} onClick={() => onChange(p)} style={btn(p===page,false)}>{p+1}</button>)}
      <button onClick={() => onChange(page+1)} disabled={page>=totalPages-1} style={btn(false,page>=totalPages-1)}>Tiếp →</button>
    </div>
  )
}

const STATUS_MAP = {
  PENDING:  { label:'Chờ duyệt',  color:'#FFD700', bg:'rgba(255,215,0,0.12)' },
  APPROVED: { label:'Đã duyệt',   color:'#2196F3', bg:'rgba(33,150,243,0.12)' },
  COMPLETED:{ label:'Hoàn thành', color:'#4CAF50', bg:'rgba(76,175,80,0.12)' },
  REJECTED: { label:'Từ chối',    color:'#F44336', bg:'rgba(244,67,54,0.12)' },
}

export default function AdminRefunds() {
  const [items, setItems]       = useState([])
  const [page, setPage]         = useState(0)
  const [totalPages, setPages]  = useState(0)
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(false)
  const [updating, setUpdating] = useState(null)

  const fetch = (p=0) => {
    setLoading(true)
    adminService.getRefunds(p, 10)
      .then(res => { setItems(res.data?.content||[]); setPages(res.data?.totalPages||0); setTotal(res.data?.totalElements||0); setPage(p) })
      .catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetch(0) }, [])

  const handleStatus = (id, status) => {
    setUpdating(id)
    adminService.updateRefundStatus(id, status)
      .then(() => fetch(page))
      .catch(err => alert(err.response?.data?.message || 'Lỗi cập nhật'))
      .finally(() => setUpdating(null))
  }

  const thStyle = { padding:'0.85rem 1rem', textAlign:'left', color:'#FF6B9D', fontSize:'0.8rem', fontWeight:700, whiteSpace:'nowrap' }
  const tdStyle = { padding:'0.75rem 1rem', fontSize:'0.83rem', color:'#ccc' }

  const totalAmt = items.reduce((s,r) => s + Number(r.refundAmount||0), 0)

  return (
    <div>
      {/* Stats */}
      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {[
          { icon:'💸', label:'Tổng yêu cầu', value: total },
          { icon:'⏳', label:'Chờ duyệt', value: items.filter(r=>r.refundStatus==='PENDING').length },
          { icon:'💰', label:'Tổng tiền hoàn (trang này)', value: totalAmt.toLocaleString('vi-VN')+'đ' },
        ].map(s => (
          <div key={s.label} style={{ flex:'1 1 180px', background:'rgba(13,27,42,0.95)', border:'1px solid rgba(255,107,157,0.2)', borderRadius:12, padding:'0.9rem 1.2rem', display:'flex', alignItems:'center', gap:'0.6rem' }}>
            <span style={{ fontSize:'1.5rem' }}>{s.icon}</span>
            <div>
              <div style={{ color:'#B0A0CC', fontSize:'0.72rem', fontWeight:600 }}>{s.label}</div>
              <div style={{ fontSize:'1.1rem', fontWeight:900, background:'linear-gradient(135deg,#FF6B9D,#FFD700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:'rgba(13,27,42,0.95)', border:'1px solid rgba(255,107,157,0.2)', borderRadius:16, overflow:'hidden' }}>
        {loading ? <div style={{ padding:'3rem', textAlign:'center', color:'#B0A0CC' }}>⏳ Đang tải...</div> : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(255,107,157,0.08)' }}>
                  {['ID','Mã vé','Khách hàng','Số tiền hoàn','Lý do','Trạng thái','Hành động'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {items.length === 0
                  ? <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:'#7B5FA0' }}>Chưa có yêu cầu hoàn tiền</td></tr>
                  : items.map((r, i) => {
                    const st = STATUS_MAP[r.refundStatus] || STATUS_MAP.PENDING
                    return (
                      <tr key={r.refundId} style={{ borderTop:'1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.015)' }}>
                        <td style={{ ...tdStyle, color:'#FF6B9D', fontWeight:700 }}>#{r.refundId}</td>
                        <td style={{ ...tdStyle, color:'white', fontFamily:'monospace' }}>{r.booking?.bookingCode||'-'}</td>
                        <td style={{ ...tdStyle, color:'white' }}>{r.booking?.user?.fullName||'-'}</td>
                        <td style={{ ...tdStyle, color:'#FFD700', fontWeight:700 }}>
                          {Number(r.refundAmount||0).toLocaleString('vi-VN')}đ
                        </td>
                        <td style={{ ...tdStyle, maxWidth:220, color:'#B0A0CC', fontSize:'0.78rem' }}>
                          {r.refundReason||'-'}
                        </td>
                        <td style={tdStyle}>
                          <span style={{ background:st.bg, color:st.color, padding:'0.2rem 0.7rem', borderRadius:20, fontSize:'0.75rem', fontWeight:700 }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding:'0.75rem 1rem' }}>
                          {r.refundStatus === 'PENDING' && (
                            <div style={{ display:'flex', gap:'0.4rem' }}>
                              <button
                                onClick={() => handleStatus(r.refundId, 'APPROVED')}
                                disabled={updating === r.refundId}
                                style={{ background:'rgba(33,150,243,0.15)', color:'#2196F3', border:'1px solid rgba(33,150,243,0.4)', padding:'0.25rem 0.7rem', borderRadius:8, cursor:'pointer', fontSize:'0.75rem', fontWeight:700 }}>
                                ✓ Duyệt
                              </button>
                              <button
                                onClick={() => handleStatus(r.refundId, 'REJECTED')}
                                disabled={updating === r.refundId}
                                style={{ background:'rgba(244,67,54,0.15)', color:'#F44336', border:'1px solid rgba(244,67,54,0.4)', padding:'0.25rem 0.7rem', borderRadius:8, cursor:'pointer', fontSize:'0.75rem', fontWeight:700 }}>
                                ✕ Từ chối
                              </button>
                            </div>
                          )}
                          {r.refundStatus === 'APPROVED' && (
                            <button
                              onClick={() => handleStatus(r.refundId, 'COMPLETED')}
                              disabled={updating === r.refundId}
                              style={{ background:'rgba(76,175,80,0.15)', color:'#4CAF50', border:'1px solid rgba(76,175,80,0.4)', padding:'0.25rem 0.7rem', borderRadius:8, cursor:'pointer', fontSize:'0.75rem', fontWeight:700 }}>
                              💰 Hoàn tiền
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ borderTop:'1px solid rgba(255,107,157,0.1)', padding:'0 1rem' }}>
          <Pagination page={page} totalPages={totalPages} onChange={fetch} />
        </div>
      </div>
    </div>
  )
}
