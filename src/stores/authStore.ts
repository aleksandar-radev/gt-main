import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../config/api';
import type { User } from '../types';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_GAME_URL;

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Define all methods in a single object
    const methods = {
        login: async (email: string, password: string) => {
            loading.value = true;
            error.value = null;

            try {
                const response = await api.post(`${API_URL}/user/login`, {
                    email,
                    password,
                });

                console.log('Login response:', response.data);

                user.value = response.data;

                // Store user data in localStorage for persistence
                localStorage.setItem('user', JSON.stringify(user.value));

                if (response.data.token) {
                    Cookies.set('token', response.data.token, {
                        expires: 7,
                        secure: window.location.protocol === 'https:',
                        sameSite: 'strict',
                    });
                }

                return response.data;
            } catch (err: any) {
                error.value = err.response?.data?.message || 'Login failed';
                throw err;
            } finally {
                loading.value = false;
            }
        },

        logout: async () => {
            try {
                await api.post(`${API_URL}/user/logout`);
            } catch (err) {
                console.error('Logout error:', err);
                // Continue with frontend logout even if API request fails
            } finally {
                user.value = null;
                localStorage.removeItem('user');
                Cookies.remove('token');
            }
        },

        register: async (username: string, email: string, password: string) => {
            loading.value = true;
            error.value = null;

            try {
                const response = await api.post(`${API_URL}/user/register`, {
                    username,
                    email,
                    password,
                    confirmPassword: password,
                });
                return response.data;
            } catch (err: any) {
                error.value = err.response?.data?.message || 'Registration failed';
                throw err;
            } finally {
                loading.value = false;
            }
        },

        getCurrentUser: async () => {
            loading.value = true;

            try {
                const response = await api.get(`${API_URL}/user/session`);
                user.value = response.data.user;

                if (user.value) {
                    localStorage.setItem('user', JSON.stringify(user.value));
                } else {
                    throw new Error('User session invalid');
                }

                return response.data;
            } catch (err) {
                console.error('Session validation failed:', err);
                user.value = null;
                localStorage.removeItem('user');
                Cookies.remove('token');
                return null;
            } finally {
                loading.value = false;
            }
        },

        getUserById: async (userId: number) => {
            try {
                const response = await api.get(`${API_URL}/user/${userId}`);
                return response.data;
            } catch (err) {
                console.error(`Failed to get user with ID ${userId}:`, err);
                throw err;
            }
        },

        getAllUsers: async () => {
            try {
                const response = await api.get(`${API_URL}/user`);
                return response.data;
            } catch (err) {
                console.error('Failed to get all users:', err);
                throw err;
            }
        },

        isAuthenticated: () => {
            return !!user.value;
        },

        isAdmin: () => {
            return user.value?.role === 'admin';
        },

        initializeFromStorage: () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                user.value = JSON.parse(storedUser);
                // Verify the user's session is still valid
                methods.getCurrentUser().catch(() => {
                    // If session validation fails, getCurrentUser handles logout
                });
            }
        },
    };

    // Now we can safely call initializeFromStorage after all methods are defined
    methods.initializeFromStorage();

    // Return state and methods
    return {
        user,
        loading,
        error,
        ...methods,
    };
});
