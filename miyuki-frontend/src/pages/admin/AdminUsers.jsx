import { useEffect, useState, useCallback } from 'react'
import { adminService } from '../../services/api'

/* ── helpers ─────────────────────────────────────── */
const fmtDate = dt => dt ? new Date(dt).toLocaleDateString('vi-VN') : '-'

function btnPage(active, disabled) {
  return {
    padding: '0.35rem 0.75rem', borderRadius: 8, fontWeight: 600, fontSize: '0.8rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: active ? 'none' : '1px solid rgba(255,107,157,0.3)',
    background: active ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'transparent',
    color: disabled ? '#444' : active ? 'white' : '#B0A0CC',
    fontFamily: 'inherit',
  }
}

/* ── sub-components ──────────────────────────────── */
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const start = Math.max(0, page - 2)
  const end   = Math.min(totalPages - 1, page + 2)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  return (
    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'center', padding: '0.9rem 0' }}>
      <button onClick={() => onChange(page - 1)} disabled={page === 0} style={btnPage(false, page === 0)}>← Trước</button>
      {start > 0 && <span style={{ color: '#555' }}>…</span>}
      {pages.map(p => <button key={p} onClick={() => onChange(p)} style={btnPage(p === page, false)}>{p + 1}</button>)}
      {end < totalPages - 1 && <span style={{ color: '#555' }}>…</span>}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1} style={btnPage(false, page >= totalPages - 1)}>Tiếp →</button>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    ACTIVE:   { bg: 'rgba(76,175,80,0.15)',   color: '#4CAF50', label: 'Hoạt động' },
    BLOCKED:  { bg: 'rgba(244,67,54,0.15)',   color: '#F44336', label: 'Bị khoá' },
    INACTIVE: { bg: 'rgba(158,158,158,0.15)', color: '#9E9E9E', label: 'Không hoạt động' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.08)', color: '#ccc', label: status }
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.73rem', fontWeight: 700 }}>{s.label}</span>
}

function RoleBadge({ name }) {
  const colors = { ADMIN: '#FF6B9D', CUSTOMER: '#7B2FBE', DRIVER: '#2196F3', COMPANY_ADMIN: '#FF9800' }
  return (
    <span style={{
      background: `${colors[name] || '#555'}22`,
      color: colors[name] || '#ccc',
      border: `1px solid ${colors[name] || '#555'}55`,
      padding: '0.15rem 0.5rem', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, marginRight: 3,
    }}>{name}</span>
  )
}

/* ── Modal xem chi tiết ───────────────────────────── */
function UserDetailModal({ user, onClose }) {
  if (!user) return null
  const row = (label, value) => (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 0' }}>
      <span style={{ color: '#7B5FA0', fontSize: '0.82rem', width: 140, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'white', fontSize: '0.85rem' }}>{value || '-'}</span>
    </div>
  )
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}>
      <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,107,157,0.3)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 480 }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'white', fontWeight: 900 }}>
              {user.fullName?.[0] || '?'}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>{user.fullName}</div>
              <div style={{ color: '#7B5FA0', fontSize: '0.78rem' }}>#{user.userId}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ccc', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
        {row('Email', user.email)}
        {row('Số điện thoại', user.phone)}
        {row('Địa chỉ', user.address)}
        {row('CCCD/CMND', user.identificationNumber)}
        {row('Ngày tạo', fmtDate(user.createdAt))}
        {row('Trạng thái', <StatusBadge status={user.status} />)}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 0' }}>
          <span style={{ color: '#7B5FA0', fontSize: '0.82rem', width: 140, flexShrink: 0 }}>Vai trò</span>
          <span>{(user.roles || []).map(r => <RoleBadge key={r.roleId} name={r.roleName} />)}</span>
        </div>
      </div>
    </div>
  )
}

const thS = { padding: '0.8rem 1rem', textAlign: 'left', color: '#FF6B9D', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(255,107,157,0.06)', whiteSpace: 'nowrap' }
const tdS = { padding: '0.7rem 1rem', fontSize: '0.84rem', color: '#ccc', borderTop: '1px solid rgba(255,255,255,0.04)' }

/* ── main ──────────────────────────────────────────── */
export default function AdminUsers() {
  const [users,       setUsers]       = useState([])
  const [page,        setPage]        = useState(0)
  const [totalPages,  setTotalPages]  = useState(0)
  const [totalEls,    setTotalEls]    = useState(0)
  const [search,      setSearch]      = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [detail,      setDetail]      = useState(null)   // modal
  const [toggling,    setToggling]    = useState(null)   // userId being toggled

  const fetchUsers = useCallback((p = 0) => {
    setLoading(true); setError('')
    adminService.getUsers(p, 10)
      .then(res => {
        setUsers(res.data?.content || [])
        setTotalPages(res.data?.totalPages || 0)
        setTotalEls(res.data?.totalElements || 0)
        setPage(p)
      })
      .catch(err => setError(err.response?.data?.message || 'Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchUsers(0) }, [fetchUsers])

  const handleToggle = (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
    const label = newStatus === 'BLOCKED' ? 'khoá' : 'mở khoá'
    if (!window.confirm(`${label.charAt(0).toUpperCase() + label.slice(1)} tài khoản "${user.fullName}"?`)) return
    setToggling(user.userId)
    adminService.updateUserStatus(user.userId, newStatus)
      .then(() => fetchUsers(page))
      .catch(err => alert('Lỗi: ' + (err.response?.data?.message || err.message)))
      .finally(() => setToggling(null))
  }

  // client-side filter
  const filtered = users.filter(u => {
    const matchSearch = !search.trim() ||
      (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').includes(search)
    const matchStatus = filterStatus === 'ALL' || u.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <>
      <UserDetailModal user={detail} onClose={() => setDetail(null)} />

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {/* search */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#7B5FA0', pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="Tìm tên, email, SĐT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.3)', borderRadius: 10, padding: '0.6rem 1rem 0.6rem 2.5rem', color: 'white', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        {/* status filter */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['ALL', 'ACTIVE', 'BLOCKED', 'INACTIVE'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: '0.4rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
              border: filterStatus === s ? 'none' : '1px solid rgba(255,107,157,0.3)',
              background: filterStatus === s ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'transparent',
              color: filterStatus === s ? 'white' : '#B0A0CC', fontFamily: 'inherit',
            }}>
              {{ ALL: 'Tất cả', ACTIVE: 'Hoạt động', BLOCKED: 'Bị khoá', INACTIVE: 'Không HĐ' }[s]}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', color: '#7B5FA0', fontSize: '0.82rem' }}>
          {filtered.length}/{totalEls} người dùng
        </div>

        <button onClick={() => fetchUsers(page)} style={{ background: 'transparent', border: '1px solid rgba(255,107,157,0.3)', color: '#FF6B9D', padding: '0.4rem 0.9rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'inherit' }}>
          🔄 Làm mới
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 10, padding: '0.75rem 1rem', color: '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Table ── */}
      <div style={{ background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#B0A0CC' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>Đang tải...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr>
                  <th style={thS}>ID</th>
                  <th style={thS}>Người dùng</th>
                  <th style={thS}>Email</th>
                  <th style={thS}>SĐT</th>
                  <th style={thS}>Vai trò</th>
                  <th style={thS}>Trạng thái</th>
                  <th style={thS}>Ngày tạo</th>
                  <th style={{ ...thS, textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#7B5FA0' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😶</div>
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : filtered.map((u, i) => (
                  <tr key={u.userId} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}>
                    <td style={{ ...tdS, color: '#FF6B9D', fontWeight: 700 }}>#{u.userId}</td>
                    <td style={tdS}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                          {u.fullName?.[0] || '?'}
                        </div>
                        <span style={{ color: 'white', fontWeight: 600 }}>{u.fullName}</span>
                      </div>
                    </td>
                    <td style={tdS}>{u.email}</td>
                    <td style={tdS}>{u.phone || '-'}</td>
                    <td style={tdS}>{(u.roles || []).map(r => <RoleBadge key={r.roleId} name={r.roleName} />)}</td>
                    <td style={tdS}><StatusBadge status={u.status} /></td>
                    <td style={{ ...tdS, color: '#B0A0CC', fontSize: '0.8rem' }}>{fmtDate(u.createdAt)}</td>
                    <td style={{ ...tdS, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        {/* Chi tiết */}
                        <button onClick={() => setDetail(u)} style={{ background: 'rgba(33,150,243,0.12)', color: '#2196F3', border: '1px solid rgba(33,150,243,0.35)', padding: '0.28rem 0.65rem', borderRadius: 7, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit' }}>
                          👁 Chi tiết
                        </button>
                        {/* Khoá / Mở khoá */}
                        <button
                          disabled={toggling === u.userId}
                          onClick={() => handleToggle(u)}
                          style={{
                            background: u.status === 'ACTIVE' ? 'rgba(244,67,54,0.12)' : 'rgba(76,175,80,0.12)',
                            color: u.status === 'ACTIVE' ? '#F44336' : '#4CAF50',
                            border: `1px solid ${u.status === 'ACTIVE' ? 'rgba(244,67,54,0.35)' : 'rgba(76,175,80,0.35)'}`,
                            padding: '0.28rem 0.65rem', borderRadius: 7,
                            cursor: toggling === u.userId ? 'not-allowed' : 'pointer',
                            fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit',
                            opacity: toggling === u.userId ? 0.5 : 1,
                          }}
                        >
                          {toggling === u.userId ? '⏳' : u.status === 'ACTIVE' ? '🔒 Khoá' : '🔓 Mở khoá'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!search.trim() && filterStatus === 'ALL' && (
          <div style={{ borderTop: '1px solid rgba(255,107,157,0.1)', padding: '0 1rem' }}>
            <Pagination page={page} totalPages={totalPages} onChange={fetchUsers} />
          </div>
        )}
      </div>
    </>
  )
}
