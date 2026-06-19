import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,107,157,0.25)', color: 'var(--text)', padding: '0.75rem 1rem', borderRadius: 12, fontSize: '0.95rem', fontFamily: 'Nunito,sans-serif', outline: 'none', width: '100%' }
const labelStyle = { fontSize: '0.78rem', fontWeight: 700, color: 'var(--sakura-light)', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ email: '', password: '', confirmPassword: '', fullName: '', phone: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      // Redirect về trang trước đó nếu có (ví dụ /admin)
      const from = new URLSearchParams(window.location.search).get('from') || '/'
      navigate(from)
    }
    catch (err) { setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng') }
    finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (regForm.password !== regForm.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return }
    if (regForm.password.length < 6) { setError('Mật khẩu phải ít nhất 6 ký tự'); return }
    setError(''); setLoading(true)
    try {
      await register({ email: regForm.email, password: regForm.password, fullName: regForm.fullName, phone: regForm.phone })
      await login(regForm.email, regForm.password)
      navigate('/')
    } catch (err) { setError(err.response?.data?.message || 'Đăng ký thất bại') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem 2rem', position: 'relative', zIndex: 10 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🌸</div>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, background: 'linear-gradient(90deg,#FF6B9D,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MiYuki Express</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Đặt vé xe khách toàn quốc</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,107,157,0.25)', borderRadius: 24, padding: '2rem', backdropFilter: 'blur(12px)' }}>
          {/* Mode Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 50, padding: 4, marginBottom: '1.5rem' }}>
            {[['login','Đăng nhập'],['register','Đăng ký']].map(([m, label]) => (
              <button key={m} type="button" onClick={() => { setMode(m); setError('') }} style={{ flex: 1, background: mode === m ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'none', border: 'none', color: mode === m ? 'white' : 'var(--text-muted)', padding: '0.5rem', borderRadius: 50, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>{label}</button>
            ))}
          </div>

          {error && <div style={{ background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', color: '#ffaaaa', padding: '0.75rem 1rem', borderRadius: 10, marginBottom: '1rem', fontSize: '0.88rem' }}>{error}</div>}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" placeholder="email@example.com" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div><label style={labelStyle}>Mật khẩu</label><input style={inputStyle} type="password" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} required /></div>
              <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: 12, fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito,sans-serif', opacity: loading ? 0.6 : 1, marginTop: '0.5rem' }}>
                {loading ? 'Đang xử lý...' : '🎫 Đăng Nhập'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={labelStyle}>Họ và tên</label><input style={inputStyle} type="text" placeholder="Nguyễn Văn A" value={regForm.fullName} onChange={e => setRegForm(f => ({ ...f, fullName: e.target.value }))} required /></div>
              <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" placeholder="email@example.com" value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div><label style={labelStyle}>Số điện thoại</label><input style={inputStyle} type="tel" placeholder="0901234567" value={regForm.phone} onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><label style={labelStyle}>Mật khẩu</label><input style={inputStyle} type="password" placeholder="Ít nhất 6 ký tự" value={regForm.password} onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} required /></div>
              <div><label style={labelStyle}>Xác nhận mật khẩu</label><input style={inputStyle} type="password" placeholder="Nhập lại mật khẩu" value={regForm.confirmPassword} onChange={e => setRegForm(f => ({ ...f, confirmPassword: e.target.value }))} required /></div>
              <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: 12, fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito,sans-serif', opacity: loading ? 0.6 : 1, marginTop: '0.5rem' }}>
                {loading ? 'Đang xử lý...' : '🌸 Tạo Tài Khoản'}
              </button>
            </form>
          )}
        </div>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--sakura)', textDecoration: 'none' }}>← Quay về trang chủ</Link>
        </p>
      </div>
    </div>
  )
}
