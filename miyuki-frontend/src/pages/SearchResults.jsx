import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { tripService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { CITIES_BY_REGION, getCityLabel } from '../data/cities'

const selectStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,107,157,0.25)',
  color: 'var(--text)', padding: '0.6rem 0.8rem',
  borderRadius: 10, fontSize: '0.88rem',
  fontFamily: 'Nunito,sans-serif', outline: 'none', width: '100%'
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const [form, setForm] = useState({
    departure:   searchParams.get('departure')   || '',
    destination: searchParams.get('destination') || '',
    date:        searchParams.get('date')        || new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (form.departure && form.destination) fetchTrips()
  }, [])

  const fetchTrips = async (override) => {
    const p = override || form
    if (!p.departure || !p.destination) return
    setLoading(true); setError('')
    try {
      const { data } = await tripService.search(p)
      setTrips(data || [])
    } catch {
      setError('Không tìm được chuyến xe. Vui lòng thử lại.')
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams(form)
    fetchTrips()
  }

  const swapCities = () =>
    setForm(f => ({ ...f, departure: f.destination, destination: f.departure }))

  const sorted = [...trips].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'time')  return new Date(a.departureTime) - new Date(b.departureTime)
    return b.availableSeats - a.availableSeats
  })

  const busLabel = (type) =>
    type === 'SLEEPER'   ? '🛏 Giường nằm' :
    type === 'LIMOUSINE' ? '💺 Limousine'   : '🚌 Ghế ngồi'

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 10, paddingTop: '4rem' }}>
      {/* ── Search Bar ── */}
      <div style={{
        background: 'rgba(13,27,42,0.9)',
        borderBottom: '1px solid rgba(255,107,157,0.2)',
        padding: '1rem 2rem',
        backdropFilter: 'blur(12px)'
      }}>
        <form onSubmit={handleSearch} style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'flex', gap: '0.75rem',
          alignItems: 'flex-end', flexWrap: 'wrap'
        }}>
          {/* Điểm đi */}
          <div style={{ flex: '1 1 140px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--sakura-light)', fontWeight: 700, marginBottom: 4 }}>Điểm đi</div>
            <select style={selectStyle} value={form.departure}
              onChange={e => setForm(f => ({ ...f, departure: e.target.value }))}>
              <option value="">Chọn điểm đi...</option>
              {Object.entries(CITIES_BY_REGION).map(([region, cities]) => (
                <optgroup key={region} label={`── ${region} ──`}>
                  {cities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Swap */}
          <button type="button" onClick={swapCities} style={{
            background: 'rgba(255,107,157,0.15)',
            border: '1px solid rgba(255,107,157,0.4)',
            color: 'var(--sakura)', width: 36, height: 36,
            borderRadius: '50%', cursor: 'pointer',
            fontSize: '1rem', flexShrink: 0, alignSelf: 'flex-end'
          }}>⇄</button>

          {/* Điểm đến */}
          <div style={{ flex: '1 1 140px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--sakura-light)', fontWeight: 700, marginBottom: 4 }}>Điểm đến</div>
            <select style={selectStyle} value={form.destination}
              onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}>
              <option value="">Chọn điểm đến...</option>
              {Object.entries(CITIES_BY_REGION).map(([region, cities]) => (
                <optgroup key={region} label={`── ${region} ──`}>
                  {cities
                    .filter(c => c.value !== form.departure)
                    .map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Ngày đi */}
          <div style={{ flex: '1 1 130px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--sakura-light)', fontWeight: 700, marginBottom: 4 }}>Ngày đi</div>
            <input type="date" style={selectStyle} value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>

          <button type="submit" style={{
            background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)',
            color: 'white', border: 'none',
            padding: '0.6rem 1.5rem', borderRadius: 10,
            fontWeight: 800, fontSize: '0.9rem',
            cursor: 'pointer', fontFamily: 'Nunito,sans-serif',
            alignSelf: 'flex-end', flexShrink: 0
          }}>🔍 Tìm</button>
        </form>
      </div>

      {/* ── Results ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 900 }}>
            {form.departure && form.destination
              ? `${getCityLabel(form.departure)} → ${getCityLabel(form.destination)}`
              : 'Kết Quả Tìm Kiếm'}
            {trips.length > 0 && (
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem', marginLeft: 8 }}>
                ({trips.length} chuyến)
              </span>
            )}
          </h1>
          {trips.length > 1 && (
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ ...selectStyle, width: 'auto', padding: '0.4rem 0.8rem' }}>
              <option value="price">Giá thấp nhất</option>
              <option value="time">Giờ sớm nhất</option>
              <option value="seats">Còn nhiều ghế</option>
            </select>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>Đang tìm chuyến xe...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#ffaaaa' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p>{error}</p>
          </div>
        ) : sorted.length === 0 && (form.departure || form.destination) ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚌</div>
            <p>Không có chuyến xe nào cho lộ trình này</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Thử chọn ngày khác hoặc tuyến đường khác
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sorted.map(trip => (
              <div key={trip.tripId} style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 16, padding: '1.25rem 1.5rem'
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 900, fontSize: '1.15rem' }}>{trip.route?.departureCity}</span>
                      <span style={{ color: 'var(--sakura)', fontSize: '1.1rem' }}>→</span>
                      <span style={{ fontWeight: 900, fontSize: '1.15rem' }}>{trip.route?.destinationCity}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>
                        🕐 {new Date(trip.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        {' → '}
                        {new Date(trip.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>{busLabel(trip.bus?.busType)}</span>
                      {trip.bus?.busName && <span>· {trip.bus.busName}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontSize: '1.6rem', fontWeight: 900,
                      background: 'linear-gradient(90deg,#FF6B9D,#C084FC)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                    }}>
                      {Number(trip.price).toLocaleString('vi-VN')}đ
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {trip.availableSeats} ghế trống
                    </div>
                    <button
                      onClick={() => { if (!token) navigate('/login'); else navigate(`/booking/${trip.tripId}`) }}
                      disabled={trip.availableSeats === 0}
                      style={{
                        background: trip.availableSeats === 0
                          ? 'rgba(255,255,255,0.08)'
                          : 'linear-gradient(135deg,#FF6B9D,#7B2FBE)',
                        color: 'white', border: 'none',
                        padding: '0.5rem 1.5rem', borderRadius: 10,
                        fontWeight: 800, fontSize: '0.9rem',
                        cursor: trip.availableSeats === 0 ? 'not-allowed' : 'pointer',
                        fontFamily: 'Nunito,sans-serif',
                        opacity: trip.availableSeats === 0 ? 0.5 : 1
                      }}>
                      {trip.availableSeats === 0 ? 'Hết chỗ' : 'Đặt Vé'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
