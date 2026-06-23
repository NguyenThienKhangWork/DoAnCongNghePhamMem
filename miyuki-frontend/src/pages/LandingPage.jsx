import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tripService } from '../services/api'
import AnimeCharacter from '../components/AnimeCharacter'
import { CITIES, CITIES_BY_REGION } from '../data/cities'


const POPULAR_ROUTES_STATIC = [
  { from: 'Hà Nội', fromVal: 'Ha Noi', to: 'TP.HCM', toVal: 'TP. Ho Chi Minh', time: '32 giờ', km: '1,726 km', trips: '5 chuyến', price: '380,000đ', badge: '🔥 HOT', badgeClass: 'hot' },
  { from: 'TP.HCM', fromVal: 'TP. Ho Chi Minh', to: 'Đà Lạt', toVal: 'Da Lat', time: '7 giờ', km: '308 km', trips: '5 chuyến', price: '165,000đ', badge: '💸 SALE', badgeClass: 'sale' },
  { from: 'Hà Nội', fromVal: 'Ha Noi', to: 'Đà Nẵng', toVal: 'Da Nang', time: '14 giờ', km: '763 km', trips: '4 chuyến', price: '230,000đ', badge: '✨ MỚI', badgeClass: 'new' },
  { from: 'TP.HCM', fromVal: 'TP. Ho Chi Minh', to: 'Cần Thơ', toVal: 'Can Tho', time: '3.5 giờ', km: '170 km', trips: '5 chuyến', price: '105,000đ', badge: '🔥 HOT', badgeClass: 'hot' },
  { from: 'TP.HCM', fromVal: 'TP. Ho Chi Minh', to: 'Nha Trang', toVal: 'Nha Trang', time: '9 giờ', km: '447 km', trips: '4 chuyến', price: '230,000đ', badge: '💸 SALE', badgeClass: 'sale' },
  { from: 'Đà Nẵng', fromVal: 'Da Nang', to: 'Hội An', toVal: 'Hoi An', time: '1 giờ', km: '30 km', trips: '3 chuyến', price: '40,000đ', badge: '✨ MỚI', badgeClass: 'new' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    departure: '', destination: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [activeTab, setActiveTab] = useState(0)
  const [popularTrips, setPopularTrips] = useState([])

  useEffect(() => {
    tripService.getPopular().then(({ data }) => setPopularTrips(data || [])).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!form.departure || !form.destination) return
    navigate(`/search?departure=${encodeURIComponent(form.departure)}&destination=${encodeURIComponent(form.destination)}&date=${form.date}`)  }

  const swapCities = () => setForm(f => ({ ...f, departure: f.destination, destination: f.departure }))

  const s = {
    section: { position: 'relative', zIndex: 10 },
    card: { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s' },
  }

  return (
    <div>
      {/* HERO */}
      <section style={{ ...s.section, minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '2rem', padding: '6rem 4rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3.4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '0.3rem' }}>
            <span style={{ display: 'block', fontSize: '0.55em', color: 'var(--sakura)', letterSpacing: 4, marginBottom: '0.2rem', fontWeight: 700 }}>✨ たびのはじまり ✨</span>
            <span className="gradient-text">Hành Trình<br />Việt Nam</span><br />
            <span style={{ fontSize: '0.8em', color: 'var(--text-muted)', fontWeight: 700 }}>của bạn bắt đầu ở đây</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, margin: '1.2rem 0 1.8rem', maxWidth: 400 }}>
            Đặt vé xe khách toàn quốc dễ dàng — từ Hà Nội đến Sài Gòn, từ Đà Lạt đến Hội An. An toàn, tiện lợi, giá rẻ nhất thị trường! 🚌
          </p>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
            {[['🛡️ Hoàn tiền 100%', 'pink'], ['✅ 2,000+ chuyến/ngày', 'violet'], ['⭐ 4.9/5 đánh giá', 'star']].map(([label, type]) => (
              <span key={label} style={{
                background: type === 'pink' ? 'rgba(255,107,157,0.15)' : type === 'violet' ? 'rgba(123,47,190,0.18)' : 'rgba(255,215,0,0.12)',
                border: `1px solid ${type === 'pink' ? 'rgba(255,107,157,0.4)' : type === 'violet' ? 'rgba(192,132,252,0.4)' : 'rgba(255,215,0,0.35)'}`,
                color: type === 'pink' ? 'var(--sakura-light)' : type === 'violet' ? 'var(--violet-light)' : 'var(--star)',
                padding: '0.3rem 0.9rem', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700
              }}>{label}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#booking" onClick={e => { e.preventDefault(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: 50, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
              🎫 Tìm chuyến đi ngay
            </a>
            <button style={{ background: 'transparent', color: 'var(--text)', border: '1.5px solid rgba(255,255,255,0.25)', padding: '0.85rem 1.6rem', borderRadius: 50, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
              📋 Xem lịch trình
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 460 }}><AnimeCharacter /></div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="booking" style={{ ...s.section, background: 'rgba(13,27,42,0.95)', borderTop: '1px solid rgba(255,107,157,0.2)', padding: '3.5rem 2rem' }}>
        <div style={{ textAlign: 'center', fontFamily: 'sans-serif', fontSize: '0.8rem', color: 'var(--sakura)', letterSpacing: 4, marginBottom: '0.5rem' }}>チケット予約 • ĐẶT VÉ</div>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem' }}>🎫 Tìm Chuyến Đi</h2>
        <form onSubmit={handleSearch} style={{ maxWidth: 860, margin: '0 auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,107,157,0.25)', borderRadius: 24, padding: '2.5rem 2rem' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 50, padding: 4, width: 'fit-content', margin: '0 auto 2rem' }}>
            {['🚌 Một chiều', '↩️ Khứ hồi', '📅 Nhiều ngày'].map((t, i) => (
              <button key={t} type="button" onClick={() => setActiveTab(i)} style={{
                background: activeTab === i ? 'linear-gradient(135deg,#FF6B9D,#7B2FBE)' : 'none',
                border: 'none', color: activeTab === i ? 'white' : 'var(--text-muted)',
                padding: '0.5rem 1.5rem', borderRadius: 50, fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer', fontFamily: 'Nunito,sans-serif',
                boxShadow: activeTab === i ? '0 4px 16px rgba(255,107,157,0.4)' : 'none'
              }}>{t}</button>
            ))}
          </div>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
            <Field label="🚩 Điểm đi">
              <select value={form.departure} onChange={e => setForm(f => ({ ...f, departure: e.target.value }))} required>
                <option value="">Chọn điểm đi...</option>
                {Object.entries(CITIES_BY_REGION).map(([region, cities]) => (
                  <optgroup key={region} label={`── ${region} ──`}>
                    {cities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 2 }}>
              <button type="button" onClick={swapCities} style={{ background: 'rgba(255,107,157,0.15)', border: '1px solid rgba(255,107,157,0.4)', color: 'var(--sakura)', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', transition: 'transform 0.3s' }}>⇄</button>
            </div>
            <Field label="🏁 Điểm đến">
              <select value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} required>
                <option value="">Chọn điểm đến...</option>
                {Object.entries(CITIES_BY_REGION).map(([region, cities]) => (
                  <optgroup key={region} label={`── ${region} ──`}>
                    {cities.filter(c => c.value !== form.departure).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>
            <Field label="📅 Ngày đi">
              <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </Field>
          </div>
          {/* Row 2 — disabled, sắp ra mắt */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginTop: '1rem', opacity: 0.5 }}>
            <Field label="👥 Số hành khách">
              <select disabled title="Sắp ra mắt"><option>1 hành khách</option></select>
            </Field>
            <Field label="🪑 Loại ghế">
              <select disabled title="Sắp ra mắt"><option>Tất cả loại xe</option></select>
            </Field>
            <Field label="⏰ Giờ khởi hành">
              <select disabled title="Sắp ra mắt"><option>Tất cả giờ</option></select>
            </Field>
            <Field label="💰 Khoảng giá">
              <select disabled title="Sắp ra mắt"><option>Tất cả mức giá</option></select>
            </Field>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            ⏳ Các bộ lọc nâng cao sẽ sớm ra mắt
          </div>
          <button type="submit" style={{ background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: 12, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'Nunito,sans-serif', width: '100%', marginTop: '1.5rem', letterSpacing: '0.3px' }}>
            🔍 Tìm kiếm chuyến đi ngay
          </button>
        </form>
      </section>

      {/* STATS */}
      <div style={{ ...s.section, padding: '3.5rem 2rem', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', textAlign: 'center' }}>
        {[['2,500+','🚌 Chuyến xe mỗi ngày'],['63','📍 Tỉnh thành phủ sóng'],['850+','🏢 Nhà xe đối tác'],['5M+','😊 Khách hàng hài lòng']].map(([num, label]) => (
          <div key={label} style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg,#FF6B9D,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: '0.4rem' }}>{num}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* POPULAR ROUTES */}
      <section id="routes" style={{ ...s.section, padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'sans-serif', fontSize: '0.75rem', color: 'var(--sakura)', letterSpacing: 3, display: 'block', marginBottom: '0.2rem' }}>人気のルート</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Tuyến Đường Phổ Biến</h2>
          </div>
          <a href="/search" onClick={e => { e.preventDefault(); navigate('/search') }} style={{ color: 'var(--sakura)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>Xem tất cả →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.2rem' }}>
          {POPULAR_ROUTES_STATIC.map((r, i) => (
            <RouteCard key={i} route={r} onClick={() => navigate(`/search?departure=${encodeURIComponent(r.fromVal)}&destination=${encodeURIComponent(r.toVal)}&date=${new Date().toISOString().split('T')[0]}`)} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ ...s.section, background: 'rgba(255,107,157,0.04)', borderTop: '1px solid rgba(255,107,157,0.12)', borderBottom: '1px solid rgba(255,107,157,0.12)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'sans-serif', fontSize: '0.8rem', color: 'var(--sakura)', letterSpacing: 4, marginBottom: '0.5rem' }}>なぜ私たちを選ぶの？</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Tại Sao Chọn MiYuki?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem', marginTop: '2.5rem' }}>
            {[
              { icon: '💳', color: 'rgba(255,107,157,0.2)', title: 'Thanh toán an toàn', desc: 'Hỗ trợ MoMo, ZaloPay, VNPay, thẻ ngân hàng và hơn 10 phương thức thanh toán' },
              { icon: '🔔', color: 'rgba(123,47,190,0.2)', title: 'Thông báo thời gian thực', desc: 'Nhận SMS & app notification tức thì khi xe sắp đến điểm đón của bạn' },
              { icon: '💰', color: 'rgba(255,215,0,0.15)', title: 'Giá tốt nhất', desc: 'Cam kết giá vé thấp nhất. Hoàn tiền 100% nếu bạn tìm được giá rẻ hơn' },
              { icon: '🎯', color: 'rgba(0,230,200,0.15)', title: 'Chọn ghế trực quan', desc: 'Xem sơ đồ chỗ ngồi và chọn ghế yêu thích ngay trên ứng dụng dễ dàng' },
            ].map(f => (
              <div key={f.title} style={{ textAlign: 'center', padding: '2rem 1.2rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,107,157,0.15)', borderRadius: 20, transition: 'transform 0.25s' }}>
                <div style={{ width: 60, height: 60, margin: '0 auto 1rem', borderRadius: 16, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ ...s.section, padding: '4rem 2rem', background: 'rgba(13,27,42,0.6)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'sans-serif', fontSize: '0.8rem', color: 'var(--sakura)', letterSpacing: 4, marginBottom: '0.5rem' }}>お客様の声</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Khách Hàng Nói Gì? ✨</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginTop: '2.5rem' }}>
            {[
              { stars: '⭐⭐⭐⭐⭐', text: '"App đặt vé cực kỳ mượt mà và đẹp, giao diện kawaii lắm! Tôi đặt được vé Hà Nội – Đà Nẵng chỉ mất 2 phút, giá còn rẻ hơn mua trực tiếp bến xe."', avatar: '🌸', bg: 'rgba(255,107,157,0.2)', name: 'Nguyễn Thị Lan Anh', route: 'Hà Nội → Đà Nẵng' },
              { stars: '⭐⭐⭐⭐⭐', text: '"Từ khi dùng MiYuki, tôi không phải xếp hàng ở bến xe nữa. Đặt vé online, lên xe là xong. Giường nằm limousine rất thoải mái!"', avatar: '🌙', bg: 'rgba(123,47,190,0.2)', name: 'Trần Minh Quân', route: 'TP.HCM → Đà Lạt' },
              { stars: '⭐⭐⭐⭐⭐', text: '"Hoàn tiền nhanh chóng khi tôi cần đổi lịch. Chăm sóc khách hàng nhiệt tình 24/7. Sẽ tiếp tục sử dụng và giới thiệu cho bạn bè!"', avatar: '⭐', bg: 'rgba(255,215,0,0.15)', name: 'Phạm Thu Hương', route: 'TP.HCM → Cần Thơ' },
            ].map(t => (
              <div key={t.name} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: 20, padding: '1.5rem' }}>
                <div style={{ color: 'var(--star)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>{t.stars}</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.2rem', fontStyle: 'italic' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--sakura)', fontWeight: 600 }}>{t.route}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP SECTION */}
      <section id="about" style={{ ...s.section, padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'sans-serif', fontSize: '0.8rem', color: 'var(--sakura)', letterSpacing: 4, marginBottom: '0.5rem' }}>アプリをダウンロード</div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '1rem' }}>📱 Tải App MiYuki<br />Đặt vé nhanh hơn!</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>Quản lý tất cả vé xe, xem trực tiếp vị trí xe trên bản đồ, và nhận ưu đãi độc quyền chỉ có trên app. Hoàn toàn miễn phí!</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[['🍎', 'Tải về trên', 'App Store'], ['🤖', 'Tải về trên', 'Google Play']].map(([icon, small, strong]) => (
              <div key={strong} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,107,157,0.25)', borderRadius: 14, padding: '0.75rem 1.2rem', cursor: 'pointer' }}>
                <span style={{ fontSize: '1.6rem' }}>{icon}</span>
                <div><small style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{small}</small><strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text)' }}>{strong}</strong></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}

// --- Sub-components ---
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sakura-light)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</label>
      {React.cloneElement(children, {
        style: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,107,157,0.25)', color: 'var(--text)', padding: '0.75rem 1rem', borderRadius: 12, fontSize: '0.95rem', fontFamily: 'Nunito,sans-serif', outline: 'none', appearance: 'none', WebkitAppearance: 'none', width: '100%' }
      })}
    </div>
  )
}

function RouteCard({ route, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const badgeStyle = {
    hot: { background: 'rgba(255,107,157,0.2)', color: 'var(--sakura)', border: '1px solid rgba(255,107,157,0.4)' },
    sale: { background: 'rgba(255,215,0,0.15)', color: 'var(--star)', border: '1px solid rgba(255,215,0,0.3)' },
    new: { background: 'rgba(123,47,190,0.2)', color: 'var(--violet-light)', border: '1px solid rgba(192,132,252,0.4)' },
  }[route.badgeClass]

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: 'var(--card-bg)', border: `1px solid ${hovered ? 'var(--sakura)' : 'var(--card-border)'}`, borderRadius: 20, padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.25s, box-shadow 0.25s', transform: hovered ? 'translateY(-6px)' : 'none', boxShadow: hovered ? '0 16px 40px rgba(255,107,157,0.2)' : 'none', position: 'relative', overflow: 'hidden' }}>
      <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.7rem', borderRadius: 50, letterSpacing: '0.3px', ...badgeStyle }}>{route.badge}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.8rem' }}>
        <span style={{ fontSize: '1.15rem', fontWeight: 900 }}>{route.from}</span>
        <span style={{ color: 'var(--sakura)', fontSize: '1.1rem' }}>→</span>
        <span style={{ fontSize: '1.15rem', fontWeight: 900 }}>{route.to}</span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {[`⏱ ${route.time}`, `📏 ${route.km}`, `🚌 ${route.trips}`].map(m => (
          <span key={m} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m}</span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Từ</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, background: 'linear-gradient(90deg,#FF6B9D,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{route.price}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setClicked(true); setTimeout(() => { setClicked(false); onClick() }, 600) }}
          style={{ background: 'rgba(255,107,157,0.12)', border: '1px solid rgba(255,107,157,0.35)', color: 'var(--sakura)', padding: '0.35rem 1rem', borderRadius: 50, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', transition: 'background 0.2s' }}>
          {clicked ? '✅ Đã chọn!' : 'Đặt vé'}
        </button>
      </div>
    </div>
  )
}

function PhoneMockup() {
  return (
    <svg width="260" viewBox="0 0 260 520" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="230" height="500" rx="36" fill="#1E1E3A" stroke="rgba(255,107,157,0.5)" strokeWidth="2"/>
      <rect x="22" y="18" width="216" height="484" rx="30" fill="#0D1B2A"/>
      <rect x="90" y="20" width="80" height="20" rx="10" fill="#1E1E3A"/>
      <rect x="28" y="50" width="204" height="440" rx="24" fill="#1A1A3E"/>
      <rect x="28" y="50" width="204" height="60" fill="rgba(255,107,157,0.2)"/>
      <text x="130" y="72" textAnchor="middle" fontSize="11" fontWeight="700" fill="white" fontFamily="Nunito,sans-serif">🌸 MiYuki Express</text>
      <text x="130" y="90" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)" fontFamily="Nunito,sans-serif">Xin chào, Lan Anh! ✨</text>
      <rect x="40" y="122" width="180" height="30" rx="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,107,157,0.3)" strokeWidth="1"/>
      <text x="84" y="141" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="Nunito,sans-serif">🔍  Tìm chuyến đi...</text>
      <rect x="36" y="164" width="188" height="80" rx="12" fill="rgba(255,107,157,0.15)" stroke="rgba(255,107,157,0.3)" strokeWidth="1"/>
      <text x="46" y="180" fontSize="7.5" fontWeight="700" fill="rgba(255,107,157,0.9)" fontFamily="Nunito,sans-serif">🎫 CHUYẾN ĐI SẮP TỚI</text>
      <text x="46" y="196" fontSize="11" fontWeight="900" fill="white" fontFamily="Nunito,sans-serif">HN → ĐÀ NẴNG</text>
      <text x="46" y="210" fontSize="8" fill="rgba(255,255,255,0.7)" fontFamily="Nunito,sans-serif">20/06/2026 • 22:00 • Giường VIP</text>
      <rect x="165" y="218" width="50" height="18" rx="9" fill="rgba(255,107,157,0.3)"/>
      <text x="190" y="230" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#FFB3CC" fontFamily="Nunito,sans-serif">Xem vé</text>
      <rect x="28" y="448" width="204" height="44" fill="rgba(13,27,42,0.95)"/>
      <text x="67" y="474" textAnchor="middle" fontSize="16" fontFamily="Nunito,sans-serif">🏠</text>
      <text x="108" y="474" textAnchor="middle" fontSize="16" fontFamily="Nunito,sans-serif">🎫</text>
      <text x="149" y="474" textAnchor="middle" fontSize="16" fontFamily="Nunito,sans-serif">📍</text>
      <text x="190" y="474" textAnchor="middle" fontSize="16" fontFamily="Nunito,sans-serif">👤</text>
      <circle cx="67" cy="480" r="2.5" fill="#FF6B9D"/>
      <rect x="90" y="500" width="80" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
    </svg>
  )
}

function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 10, background: 'rgba(13,27,42,0.98)', borderTop: '1px solid rgba(255,107,157,0.15)', padding: '3rem 2rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌸</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--sakura)', letterSpacing: 2 }}>みゆき エクスプレス</div>
                <div style={{ color: 'white', fontWeight: 900 }}>MiYuki Express</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, margin: '0.8rem 0 1.2rem', maxWidth: 240 }}>Nền tảng đặt vé xe khách hàng đầu Việt Nam. Kết nối 63 tỉnh thành với hơn 850 nhà xe đối tác uy tín.</p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📧 support@miyuki.vn &nbsp;&nbsp;📞 1900 8888</div>
          </div>
          {[
            ['Dịch vụ', ['Đặt vé xe khách','Xe limousine','Xe ghép','Thuê xe du lịch','Vé tháng']],
            ['Hỗ trợ', ['Câu hỏi thường gặp','Chính sách hoàn vé','Liên hệ chăm sóc','Báo cáo sự cố','Hướng dẫn sử dụng']],
            ['Công ty', ['Về MiYuki Express','Tuyển dụng','Đối tác nhà xe','Báo chí','Điều khoản & Bảo mật']],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h4>
              <ul style={{ listStyle: 'none' }}>
                {links.map(l => <li key={l} style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© 2026 MiYuki Express. Made with 🌸 tại Việt Nam</p>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {['f','📷','🐦','▶'].map(icon => (
              <a key={icon} href="#" style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,107,157,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>{icon}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

