import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import StarsBg from './components/StarsBg'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import SearchResults from './pages/SearchResults'
import BookingPage from './pages/BookingPage'
import MyBookings from './pages/MyBookings'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTrips from './pages/admin/AdminTrips'
import AdminBookings from './pages/admin/AdminBookings'
import AdminRoutes from './pages/admin/AdminRoutes'
import AdminReviews from './pages/admin/AdminReviews'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminRefunds from './pages/admin/AdminRefunds'
import AdminLoginPage from './pages/admin/AdminLoginPage'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

// Chỉ cho phép user có role ADMIN vào, redirect về /admin/login nếu không đủ quyền
function AdminRoute({ children }) {
  const { token, isAdmin } = useAuth()
  const location = useLocation()
  if (!token) {
    return <Navigate to={`/admin/login?from=${encodeURIComponent(location.pathname)}`} replace />
  }
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

// Ẩn Navbar khi ở trang admin
function ConditionalNavbar() {
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) return null
  return <Navbar />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/booking/:tripId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      {/* Trang đăng nhập riêng cho admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      {/* Các trang admin - chỉ ADMIN role mới vào được */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="trips" element={<AdminTrips />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="routes" element={<AdminRoutes />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="refunds" element={<AdminRefunds />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <StarsBg />
        <ConditionalNavbar />
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}
