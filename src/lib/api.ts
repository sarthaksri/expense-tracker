import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with credentials for cookie-based auth
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies with requests
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't redirect on 401 for /auth/me (session check)
        const isAuthMeRequest = error.config?.url === '/auth/me';
        if (error.response?.status === 401 && !isAuthMeRequest) {
            // Token expired or invalid - redirect to login
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: { name: string; email: string; password: string }) =>
        api.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),

    logout: () =>
        api.post('/auth/logout'),

    getMe: () =>
        api.get('/auth/me'),
};

// Expenses API
export const expensesAPI = {
    getAll: () =>
        api.get('/expenses'),

    create: (data: any) =>
        api.post('/expenses', data),

    update: (id: string, data: any) =>
        api.put(`/expenses/${id}`, data),

    delete: (id: string) =>
        api.delete(`/expenses/${id}`),
};

// Savings Goals API
export const savingsGoalsAPI = {
    getAll: () =>
        api.get('/savings-goals'),

    create: (data: any) =>
        api.post('/savings-goals', data),

    update: (id: string, data: any) =>
        api.put(`/savings-goals/${id}`, data),

    delete: (id: string) =>
        api.delete(`/savings-goals/${id}`),
};

// Monthly Data API
export const monthlyDataAPI = {
    getIncome: (month: string) =>
        api.get(`/monthly-data/income/${month}`),

    updateIncome: (month: string, data: any) =>
        api.put(`/monthly-data/income/${month}`, data),

    getRent: (month: string) =>
        api.get(`/monthly-data/rent/${month}`),

    updateRent: (month: string, data: any) =>
        api.put(`/monthly-data/rent/${month}`, data),
};

// Custom Categories API
export const categoriesAPI = {
    getAll: () =>
        api.get('/custom-categories'),

    create: (data: { name: string }) =>
        api.post('/custom-categories', data),
};

export default api;
