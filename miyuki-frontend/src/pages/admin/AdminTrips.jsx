import { useEffect, useState, useCallback } from 'react'
import { adminService } from '../../services/api'
import { th, td, TableCard, LoadingRow, EmptyRow, ErrorBanner, FilterTabs, RefreshButton, Pagination } from '../../components/admin/AdminTable'

const fmtVND = v => v ? Number(v).toLocaleString('vi-VN') + ' ₫' : '-'
const fmtDT = dt => {
  if (!dt) return '-'
  const d = new Date(dt)
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const inp = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,107,157,0.3)',
  borderRadius: 8, padding: '0.55rem 0.85rem', color: 'white', fontSize: '0.86rem',
  outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
}

function StatusBadge({ status }) {
  const map = {
    SCHEDULED: { bg: 'rgba(33,150,243,0.15)', color: '#2196F3', label: '📅 Đã lên lịch' },
    ONGOING:   { bg: 'rgba(76,175,80,0.15)',  color: '#4CAF50', label: '🚌 Đang chạy' },
    COMPLETED: { bg: 'rgba(158,158,158,0.15)',color: '#9E9E9E', label: '✔ Hoàn thành' },
    CANCELLED: { bg: 'rgba(244,67,54,0.15)',  color: '#F44336', label: '❌ Đã huỷ' },
  }
  const s = map[status] || { bg: 'rgba(255,255,255,0.08)', color: '#ccc', label: status }
  return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.label}</span>
}

function TripForm({ routes, buses, initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(initial || { routeId: '', busId: '', departureTime: '', arrivalTime: '', price: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = e => {
    e.preventDefault()
    if (new Date(form.arrivalTime) <= new Date(form.departureTime)) {
      alert('Giờ đến phải sau giờ đi')
      return
    }
    onSave({ routeId: Number(form.routeId), busId: Number(form.busId), departureTime: form.departureTime, arrivalTime: form.arrivalTime, price: Number(form.price) })
  }

  const lbl = s => <label style={{ color: '#B0A0CC', fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>{s}</label>

  return (
    <div style={{ background: 'rgba(13,27,42,0.98)', border: '1px solid rgba(255,107,157,0.3)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ color: 'white', margin: 0, fontWeight: 800 }}>{initial?.tripId ? '✏️ Cập nhật chuyến đi' : '➕ Thêm chuyến mới'}</h3>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ccc', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          {lbl('Tuyến đường *')}
          <select value={form.routeId} onChange={e => set('routeId', e.target.value)} required style={{ ...inp, appearance: 'none' }}>
            <option value="">-- Chọn tuyến --</option>
            {routes.map(r => <option key={r.routeId} value={r.routeId}>{r.departureCity} → {r.destinationCity}</option>)}
          </select>
        </div>
        <div>
          {lbl('Xe khách *')}
          <select value={form.busId} onChange={e => set('busId', e.target.value)} required style={{ ...inp, appearance: 'none' }}>
            <option value="">-- Chọn xe --</option>
            {buses.map(b => <option key={b.busId} value={b.busId}>{b.registrationPlate || b.busName} — {b.totalSeats} chỗ ({b.busType})</option>)}
          </select>
        </div>
        <div>
          {lbl('Giờ khởi hành *')}
          <input type="datetime-local" value={form.departureTime} onChange={e => set('departureTime', e.target.value)} required style={inp} />
        </div>
        <div>
          {lbl('Giờ đến *')}
          <input type="datetime-local" value={form.arrivalTime} onChange={e => set('arrivalTime', e.target.value)} required style={inp} />
        </div>
        <div>
          {lbl('Giá vé (VNĐ) *')}
          <input type="number" min="1000" placeholder="250000" value={form.price} onChange={e => set('price', e.target.value)} required style={inp} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="submit" disabled={saving} style={{ width: '100%', background: saving ? 'rgba(123,47,190,0.4)' : 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', borderRadius: 10, padding: '0.65rem', fontWeight: 800, fontSize: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {saving ? '⏳ Đang lưu...' : initial?.tripId ? '💾 Cập nhật' : '✅ Tạo chuyến'}
          </button>
        </div>
      </form>
    </div>
  )
}

function TripDetailModal({ trip, onClose, onChangeStatus }) {
  if (!trip) return null
  const [changing, setChanging] = useState(false)
  const handleStatus = async (status) => {
    if (!window.confirm(`Đổi trạng thái thành "${ {SCHEDULED: 'Đã lên lịch', ONGOING: 'Đang chạy', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã huỷ'}[status] }"?`)) return
    setChanging(true)
    try { await onChangeStatus(trip.tripId, status) } finally { setChanging(false) }
  }
  const nextStatuses = { SCHEDULED: ['ONGOING', 'CANCELLED'], ONGOING: ['COMPLETED', 'CANCELLED'], COMPLETED: [], CANCELLED: [] }[trip.status] || []
  const statusColors = { ONGOING: '#4CAF50', CANCELLED: '#F44336', COMPLETED: '#2196F3' }
  const statusLabels = { ONGOING: 'Đang chạy', CANCELLED: 'Đã huỷ', COMPLETED: 'Hoàn thành' }

  const row = (label, value) => (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 0', alignItems: 'flex-start' }}>
      <span style={{ color: '#7B5FA0', fontSize: '0.82rem', width: 150, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'white', fontSize: '0.85rem' }}>{value || '-'}</span>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}>
      <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,107,157,0.3)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 520 }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ color: '#FF6B9D', fontSize: '0.72rem', fontWeight: 700, letterSpacing: 1 }}>CHUYẾN ĐI #{trip.tripId}</div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '1.05rem', marginTop: '0.15rem' }}>
              {trip.route ? `${trip.route.departureCity} → ${trip.route.destinationCity}` : 'N/A'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ccc', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
        {row('Xe khách', `${trip.bus?.registrationPlate || ''} ${trip.bus?.busName ? '— ' + trip.bus.busName : ''} (${trip.bus?.busType || ''})`)}
        {row('Giờ khởi hành', fmtDT(trip.departureTime))}
        {row('Giờ đến', fmtDT(trip.arrivalTime))}
        {row('Giá vé', fmtVND(trip.price))}
        {row('Ghế trống', `${trip.availableSeats ?? '-'} ghế`)}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 0', alignItems: 'center' }}>
          <span style={{ color: '#7B5FA0', fontSize: '0.82rem', width: 150, flexShrink: 0 }}>Trạng thái</span>
          <StatusBadge status={trip.status} />
        </div>
        {nextStatuses.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ color: '#B0A0CC', fontSize: '0.78rem', marginBottom: '0.6rem' }}>Đổi trạng thái:</div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {nextStatuses.map(s => (
                <button key={s} disabled={changing} onClick={() => handleStatus(s)} style={{
                  background: `${statusColors[s]}18`, color: statusColors[s],
                  border: `1px solid ${statusColors[s]}55`, padding: '0.4rem 1rem',
                  borderRadius: 8, cursor: changing ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem', fontWeight: 700, fontFamily: 'inherit',
                }}>
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminTrips() {
  const [trips, setTrips] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalEls, setTotalEls] = useState(0)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [detail, setDetail] = useState(null)

  const fetchTrips = useCallback((p = 0, st = filterStatus) => {
    setLoading(true); setError('')
    adminService.getTrips(p, 10, st)
      .then(res => {
        setTrips(res.data?.content || [])
        setTotalPages(res.data?.totalPages || 0)
        setTotalEls(res.data?.totalElements || 0)
        setPage(p)
      })
      .catch(err => setError(err.response?.data?.message || 'Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [filterStatus])

  useEffect(() => {
    fetchTrips(0, filterStatus)
    adminService.getRoutes().then(r => setRoutes(r.data || [])).catch(() => {})
    adminService.getBuses().then(r => setBuses(r.data || [])).catch(() => {})
  }, [fetchTrips, filterStatus])

  const handleCreate = async (data) => {
    setSaving(true)
    try {
      await adminService.createTrip(data)
      setShowForm(false)
      fetchTrips(0)
    } catch (err) {
      alert('Lỗi tạo chuyến: ' + (err.response?.data?.message || err.message))
    } finally { setSaving(false) }
  }

  const handleChangeStatus = async (tripId, status) => {
    await adminService.updateTripStatus(tripId, status)
    setDetail(null)
    fetchTrips(page)
  }

  return (
    <>
      <TripDetailModal trip={detail} onClose={() => setDetail(null)} onChangeStatus={handleChangeStatus} />

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <FilterTabs options={[['ALL', 'Tất cả'], ['SCHEDULED', 'Đã lên lịch'], ['ONGOING', 'Đang chạy'], ['COMPLETED', 'Hoàn thành'], ['CANCELLED', 'Đã huỷ']]} value={filterStatus} onChange={setFilterStatus} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: '#7B5FA0', fontSize: '0.82rem' }}>{totalEls} chuyến</span>
          <RefreshButton onClick={() => fetchTrips(page, filterStatus)} />
          <button onClick={() => setShowForm(v => !v)} style={{ background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.45rem 1.1rem', borderRadius: 10, fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            {showForm ? '✕ Đóng form' : '➕ Thêm chuyến'}
          </button>
        </div>
      </div>

      {showForm && <TripForm routes={routes} buses={buses} onSave={handleCreate} onClose={() => setShowForm(false)} saving={saving} />}
      <ErrorBanner message={error} />

      <TableCard>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr>
              {['ID', 'Tuyến đường', 'Xe khách', 'Giờ đi', 'Giờ đến', 'Giá vé', 'Ghế trống', 'Trạng thái', 'Hành động'].map(h =>
                <th key={h} style={{ ...th, textAlign: h === 'Giá vé' || h === 'Ghế trống' || h === 'Hành động' ? 'center' : 'left' }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow colSpan={9} /> : trips.length === 0 ? <EmptyRow colSpan={9} icon="🚌" message="Không có chuyến đi nào" /> : trips.map((t, i) => (
              <tr key={t.tripId} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)', cursor: 'pointer' }}
                onClick={() => setDetail(t)}>
                <td style={{ ...td(), color: '#FF6B9D', fontWeight: 700 }}>#{t.tripId}</td>
                <td style={{ ...td(), color: 'white', fontWeight: 600 }}>
                  {t.route ? `${t.route.departureCity} → ${t.route.destinationCity}` : '-'}
                </td>
                <td style={td()}>{t.bus?.registrationPlate || t.bus?.busName || '-'}</td>
                <td style={{ ...td(), fontSize: '0.78rem', color: '#B0A0CC' }}>{fmtDT(t.departureTime)}</td>
                <td style={{ ...td(), fontSize: '0.78rem', color: '#B0A0CC' }}>{fmtDT(t.arrivalTime)}</td>
                <td style={{ ...td(), textAlign: 'center', color: '#FFD700', fontWeight: 700 }}>{fmtVND(t.price)}</td>
                <td style={{ ...td(), textAlign: 'center', color: (t.availableSeats || 0) > 5 ? '#4CAF50' : '#FF9800', fontWeight: 700 }}>{t.availableSeats ?? '-'}</td>
                <td style={td()}><StatusBadge status={t.status} /></td>
                <td style={{ ...td(), textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                    <button onClick={() => setDetail(t)} style={{ background: 'rgba(33,150,243,0.12)', color: '#2196F3', border: '1px solid rgba(33,150,243,0.35)', padding: '0.28rem 0.65rem', borderRadius: 7, cursor: 'pointer', fontSize: '0.73rem', fontWeight: 700, fontFamily: 'inherit' }}>
                      👁 Chi tiết
                    </button>
                    {t.status !== 'CANCELLED' && t.status !== 'COMPLETED' && (
                      <button onClick={() => { if (window.confirm('Huỷ chuyến đi này?')) handleChangeStatus(t.tripId, 'CANCELLED') }}
                        style={{ background: 'rgba(244,67,54,0.12)', color: '#F44336', border: '1px solid rgba(244,67,54,0.35)', padding: '0.28rem 0.65rem', borderRadius: 7, cursor: 'pointer', fontSize: '0.73rem', fontWeight: 700, fontFamily: 'inherit' }}>
                        ❌ Huỷ
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: '1px solid rgba(255,107,157,0.1)', padding: '0 1rem' }}>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchTrips(p, filterStatus)} />
        </div>
      </TableCard>
    </>
  )
}
