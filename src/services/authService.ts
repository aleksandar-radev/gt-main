import axios from 'axios'

const API_URL = 'https://your-api-url.com/api/auth/' // Replace with your actual API URL

class AuthService {
    async login(email: string, password: string) {
        const response = await axios.post(API_URL + 'login', {
            email,
            password,
        })

        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data))
        }

        return response.data
    }

    logout() {
        localStorage.removeItem('user')
    }

    async register(name: string, email: string, password: string) {
        return axios.post(API_URL + 'register', {
            name,
            email,
            password,
        })
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user')
        if (userStr) return JSON.parse(userStr)
        return null
    }

    isLoggedIn() {
        const user = this.getCurrentUser()
        return !!user && !!user.token
    }
}

export default new AuthService()
