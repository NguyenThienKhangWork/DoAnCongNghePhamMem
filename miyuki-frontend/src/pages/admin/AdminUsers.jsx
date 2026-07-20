import { useEffect, useState, useCallback } from 'react'
import { Search, UserX, Eye, Clock, Lock, Unlock, X } from 'lucide-react'
import { adminService } from '../../services/api'
import { th, td, TableCard, LoadingRow, EmptyRow, ErrorBanner, FilterTabs, RefreshButton, Pagination } from '../../components/admin/AdminTable'

const fmtDate = dt => dt ? new Date(dt).toLocaleDateString('vi-VN') : '-'

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
    <span style={{ background: `${colors[name] || '#555'}22`, color: colors[name] || '#ccc', border: `1px solid ${colors[name] || '#555'}55`, padding: '0.15rem 0.5rem', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, marginRight: 3 }}>
      {name}
    </span>
  )
}

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
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ccc', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
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

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalEls, setTotalEls] = useState(0)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)
  const [toggling, setToggling] = useState(null)

  const fetchUsers = useCallback((p = 0, s = search, st = filterStatus) => {
    setLoading(true); setError('')
    adminService.getUsers(p, 10, s, st)
      .then(res => {
        setUsers(res.data?.content || [])
        setTotalPages(res.data?.totalPages || 0)
        setTotalEls(res.data?.totalElements || 0)
        setPage(p)
      })
      .catch(err => setError(err.response?.data?.message || 'Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchUsers(0, search, filterStatus) }, [fetchUsers, search, filterStatus])

  const handleToggle = (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
    if (!window.confirm(`${newStatus === 'BLOCKED' ? 'Khoá' : 'Mở khoá'} tài khoản "${user.fullName}"?`)) return
    setToggling(user.userId)
    adminService.updateUserStatus(user.userId, newStatus)
      .then(() => fetchUsers(page))
      .catch(err => alert('Lỗi: ' + (err.response?.data?.message || err.message)))
      .finally(() => setToggling(null))
  }

  return (
    <>
      <UserDetailModal user={detail} onClose={() => setDetail(null)} />

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#7B5FA0', pointerEvents: 'none' }}><Search size={16} /></span>
          <input type="text" placeholder="Tìm tên, email, SĐT..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.3)', borderRadius: 10, padding: '0.6rem 1rem 0.6rem 2.5rem', color: 'white', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }} />
        </div>
        <FilterTabs options={[['ALL', 'Tất cả'], ['ACTIVE', 'Hoạt động'], ['BLOCKED', 'Bị khoá'], ['INACTIVE', 'Không HĐ']]} value={filterStatus} onChange={setFilterStatus} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: '#7B5FA0', fontSize: '0.82rem' }}>{totalEls} người dùng</span>
          <RefreshButton onClick={() => fetchUsers(page, search, filterStatus)} />
        </div>
      </div>

      <ErrorBanner message={error} />

      <TableCard>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr>{['ID', 'Người dùng', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Hành động'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow colSpan={8} /> : users.length === 0 ? <EmptyRow colSpan={8} icon={<UserX size={32} />} message="Không tìm thấy người dùng nào" /> : users.map((u, i) => (
              <tr key={u.userId} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}>
                <td style={{ ...td(), color: '#FF6B9D', fontWeight: 700 }}>#{u.userId}</td>
                <td style={td()}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                      {u.fullName?.[0] || '?'}
                    </div>
                    <span style={{ color: 'white', fontWeight: 600 }}>{u.fullName}</span>
                  </div>
                </td>
                <td style={td()}>{u.email}</td>
                <td style={td()}>{u.phone || '-'}</td>
                <td style={td()}>{(u.roles || []).map(r => <RoleBadge key={r.roleId} name={r.roleName} />)}</td>
                <td style={td()}><StatusBadge status={u.status} /></td>
                <td style={{ ...td(), color: '#B0A0CC', fontSize: '0.8rem' }}>{fmtDate(u.createdAt)}</td>
                <td style={{ ...td(), textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                    <button onClick={() => setDetail(u)} style={{ background: 'rgba(33,150,243,0.12)', color: '#2196F3', border: '1px solid rgba(33,150,243,0.35)', padding: '0.28rem 0.65rem', borderRadius: 7, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Eye size={14} /> Chi tiết
                    </button>
                    <button disabled={toggling === u.userId} onClick={() => handleToggle(u)}
                      style={{ background: u.status === 'ACTIVE' ? 'rgba(244,67,54,0.12)' : 'rgba(76,175,80,0.12)', color: u.status === 'ACTIVE' ? '#F44336' : '#4CAF50', border: `1px solid ${u.status === 'ACTIVE' ? 'rgba(244,67,54,0.35)' : 'rgba(76,175,80,0.35)'}`, padding: '0.28rem 0.65rem', borderRadius: 7, cursor: toggling === u.userId ? 'not-allowed' : 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit', opacity: toggling === u.userId ? 0.5 : 1 }}>
                      {toggling === u.userId ? <><Clock size={14} /> Đang xử lý</> : u.status === 'ACTIVE' ? <><Lock size={14} /> Khoá</> : <><Unlock size={14} /> Mở khoá</>}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: '1px solid rgba(255,107,157,0.1)', padding: '0 1rem' }}>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchUsers(p, search, filterStatus)} />
        </div>
      </TableCard>
    </>
  )
}
