import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Bot, CalendarDays, Check, Clock, MapPin, Menu, Navigation, Phone, Search, ShieldCheck, Sparkles, Star, Ticket, Users, X } from 'lucide-react';
import './styles.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

function currency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0));
}

function minutesToText(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function timeText(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(new Date(value));
}

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

function getSeatList(busType) {
  let count = 24;
  if (busType.includes('34')) count = 34;
  else if (busType.includes('22')) count = 22;
  else if (busType.includes('18')) count = 18;
  else if (busType.includes('9')) count = 9;
  else if (busType.includes('24')) count = 24;

  const seats = [];
  for (let i = 1; i <= count; i++) {
    const code = i <= count / 2 ? `A${String(i).padStart(2, '0')}` : `B${String(i - count / 2).padStart(2, '0')}`;
    seats.push(code);
  }
  return seats;
}

async function api(path, options) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API error' }));
    throw new Error(error.message || 'API error');
  }
  return response.json();
}

function App() {
  const [cities, setCities] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [query, setQuery] = useState({
    origin: 'Hồ Chí Minh',
    destination: 'Đà Nẵng',
    date: todayInput(),
    passengers: 1
  });

  // Ticket Lookup States
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResults, setLookupResults] = useState([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // AI Chat States
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Xin chào! Tôi là trợ lý ảo VietRide AI. Tôi có thể giúp tìm vé xe, thông tin lịch trình, giá vé và tư vấn chính sách cho bạn. Bạn cần đi đâu?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api('/cities'),
      api('/routes/popular'),
      api('/dashboard'),
      api(`/trips/search?origin=${encodeURIComponent(query.origin)}&destination=${encodeURIComponent(query.destination)}&date=${query.date}`)
    ])
      .then(([cityData, routeData, dashboardData, tripData]) => {
        setCities(cityData);
        setRoutes(routeData);
        setDashboard(dashboardData);
        setTrips(tripData);
      })
      .catch((err) => setError(err.message));
  }, []);

  const cityOptions = useMemo(() => cities.map((city) => city.name), [cities]);

  async function searchTrips(event) {
    if (event) event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        origin: query.origin,
        destination: query.destination,
        date: query.date
      });
      const data = await api(`/trips/search?${params}`);
      setTrips(data);
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fillRoute(route) {
    setQuery((current) => ({ ...current, origin: route.origin, destination: route.destination }));
    // Wait a brief moment to update state before searching
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  async function handleLookup(e) {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setLookupLoading(true);
    setLookupError('');
    try {
      const data = await api(`/bookings/lookup?query=${encodeURIComponent(lookupQuery.trim())}`);
      setLookupResults(data);
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSendChat(e) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await api('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg })
      });
      setChatMessages((prev) => [...prev, { role: 'assistant', text: res.reply }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Hệ thống AI đang bận, vui lòng thử lại sau.' }]);
    } finally {
      setChatLoading(false);
    }
  }

  // Auto scroll chat log
  useEffect(() => {
    const log = document.getElementById('chat-log');
    if (log) log.scrollTop = log.scrollHeight;
  }, [chatMessages, chatLoading, aiOpen]);

  return (
    <div className="app">
      <nav className="nav">
        <a className="logo" href="#hero">VietRide<span>X</span></a>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mo menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#booking" onClick={() => setMenuOpen(false)}>Đặt vé</a>
          <a href="#lookup" onClick={() => setMenuOpen(false)}>Tra cứu vé</a>
          <a href="#routes" onClick={() => setMenuOpen(false)}>Tuyến hot</a>
          <a href="#dashboard" onClick={() => setMenuOpen(false)}>Hệ thống</a>
          <a href="#reviews" onClick={() => setMenuOpen(false)}>Đánh giá</a>
        </div>
        <a className="nav-action" href="#booking">Tìm chuyến</a>
      </nav>

      <main>
        <section id="hero" className="hero">
          <div className="grid-floor" />
          <div className="city-bg" />
          <div className="hero-glow left" />
          <div className="hero-glow right" />
          <div className="hero-content">
            <div className="eyebrow"><Sparkles size={15} /> AI TRANSIT NETWORK</div>
            <h1>Future of <span>Bus Travel</span></h1>
            <p>Đặt vé xe khách thông minh, chọn ghế trực quan, thanh toán VietQR tự động và hỗ trợ trợ lý AI 24/7.</p>
            <div className="hero-actions">
              <a className="primary-btn" href="#booking"><Ticket size={18} /> Đặt vé ngay</a>
              <a className="secondary-btn" href="#routes"><Navigation size={18} /> Xem tuyến hot</a>
            </div>
          </div>
          <div className="stats-strip">
            <Stat value="500K+" label="Hành khách" />
            <Stat value="120+" label="Tuyến xe" />
            <Stat value="99.2%" label="Hài lòng" />
            <Stat value="24/7" label="Hỗ trợ AI" />
          </div>
        </section>

        <section id="booking" className="booking-section">
          <form className="booking-panel" onSubmit={searchTrips}>
            <div className="panel-title"><ShieldCheck size={18} /> Tìm chuyến xe</div>
            <div className="booking-grid">
              <Field label="Điểm đi">
                <select value={query.origin} onChange={(e) => setQuery({ ...query, origin: e.target.value })}>
                  {cityOptions.map((city) => <option key={city}>{city}</option>)}
                </select>
              </Field>
              <Field label="Điểm đến">
                <select value={query.destination} onChange={(e) => setQuery({ ...query, destination: e.target.value })}>
                  {cityOptions.map((city) => <option key={city}>{city}</option>)}
                </select>
              </Field>
              <Field label="Ngày đi">
                <input type="date" value={query.date} onChange={(e) => setQuery({ ...query, date: e.target.value })} />
              </Field>
              <Field label="Số khách">
                <input min="1" max="8" type="number" value={query.passengers} onChange={(e) => setQuery({ ...query, passengers: Number(e.target.value) })} />
              </Field>
              <button className="search-btn" disabled={loading}>
                <Search size={18} /> {loading ? 'Đang tìm...' : 'Tìm vé'}
              </button>
            </div>
            <div className="ai-suggest"><span /> AI gợi ý: Đặt sớm 2-3 ngày trên các tuyến đi Đà Lạt, Đà Nẵng để chọn được vị trí giường tầng dưới (A01 - A06) tốt nhất.</div>
            {error && <div className="error">{error}</div>}
          </form>
        </section>

        <section id="results" className="results section-pad">
          <SectionTitle label="LIVE INVENTORY" title="Chuyến xe phù hợp" accent="hôm nay" />
          <div className="trip-list">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} passengers={query.passengers} onBook={() => setSelectedTrip(trip)} />
            ))}
            {!trips.length && <div className="empty">Không có chuyến xe phù hợp vào ngày này. Hãy thử chọn các điểm đi/đến khác hoặc thay đổi ngày.</div>}
          </div>
        </section>

        <section id="lookup" className="section-pad">
          <SectionTitle label="TICKET LOOKUP" title="Tra cứu" accent="vé xe" />
          <form className="booking-panel" onSubmit={handleLookup}>
            <div className="panel-title"><Ticket size={18} /> Tra cứu thông tin vé</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                style={{ flex: 1, minWidth: '240px', height: '46px', padding: '0 14px', background: 'rgba(0, 245, 255, 0.04)', color: 'white', border: '1px solid rgba(0, 245, 255, 0.24)', outline: 'none' }}
                placeholder="Nhập số điện thoại hoặc mã đặt vé (ví dụ: VRX-XXXXX)"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
              />
              <button type="submit" className="primary-btn" disabled={lookupLoading}>Tìm kiếm</button>
            </div>
            {lookupError && <div className="error">{lookupError}</div>}
            {lookupResults.length > 0 && (
              <div className="trip-list" style={{ marginTop: '24px' }}>
                {lookupResults.map((b) => (
                  <article className="trip-card" key={b.id} style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                    <div>
                      <h3 style={{ fontFamily: 'Orbitron', fontSize: '18px', color: 'var(--cyan)' }}>Mã vé: {b.bookingCode}</h3>
                      <p style={{ margin: '8px 0', fontSize: '15px' }}>
                        Khách hàng: <b>{b.passengerName}</b> | SĐT: {b.passengerPhone}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '15px' }}>
                        Tuyến: <b>{b.trip.origin} {'→'} {b.trip.destination}</b>
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '15px' }}>
                        Số ghế: <span style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>{b.seats || b.seatCount + ' ghế'}</span>
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px', color: 'var(--muted)' }}>
                        Khởi hành: {timeText(b.trip.departureTime)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <span className={`badge-status ${b.status === 'PAID' ? 'paid' : 'pending'}`}>
                          {b.status === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}
                        </span>
                        <b style={{ display: 'block', fontSize: '20px', color: 'var(--cyan)', marginTop: '10px' }}>{currency(b.totalPrice)}</b>
                      </div>
                      {b.status !== 'PAID' && (
                        <button
                          type="button"
                          className="primary-btn"
                          style={{ minHeight: '36px', height: '36px', padding: '0 16px', fontSize: '11px', marginTop: '10px' }}
                          onClick={() => {
                            setPaymentBooking(b);
                          }}
                        >
                          Thanh toán ngay
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
            {lookupResults.length === 0 && lookupQuery && !lookupLoading && (
              <div className="empty" style={{ marginTop: '24px' }}>Không tìm thấy lịch sử đặt vé phù hợp.</div>
            )}
          </form>
        </section>

        <section id="routes" className="section-pad">
          <SectionTitle label="HOT ROUTES" title="Tuyến phổ biến" accent="Việt Nam" />
          <div className="routes-grid">
            {routes.map((route) => (
              <button className="route-card" key={route.id} onClick={() => fillRoute(route)}>
                <div className="badge">{route.badge}</div>
                <div className="route-line"><b>{route.origin}</b><span /> <b>{route.destination}</b></div>
                <div className="route-meta">
                  <small>{minutesToText(route.durationMinutes)}</small>
                  <small>Từ {currency(route.minPrice)}</small>
                  <small>{route.availableSeats} ghế</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="dashboard" className="section-pad dashboard">
          <SectionTitle label="LIVE ANALYTICS" title="Hệ thống" accent="VietRide X" />
          <div className="dashboard-grid">
            <Metric icon={<Ticket />} value={dashboard?.ticketsToday ?? 0} label="Vé hôm nay" />
            <Metric icon={<Navigation />} value={dashboard?.activeBuses ?? 0} label="Xe đang chạy" />
            <Metric icon={<Users />} value={dashboard?.onlineUsers ?? 0} label="Online" />
            <Metric icon={<Bot />} value={dashboard?.aiRecommendations ?? 0} label="Trợ lý AI" />
            <Metric icon={<Star />} value={`${dashboard?.satisfaction ?? 0}%`} label="Hài lòng" />
          </div>
        </section>

        <section id="reviews" className="section-pad reviews">
          <SectionTitle label="USER REVIEWS" title="Khách hàng" accent="nói gì" />
          <div className="review-grid">
            {[
              ['TH', 'Trần Hương', 'Đặt vé từ HCM đi Đà Lạt chỉ mất 1 phút. Sơ đồ ghế chọn rất rõ ràng, giả lập quét VietQR nhận vé lập tức.'],
              ['NL', 'Nguyễn Long', 'Trợ lý AI hỗ trợ siêu đỉnh! Hỏi lịch trình sapa trả lời rất nhanh và chính xác lịch đi.'],
              ['PM', 'Phạm Minh', 'Tiện ích tra cứu vé bằng SĐT rất tiện lợi, lấy lại thông tin mã vé điện tử nhanh chóng khi cần lên xe.']
            ].map(([avatar, name, text]) => (
              <div className="review-card" key={name}>
                <div className="quote">"</div>
                <p>{text}</p>
                <div className="author"><span>{avatar}</span><b>{name}</b></div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div>
          <a className="logo" href="#hero">VietRide<span>X</span></a>
          <p>Nền tảng đặt vé xe khách thông minh tích hợp Spring Boot, React, MySQL và Trợ lý ảo AI.</p>
        </div>
        <div className="status"><span /> All systems operational</div>
      </footer>

      {/* Floating Chatbot UI */}
      <div className="ai-float">
        <AIChatbot open={aiOpen} onClose={() => setAiOpen(false)} messages={chatMessages} setMessages={setChatMessages} input={chatInput} setInput={setChatInput} loading={chatLoading} setLoading={setChatLoading} handleSend={handleSendChat} />
        <button className="ai-button" onClick={() => setAiOpen(!aiOpen)} aria-label="AI assistant"><Bot size={24} /></button>
      </div>

      {selectedTrip && (
        <BookingModal
          trip={selectedTrip}
          passengers={query.passengers}
          onClose={() => setSelectedTrip(null)}
          onBookCreated={(created) => {
            setSelectedTrip(null);
            setPaymentBooking(created);
            // Sync trips list
            setTrips((items) => items.map((item) => item.id === created.trip.id ? created.trip : item));
          }}
        />
      )}

      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          onClose={() => setPaymentBooking(null)}
          onPaid={(paidBooking) => {
            setPaymentBooking(null);
            setBooking(paidBooking);
            // Refresh lookup list if active
            if (lookupQuery) {
              api(`/bookings/lookup?query=${encodeURIComponent(lookupQuery.trim())}`).then(setLookupResults).catch(() => {});
            }
          }}
        />
      )}

      {booking && <SuccessModal booking={booking} onClose={() => setBooking(null)} />}
    </div>
  );
}

function Stat({ value, label }) {
  return <div className="stat"><b>{value}</b><span>{label}</span></div>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function SectionTitle({ label, title, accent }) {
  return (
    <div className="section-title">
      <div>{label}</div>
      <h2>{title} <span>{accent}</span></h2>
    </div>
  );
}

function TripCard({ trip, passengers, onBook }) {
  return (
    <article className="trip-card">
      <div className="trip-main">
        <div className="badge">{trip.badge}</div>
        <h3>{trip.origin} <span /> {trip.destination}</h3>
        <p><MapPin size={16} /> {trip.operatorName} - {trip.busType} - {trip.operatorRating} sao</p>
      </div>
      <div className="trip-info">
        <div><Clock size={16} /><b>{timeText(trip.departureTime)}</b><small>Khởi hành</small></div>
        <div><CalendarDays size={16} /><b>{minutesToText(trip.durationMinutes)}</b><small>Thời gian</small></div>
        <div><Users size={16} /><b>{trip.availableSeats}</b><small>Ghế trống</small></div>
      </div>
      <div className="trip-price">
        <small>Giá từ</small>
        <b>{currency(trip.price)}</b>
        <span>{passengers} khách: {currency(Number(trip.price) * passengers)}</span>
        <button onClick={onBook} disabled={trip.availableSeats < passengers}>Đặt vé</button>
      </div>
    </article>
  );
}

function Metric({ icon, value, label }) {
  return <div className="metric"><span>{icon}</span><b>{value}</b><small>{label}</small><i /></div>;
}

function BookingModal({ trip, passengers, onClose, onBookCreated }) {
  const [form, setForm] = useState({ passengerName: '', passengerPhone: '', passengerEmail: '' });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const seatList = useMemo(() => getSeatList(trip.busType), [trip]);
  const bookedSeatList = useMemo(() => {
    // Generate deterministic already-booked seats based on trip.bookedSeats
    return seatList.slice(0, Math.min(trip.bookedSeats, seatList.length));
  }, [trip, seatList]);

  function toggleSeat(seat) {
    if (bookedSeatList.includes(seat)) return;
    setSelectedSeats((curr) => {
      if (curr.includes(seat)) {
        return curr.filter((s) => s !== seat);
      } else {
        if (curr.length >= 8) {
          setError('Chỉ đặt tối đa 8 ghế một lần.');
          return curr;
        }
        setError('');
        return [...curr, seat];
      }
    });
  }

  async function submit(event) {
    event.preventDefault();
    if (selectedSeats.length === 0) {
      setError('Vui lòng chọn ít nhất 1 vị trí ghế.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const created = await api('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          tripId: trip.id,
          seatCount: selectedSeats.length,
          seats: selectedSeats.join(', ')
        })
      });
      onBookCreated(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="modal booking-modal-wide" onSubmit={submit}>
        <button type="button" className="close" onClick={onClose}><X size={18} /></button>
        <div className="panel-title"><Ticket size={18} /> Chọn ghế & Đặt vé</div>
        <p className="modal-route">{trip.origin} {'→'} {trip.destination} ({trip.busType})</p>
        
        <div className="booking-modal-grid">
          <div className="info-form">
            <Field label="Họ tên hành khách"><input required value={form.passengerName} onChange={(e) => setForm({ ...form, passengerName: e.target.value })} /></Field>
            <Field label="Số điện thoại"><input required value={form.passengerPhone} onChange={(e) => setForm({ ...form, passengerPhone: e.target.value })} /></Field>
            <Field label="Email liên hệ"><input type="email" value={form.passengerEmail} onChange={(e) => setForm({ ...form, passengerEmail: e.target.value })} /></Field>
            
            <div className="seat-summary">
              <div>Ghế đã chọn: <b style={{ color: 'var(--cyan)' }}>{selectedSeats.join(', ') || 'Chưa chọn'}</b></div>
              <div>Số lượng: <b>{selectedSeats.length}</b></div>
            </div>
            
            <div className="total">Tổng tiền: <b style={{ color: 'var(--cyan)' }}>{currency(Number(trip.price) * selectedSeats.length)}</b></div>
            {error && <div className="error">{error}</div>}
            <button className="primary-btn full" disabled={saving || selectedSeats.length === 0}>
              {saving ? 'Đang khởi tạo đặt vé...' : 'Tiến hành Thanh Toán'}
            </button>
          </div>

          <div className="seat-map-container">
            <div className="seat-map-header">Sơ đồ ghế ({trip.busType})</div>
            <div className="seat-legend">
              <span className="legend-item"><span className="seat-box available" style={{ width: '12px', height: '12px' }}></span>Trống</span>
              <span className="legend-item"><span className="seat-box selected" style={{ width: '12px', height: '12px' }}></span>Chọn</span>
              <span className="legend-item"><span className="seat-box booked" style={{ width: '12px', height: '12px' }}></span>Hết</span>
            </div>
            <div className="bus-layout">
              <div className="steering-wheel">🎡 Tài xế</div>
              <div className="seats-grid">
                {seatList.map((seat) => {
                  const isBooked = bookedSeatList.includes(seat);
                  const isSelected = selectedSeats.includes(seat);
                  let seatClass = "seat-box available";
                  if (isBooked) seatClass = "seat-box booked";
                  else if (isSelected) seatClass = "seat-box selected";

                  return (
                    <button
                      key={seat}
                      type="button"
                      className={seatClass}
                      disabled={isBooked}
                      onClick={() => toggleSeat(seat)}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function PaymentModal({ booking, onClose, onPaid }) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins countdown

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  async function handlePay() {
    setPaying(true);
    setError('');
    try {
      const updated = await api(`/bookings/${booking.id}/pay`, { method: 'POST' });
      onPaid(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  }

  // VietQR static simulation URL (MB Bank code 970422)
  const qrUrl = `https://img.vietqr.io/image/MB-123456789-qr_only.png?amount=${booking.totalPrice}&addInfo=VietRideX%20${booking.bookingCode}`;

  return (
    <div className="modal-backdrop">
      <div className="modal payment-modal">
        <button type="button" className="close" onClick={onClose}><X size={18} /></button>
        <div className="panel-title"><ShieldCheck size={18} /> Cổng thanh toán quét mã VietQR</div>
        <p className="modal-route">Mã đặt vé: <b>{booking.bookingCode}</b></p>
        
        <div className="payment-grid">
          <div className="qr-container">
            {timeLeft > 0 ? (
              <img src={qrUrl} alt="VietQR code" className="qr-image" />
            ) : (
              <div className="qr-expired">Mã QR hết hạn</div>
            )}
            <div className="timer">
              Mã giao dịch hết hiệu lực sau: <b style={{ color: 'var(--magenta)' }}>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</b>
            </div>
          </div>
          
          <div className="payment-info">
            <div className="pay-row"><span>Hành trình:</span><b>{booking.trip.origin} {'→'} {booking.trip.destination}</b></div>
            <div className="pay-row"><span>Khởi hành:</span><b>{timeText(booking.trip.departureTime)}</b></div>
            <div className="pay-row"><span>Vị trí ghế:</span><b>{booking.seats}</b></div>
            <div className="pay-row"><span>Tổng số tiền:</span><b style={{ color: 'var(--cyan)', fontSize: '20px' }}>{currency(booking.totalPrice)}</b></div>
            
            <div className="bank-details">
              <div>Ngân hàng: <b>MB Bank (NHTMCP Quân Đội)</b></div>
              <div>Số tài khoản: <b>123456789</b></div>
              <div>Tên người nhận: <b>VIETRIDE X TRANSIT</b></div>
              <div>Nội dung ck: <b style={{ color: 'var(--magenta)' }}>VietRideX {booking.bookingCode}</b></div>
            </div>
            
            {error && <div className="error">{error}</div>}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="button" className="secondary-btn" style={{ flex: 1 }} onClick={onClose}>Hủy bỏ</button>
              <button type="button" className="primary-btn" style={{ flex: 1.5 }} onClick={handlePay} disabled={paying || timeLeft <= 0}>
                {paying ? 'Đang đối soát...' : 'Giả lập đã thanh toán'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ booking, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal success">
        <button type="button" className="close" onClick={onClose}><X size={18} /></button>
        <Check size={44} />
        <h2>Đặt Vé Thành Công!</h2>
        <p>Mã vé điện tử của bạn là: <b style={{ color: 'var(--cyan)', fontSize: '20px' }}>{booking.bookingCode}</b></p>
        <div style={{ border: '1px solid var(--border)', background: 'rgba(0, 245, 255, 0.02)', padding: '16px', margin: '20px 0', textAlign: 'left', borderRadius: '4px' }}>
          <p style={{ margin: '4px 0' }}>Tuyến xe: <b>{booking.trip.origin} {'→'} {booking.trip.destination}</b></p>
          <p style={{ margin: '4px 0' }}>Nhà xe: <b>{booking.trip.operatorName} ({booking.trip.busType})</b></p>
          <p style={{ margin: '4px 0' }}>Khởi hành: <b>{timeText(booking.trip.departureTime)}</b></p>
          <p style={{ margin: '4px 0' }}>Số ghế đặt: <b style={{ color: 'var(--magenta)' }}>{booking.seats}</b> ({booking.seatCount} ghế)</p>
          <p style={{ margin: '4px 0' }}>Tổng số tiền: <b>{currency(booking.totalPrice)}</b></p>
          <p style={{ margin: '4px 0' }}>Trạng thái: <span className="badge-status paid">ĐÃ THANH TOÁN</span></p>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Vé điện tử đã được gửi về số điện thoại và email của bạn. Quý khách vui lòng có mặt trước giờ xuất bến 15 phút để làm thủ tục lên xe.</p>
      </div>
    </div>
  );
}

function AIChatbot({ open, onClose, messages, setMessages, input, setInput, loading, setLoading, handleSend }) {
  if (!open) return null;

  return (
    <div className="ai-popup chat-window">
      <div className="chat-header">
        <span>Trợ lý ảo VietRide AI</span>
        <button className="close-chat" onClick={onClose}><X size={16} /></button>
      </div>
      <div id="chat-log" className="chat-log">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-message ${m.role}`}>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="bubble loading-dots">AI đang trả lời<span>.</span><span>.</span><span>.</span></div>
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi về giá vé, tuyến xe, lịch trình, chính sách..."
          disabled={loading}
        />
        <button type="submit" className="send-btn" disabled={loading || !input.trim()}>Gửi</button>
      </form>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
