import axios from 'axios'
import authService from './authService'

// Request interceptor
axios.interceptors.request.use(
    (config: any) => {
        const user = authService.getCurrentUser()

        if (user && user.token) {
            config.headers['Authorization'] = 'Bearer ' + user.token
        }

        return config
    },
    (error: any) => Promise.reject(error),
)

// Response interceptor for handling token expiration
axios.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            authService.logout()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    },
)
