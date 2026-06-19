import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const inputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,107,157,0.25)', color: 'var(--text)', padding: '0.7rem 1rem', borderRadius: 12, fontSize: '0.9rem', fontFamily: 'Nunito,sans-serif', outline: 'none', width: '100%' }
const labelStyle = { fontSize: '0.75rem', fontWeight: 700, color: 'var(--sakura-light)', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('info')
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' })
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data } = await userService.getProfile()
      setProfile(data)
      setForm({ fullName: data.fullName || '', phone: data.phone || '', address: data.address || '' })
    } catch { }
    finally { setLoading(false) }
  }

  const handleUpdate = async (e) => {
    e.preventDefault(); setSaving(true); setMsg({ type: '', text: '' })
    try { await userService.updateProfile(form); setMsg({ type: 'ok', text: 'Cập nhật thành công!' }); fetchProfile() }
    catch (err) { setMsg({ type: 'err', text: err.response?.data?.message || 'Cập nhật thất bại' }) }
    finally { setSaving(false) }
  }

  const handleChangePw = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) { setMsg({ type: 'err', text: 'Mật khẩu mới không khớp' }); return }
    if (pwForm.newPassword.length < 6) { setMsg({ type: 'err', text: 'Mật khẩu ít nhất 6 ký tự' }); return }
    setSaving(true); setMsg({ type: '', text: '' })
    try { await userService.changePassword({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }); setMsg({ type: 'ok', text: 'Đổi mật khẩu thành công!' }); setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' }) }
    catch (err) { setMsg({ type: 'err', text: err.response?.data?.message || 'Đổi mật khẩu thất bại' }) }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}><div style={{ fontSize: '3rem' }}>🔄</div><p>Đang tải...</p></div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 10, padding: '5rem 1.5rem 3rem' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem' }}>👤 Hồ Sơ Của Tôi</h1>

        {/* User card */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, color: 'white', flexShrink: 0 }}>
            {(profile?.fullName || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900 }}>{profile?.fullName}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{profile?.email}</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              {profile?.roles?.map(r => (
                <span key={r.roleId} style={{ background: 'rgba(123,47,190,0.2)', color: 'var(--violet-light)', border: '1px solid rgba(192,132,252,0.3)', padding: '0.15rem 0.6rem', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>{r.roleName}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[['info','Thông tin'],['password','Mật khẩu']].map(([k, label]) => (
            <button key={k} onClick={() => { setTab(k); setMsg({ type: '', text: '' }) }} style={{ background: tab === k ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'transparent', border: tab === k ? 'none' : '1px solid rgba(255,255,255,0.2)', color: tab === k ? 'white' : 'var(--text-muted)', padding: '0.5rem 1.25rem', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>{label}</button>
          ))}
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: '1.75rem' }}>
          {msg.text && (
            <div style={{ background: msg.type === 'ok' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)', border: `1px solid ${msg.type === 'ok' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, color: msg.type === 'ok' ? '#4ade80' : '#f87171', padding: '0.7rem 1rem', borderRadius: 10, marginBottom: '1rem', fontSize: '0.88rem' }}>
              {msg.text}
            </div>
          )}

          {tab === 'info' ? (
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={labelStyle}>Họ và tên</label><input style={inputStyle} type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required /></div>
              <div><label style={labelStyle}>Email</label><input style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} type="email" value={profile?.email || ''} disabled /></div>
              <div><label style={labelStyle}>Số điện thoại</label><input style={inputStyle} type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><label style={labelStyle}>Địa chỉ</label><textarea style={{ ...inputStyle, resize: 'none', height: 80 }} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={3} /></div>
              <button type="submit" disabled={saving} style={{ background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: 12, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Nunito,sans-serif', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Đang lưu...' : '💾 Cập nhật thông tin'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePw} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={labelStyle}>Mật khẩu hiện tại</label><input style={inputStyle} type="password" value={pwForm.oldPassword} onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))} required /></div>
              <div><label style={labelStyle}>Mật khẩu mới</label><input style={inputStyle} type="password" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required minLength={6} /></div>
              <div><label style={labelStyle}>Xác nhận mật khẩu mới</label><input style={inputStyle} type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))} required /></div>
              <button type="submit" disabled={saving} style={{ background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: 12, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Nunito,sans-serif', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Đang đổi...' : '🔑 Đổi mật khẩu'}
              </button>
            </form>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1.5rem 0' }} />
          <button onClick={() => { logout(); navigate('/') }} style={{ background: 'transparent', border: '1px solid rgba(248,113,113,0.35)', color: '#f87171', padding: '0.6rem', width: '100%', borderRadius: 12, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'Nunito,sans-serif', fontWeight: 700 }}>
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </div>
  )
}
