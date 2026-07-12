import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { paymentService } from '../services/api'
import apiClient from '../services/apiClient'

export default function PaymentPage() {
  const { transactionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const qrData = location.state?.qrData
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const baseUrl = apiClient.defaults.baseURL
  const qrImageUrl = `${baseUrl}/payments/vietqr/image/${transactionId}`

  const handleConfirmPayment = async () => {
    setLoading(true); setError('')
    try {
      await paymentService.markVietQRPaid(transactionId)
      setPaid(true)
      setTimeout(() => navigate('/my-bookings'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Xác nhận thất bại')
    } finally { setLoading(false) }
  }

  if (paid) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 24, padding: '3rem', textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.75rem' }}>Thanh toán thành công!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Đang chuyển hướng đến vé của bạn...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 10, padding: '5rem 1.5rem 3rem' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>Thanh toán qua VietQR</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Quét mã QR bên dưới bằng app ngân hàng để chuyển khoản
        </p>

        {qrData && (
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
            <img src={qrImageUrl} alt="VietQR" style={{ width: 280, height: 280, borderRadius: 12, margin: '0 auto 1rem', display: 'block' }} />
            <div style={{ fontSize: '0.9rem', lineHeight: 2 }}>
              <div><strong>Số tài khoản:</strong> <span style={{ color: 'var(--sakura)', fontWeight: 800 }}>{qrData.accountNumber}</span></div>
              <div><strong>Chủ tài khoản:</strong> {qrData.accountName}</div>
              <div><strong>Ngân hàng:</strong> BIDV</div>
              <div><strong>Số tiền:</strong> <span style={{ fontSize: '1.3rem', fontWeight: 900, background: 'linear-gradient(90deg,#FF6B9D,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {Number(qrData.amount).toLocaleString('vi-VN')}đ
              </span></div>
              <div><strong>Nội dung:</strong> <span style={{ fontFamily: 'monospace' }}>MIYUKI{transactionId.slice(0,8)}</span></div>
            </div>
          </div>
        )}

        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
          Sau khi chuyển khoản, bấm nút bên dưới để xác nhận
        </p>

        {error && (
          <div style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', padding: '0.6rem 0.8rem', borderRadius: 8, fontSize: '0.82rem', marginBottom: '1rem' }}>{error}</div>
        )}

        <button onClick={handleConfirmPayment} disabled={loading}
          style={{ background: loading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#FF6B9D,#7B2FBE)', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: 12, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito,sans-serif', opacity: loading ? 0.5 : 1, fontSize: '0.95rem', width: '100%' }}>
          {loading ? 'Đang xử lý...' : '✅ Đã chuyển khoản'}
        </button>

        <button onClick={() => navigate('/my-bookings')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '1rem', fontFamily: 'Nunito,sans-serif', fontSize: '0.85rem' }}>
          ← Quay lại vé của tôi
        </button>
      </div>
    </div>
  )
}
