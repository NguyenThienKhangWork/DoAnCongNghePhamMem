import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { login, isAdmin, token } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = new URLSearchParams(location.search).get('from') || '/admin'

  // Nếu đã là admin thì redirect luôn
  useEffect(() => {
    if (token && isAdmin) {
      navigate(from, { replace: true })
    }
  }, [token, isAdmin, navigate, from])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Vui lòng nhập đầy đủ thông tin'); return }
    setLoading(true)
    setError('')
    try {
      const data = await login(email, password)
      const roles = data?.user?.roles || []
      const hasAdmin = roles.some(r => r.roleName === 'ADMIN')
      if (!hasAdmin) {
        setError('Tài khoản của bạn không có quyền quản trị viên')
        // Đăng xuất luôn vì không phải admin
        localStorage.removeItem('token')
        window.location.reload()
        return
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D1B2A 0%, #1a0d2e 50%, #0D1B2A 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Nunito, sans-serif',
    }}>
      {/* Decorative orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(255,107,157,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%',
        width: 250, height: 250,
        background: 'radial-gradient(circle, rgba(123,47,190,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420,
        margin: '1rem',
        background: 'rgba(13,27,42,0.95)',
        border: '1px solid rgba(255,107,157,0.25)',
        borderRadius: 24,
        padding: '2.5rem 2.25rem',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(255,107,157,0.08)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #FF6B9D, #7B2FBE)',
            borderRadius: 18, fontSize: '1.8rem',
            marginBottom: '1rem',
            boxShadow: '0 8px 24px rgba(255,107,157,0.35)',
          }}>🌸</div>
          <div style={{ color: '#FF6B9D', fontSize: '0.7rem', letterSpacing: 3, fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Admin Portal
          </div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
            MiYuki Express
          </h1>
          <p style={{ color: '#7B5FA0', fontSize: '0.82rem', marginTop: '0.4rem', margin: '0.4rem 0 0' }}>
            Đăng nhập với tài khoản quản trị viên
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: 'rgba(244,67,54,0.12)',
            border: '1px solid rgba(244,67,54,0.3)',
            borderRadius: 10,
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#f87171',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}>
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ color: '#B0A0CC', fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              Email quản trị
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1rem', pointerEvents: 'none',
              }}>👤</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@miyuki.vn"
                autoComplete="username"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,107,157,0.2)',
                  borderRadius: 10,
                  padding: '0.75rem 0.9rem 0.75rem 2.5rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontFamily: 'Nunito, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#FF6B9D'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,107,157,0.2)'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ color: '#B0A0CC', fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1rem', pointerEvents: 'none',
              }}>🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,107,157,0.2)',
                  borderRadius: 10,
                  padding: '0.75rem 2.8rem 0.75rem 2.5rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontFamily: 'Nunito, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#FF6B9D'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,107,157,0.2)'}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#7B5FA0', fontSize: '0.9rem', padding: 0,
                }}
              >{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading
                ? 'rgba(123,47,190,0.4)'
                : 'linear-gradient(135deg, #FF6B9D, #7B2FBE)',
              border: 'none',
              borderRadius: 12,
              padding: '0.85rem',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.95rem',
              fontFamily: 'Nunito, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(255,107,157,0.35)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                Đang xác thực...
              </>
            ) : (
              <>🚀 Đăng nhập Admin</>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a
            href="/"
            style={{
              color: '#7B5FA0',
              fontSize: '0.8rem',
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            }}
          >
            ← Về trang chủ
          </a>
        </div>

        {/* Security note */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(123,47,190,0.08)',
          border: '1px solid rgba(123,47,190,0.2)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
        }}>
          <span style={{ flexShrink: 0 }}>🔐</span>
          <span style={{ color: '#7B5FA0', fontSize: '0.78rem', lineHeight: 1.4 }}>
            Trang này chỉ dành cho quản trị viên hệ thống. Mọi truy cập trái phép đều được ghi lại.
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        input::placeholder { color: rgba(176,160,204,0.5); }
      `}</style>
    </div>
  )
}
