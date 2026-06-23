import Pagination from './Pagination'

const _th = { padding: '0.8rem 1rem', textAlign: 'left', color: '#FF6B9D', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(255,107,157,0.06)', whiteSpace: 'nowrap' }
const _td = { padding: '0.7rem 1rem', fontSize: '0.84rem', color: '#ccc', borderTop: '1px solid rgba(255,255,255,0.04)' }

export const th = _th
export const td = (extra = {}) => ({ ..._td, ...extra })

export function TableCard({ children }) {
  return (
    <div style={{ background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 16, overflow: 'hidden' }}>
      {children}
    </div>
  )
}

export function LoadingRow({ colSpan }) {
  return (
    <tr><td colSpan={colSpan} style={{ padding: '4rem', textAlign: 'center', color: '#B0A0CC' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>Đang tải...
    </td></tr>
  )
}

export function EmptyRow({ colSpan, message, icon }) {
  return (
    <tr><td colSpan={colSpan} style={{ padding: '3rem', textAlign: 'center', color: '#7B5FA0' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon || '📭'}</div>
      {message || 'Không có dữ liệu'}
    </td></tr>
  )
}

export function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 10, padding: '0.75rem 1rem', color: '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>
      ⚠️ {message}
    </div>
  )
}

export function FilterTabs({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
      {options.map(([key, label]) => (
        <button key={key} onClick={() => onChange(key)} style={{
          padding: '0.4rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
          border: value === key ? 'none' : '1px solid rgba(255,107,157,0.3)',
          background: value === key ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'transparent',
          color: value === key ? 'white' : '#B0A0CC', fontFamily: 'inherit',
        }}>
          {label}
        </button>
      ))}
    </div>
  )
}

export function RefreshButton({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'transparent', border: '1px solid rgba(255,107,157,0.3)', color: '#FF6B9D', padding: '0.4rem 0.9rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'inherit' }}>
      🔄 Làm mới
    </button>
  )
}

export { Pagination }
