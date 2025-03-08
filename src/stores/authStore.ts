import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../config/api';
import type { User } from '../types';

const API_URL = import.meta.env.VITE_GAME_URL;

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const loading = ref(false);
    const error = ref(null);

    // Initialize user from localStorage on store creation
    const initializeFromStorage = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user.value = JSON.parse(storedUser);
        }
    };

    initializeFromStorage();

    const login = async (email: string, password: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.post(`${API_URL}/user/login`, {
                email,
                password,
            });

            user.value = response.data;

            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Login failed';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        user.value = null;
        await api.post(`${API_URL}/user/logout`);
    };

    const register = async (username: string, email: string, password: string) => {
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
    };

    const getCurrentUser = async () => {
        try {
            const response = await api.get(`${API_URL}/user/session`);
            // Update user with latest data from server
            user.value = response.data.user;

            if (!user.value) {
                throw new Error('User not found');
            }

            return response.data;
        } catch (err) {
            console.error('Session validation failed:', err);
            await logout();
            return null;
        }
    };

    return {
        user,
        loading,
        error,
        login,
        logout,
        register,
        getCurrentUser,
    };
});
