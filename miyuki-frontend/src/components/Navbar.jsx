import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.9rem 2.5rem',
      background: 'rgba(13,27,42,0.7)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,107,157,0.2)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none' }}>
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #FF6B9D, #7B2FBE)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem'
        }}>🌸</div>
        <div>
          <div style={{ fontFamily: 'sans-serif', fontSize: '0.75rem', color: '#FF6B9D', letterSpacing: 2 }}>みゆき エクスプレス</div>
          <div style={{ color: 'white', fontWeight: 900, fontSize: '1rem', lineHeight: 1.1 }}>MiYuki Express</div>
        </div>
      </Link>

      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center' }}>
        <li><Link to="/#booking" style={{ color: '#B0A0CC', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
          onClick={e => { e.preventDefault(); navigate('/'); setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>
          Đặt vé
        </Link></li>
        <li><Link to="/search" style={{ color: '#B0A0CC', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Tuyến đường</Link></li>
        {token && (
          <li><Link to="/my-bookings" style={{ color: '#B0A0CC', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Vé của tôi</Link></li>
        )}
        {token && (
          <li><Link to="/profile" style={{ color: '#B0A0CC', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Tài khoản</Link></li>
        )}
        {token && (
          <li><Link to="/admin" style={{ color: '#FF6B9D', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>⚙️ Admin</Link></li>
        )}
        {token ? (
          <li>
            <button onClick={() => { logout(); navigate('/') }} style={{
              background: 'linear-gradient(135deg, #FF6B9D, #7B2FBE)',
              color: 'white', border: 'none',
              padding: '0.5rem 1.4rem', borderRadius: 50,
              fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif'
            }}>Đăng xuất</button>
          </li>
        ) : (
          <li>
            <Link to="/login" style={{
              background: 'linear-gradient(135deg, #FF6B9D, #7B2FBE)',
              color: 'white', textDecoration: 'none',
              padding: '0.5rem 1.4rem', borderRadius: 50,
              fontWeight: 800, fontSize: '0.88rem',
              display: 'inline-block'
            }}>🎫 Đặt ngay</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
