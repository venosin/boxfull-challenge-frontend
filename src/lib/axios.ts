import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', // URL del Backend
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Solicitud: Agregar Token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Respuesta: Manejar Errores Globales (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                // Avoid redirect loop or reloading if already on auth pages
                if (currentPath !== '/login' && currentPath !== '/register') {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
