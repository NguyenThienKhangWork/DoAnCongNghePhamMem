const btnPage = (active, disabled) => ({
  padding: '0.35rem 0.75rem', borderRadius: 8, fontWeight: 600, fontSize: '0.8rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  border: active ? 'none' : '1px solid rgba(255,107,157,0.3)',
  background: active ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'transparent',
  color: disabled ? '#444' : active ? 'white' : '#B0A0CC',
  fontFamily: 'inherit',
})

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const start = Math.max(0, page - 2)
  const end = Math.min(totalPages - 1, page + 2)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  return (
    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'center', padding: '0.9rem 0' }}>
      <button onClick={() => onChange(page - 1)} disabled={page === 0} style={btnPage(false, page === 0)}>← Trước</button>
      {start > 0 && <span style={{ color: '#555' }}>…</span>}
      {pages.map(p => <button key={p} onClick={() => onChange(p)} style={btnPage(p === page, false)}>{p + 1}</button>)}
      {end < totalPages - 1 && <span style={{ color: '#555' }}>…</span>}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1} style={btnPage(false, page >= totalPages - 1)}>Tiếp →</button>
    </div>
  )
}
