import apiClient from './apiClient'

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  validateToken: (token) => apiClient.post('/auth/validate-token', null, {
    headers: { Authorization: `Bearer ${token}` }
  }),
}

export const tripService = {
  search: (params) => apiClient.get('/trips/search', { params }),
  getTripById: (id) => apiClient.get(`/trips/${id}`),
  getPopular: () => apiClient.get('/trips/popular'),
  getAllRoutes: () => apiClient.get('/trips/routes'),
  getSeatsByTrip: (tripId) => apiClient.get(`/seats/trip/${tripId}`),
}

export const bookingService = {
  createBooking: (data) => apiClient.post('/bookings', data),
  getBooking: (id) => apiClient.get(`/bookings/${id}`),
  getMyBookings: () => apiClient.get('/bookings/my'),
  cancelBooking: (id) => apiClient.put(`/bookings/${id}/cancel`),
}

export const paymentService = {
  createPayment: (data) => apiClient.post('/payments', data),
  getPayment: (id) => apiClient.get(`/payments/${id}`),
  completePayment: (id) => apiClient.put(`/payments/${id}/complete`),
  refundPayment: (id, data) => apiClient.put(`/payments/${id}/refund`, data),
}

export const userService = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  changePassword: (data) => apiClient.post('/users/change-password', data),
}

export const adminService = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: (page = 0, size = 10) => apiClient.get(`/admin/users?page=${page}&size=${size}`),
  updateUserStatus: (id, status) => apiClient.put(`/admin/users/${id}/status`, { status }),
  getTrips: (page = 0, size = 10) => apiClient.get(`/admin/trips?page=${page}&size=${size}`),
  updateTripStatus: (id, status) => apiClient.put(`/admin/trips/${id}/status`, { status }),
  createTrip: (data) => apiClient.post('/admin/trips', data),
  getBookings: (page = 0, size = 10) => apiClient.get(`/admin/bookings?page=${page}&size=${size}`),
  getBookingStats: () => apiClient.get('/admin/bookings/stats'),
  getRoutes: () => apiClient.get('/trips/routes'),
  getBuses: () => apiClient.get('/admin/buses'),
  getReviews: (page = 0, size = 10) => apiClient.get(`/admin/reviews?page=${page}&size=${size}`),
  getNotifications: (page = 0, size = 10) => apiClient.get(`/admin/notifications?page=${page}&size=${size}`),
  getRefunds: (page = 0, size = 10) => apiClient.get(`/admin/refunds?page=${page}&size=${size}`),
  updateRefundStatus: (id, status) => apiClient.put(`/admin/refunds/${id}/status`, { status }),
}
