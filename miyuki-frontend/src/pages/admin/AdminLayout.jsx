import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Bus, Ticket, Map, Star, Bell, DollarSign, Flower2, LogOut, ChevronLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',    path: '/admin' },
  { icon: Users,           label: 'Người dùng',   path: '/admin/users' },
  { icon: Bus,             label: 'Chuyến đi',    path: '/admin/trips' },
  { icon: Ticket,          label: 'Đặt vé',       path: '/admin/bookings' },
  { icon: Map,             label: 'Tuyến đường',  path: '/admin/routes' },
  { icon: Star,            label: 'Đánh giá',     path: '/admin/reviews' },
  { icon: Bell,            label: 'Thông báo',    path: '/admin/notifications' },
  { icon: DollarSign,      label: 'Hoàn tiền',    path: '/admin/refunds' },
]

export default function AdminLayout() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const currentPage = menuItems.find(item =>
    item.path === '/admin'
      ? location.pathname === '/admin' || location.pathname === '/admin/'
      : location.pathname.startsWith(item.path)
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 0 }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        minHeight: '100vh',
        background: 'rgba(13,27,42,0.97)',
        borderRight: '1px solid rgba(255,107,157,0.2)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 200,
      }}>
        {/* Logo */}
        <div style={{
          padding: '1.5rem 1.2rem 1rem',
          borderBottom: '1px solid rgba(255,107,157,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #FF6B9D, #7B2FBE)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem'
            }}><Flower2 size={20} /></div>
            <div>
              <div style={{ color: '#FF6B9D', fontSize: '0.65rem', letterSpacing: 2, fontFamily: 'sans-serif' }}>ADMIN</div>
              <div style={{ color: 'white', fontWeight: 900, fontSize: '0.95rem' }}>MiYuki Express</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '1rem 0.7rem' }}>
          {menuItems.map(item => {
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin' || location.pathname === '/admin/'
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: 10,
                  marginBottom: '0.25rem',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive ? 'white' : '#B0A0CC',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(255,107,157,0.25), rgba(123,47,190,0.25))'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #FF6B9D' : '3px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom user info */}
        <div style={{
          padding: '1rem 1.2rem',
          borderTop: '1px solid rgba(255,107,157,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, #FF6B9D, #7B2FBE)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', color: 'white', fontWeight: 700
            }}>
              {user?.fullName?.[0] || 'A'}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>{user?.fullName || 'Admin'}</div>
              <div style={{ color: '#7B5FA0', fontSize: '0.7rem' }}>Quản trị viên</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'rgba(244,67,54,0.1)',
              border: '1px solid rgba(244,67,54,0.25)',
              borderRadius: 8,
              padding: '0.45rem 0.75rem',
              color: '#f87171',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,67,54,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,67,54,0.1)'}
          >
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ marginLeft: 240, flex: 1, minHeight: '100vh', background: 'rgba(8,15,28,0.98)', position: 'relative' }}>
        {/* Top header */}
        <header style={{
          padding: '1rem 2rem',
          background: 'rgba(13,27,42,0.95)',
          borderBottom: '1px solid rgba(255,107,157,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div>
            <div style={{ color: '#7B5FA0', fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase' }}>Admin Panel</div>
            <h1 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              {currentPage?.icon && <currentPage.icon size={20} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />} {currentPage?.label || 'Dashboard'}
            </h1>
          </div>
          <Link to="/" style={{
            color: '#B0A0CC',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            padding: '0.4rem 1rem',
            borderRadius: 20,
            border: '1px solid rgba(255,107,157,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            <ChevronLeft size={16} /> Về trang chủ
          </Link>
        </header>

        {/* Page content */}
        <main style={{ padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
