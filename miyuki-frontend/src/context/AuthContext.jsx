import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService, userService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [token, setToken]   = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      userService.getProfile()
        .then(({ data }) => {
          setUser(data)
          setToken(storedToken)
        })
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await authService.login({ email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    return data
  }, [])

  const register = useCallback(async (userData) => {
    const { data } = await authService.register(userData)
    return data
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }, [])

  // Hiện loading screen nhỏ trong khi verify token
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D1B2A' }}>
        <div style={{ textAlign: 'center', color: '#B0A0CC' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌸</div>
          <div style={{ fontSize: '0.9rem' }}>Đang tải...</div>
        </div>
      </div>
    )
  }

  const isAdmin = user?.roles?.some(r => r.roleName === 'ADMIN') ?? false

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
