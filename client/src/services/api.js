// API Service for GoDrive Car Rentals

const BASE_URL = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = (data && data.message) || response.statusText || 'Request failed';
        throw new Error(error);
    }
    return data;
};

export const api = {
    // Auth endpoints
    async login(email, password) {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await handleResponse(res);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    },

    async register(userData) {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await handleResponse(res);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    },

    async getProfile() {
        const res = await fetch(`${BASE_URL}/api/auth/profile`, {
            headers: getAuthHeaders()
        });
        return handleResponse(res);
    },

    async updateProfile(profileData) {
        const res = await fetch(`${BASE_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        const data = await handleResponse(res);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Cars endpoints
    async getCars(params = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value && value !== 'all') {
                query.append(key, value);
            }
        });
        const qs = query.toString() ? `?${query.toString()}` : '';
        const res = await fetch(`${BASE_URL}/api/cars${qs}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(res);
    },

    async getCarById(id) {
        const res = await fetch(`${BASE_URL}/api/cars/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(res);
    },

    async addCarReview(carId, reviewData) {
        const res = await fetch(`${BASE_URL}/api/cars/${carId}/reviews`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(reviewData)
        });
        return handleResponse(res);
    },

    // Bookings endpoints
    async createBooking(bookingData) {
        const res = await fetch(`${BASE_URL}/api/bookings`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(bookingData)
        });
        return handleResponse(res);
    },

    async getMyBookings() {
        const res = await fetch(`${BASE_URL}/api/bookings/my-bookings`, {
            headers: getAuthHeaders()
        });
        return handleResponse(res);
    },

    async cancelBooking(bookingId) {
        const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        return handleResponse(res);
    },

    // Offers endpoints
    async getOffers() {
        const res = await fetch(`${BASE_URL}/api/offers`, {
            headers: getAuthHeaders()
        });
        return handleResponse(res);
    },

    async validateOffer(code, amount) {
        const res = await fetch(`${BASE_URL}/api/offers/validate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ code, amount })
        });
        return handleResponse(res);
    },

    // Contact endpoint
    async submitContact(contactData) {
        const res = await fetch(`${BASE_URL}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        return handleResponse(res);
    }
};

export default api;
