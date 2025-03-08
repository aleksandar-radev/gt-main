<template>
    <AuthForm>
        <h2 class="auth-title">Login</h2>
        <form class="auth-form" @submit.prevent="login">
            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="email" type="email" required />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" v-model="password" type="password" required />
            </div>
            <div v-if="error" class="error">{{ error }}</div>
            <button type="submit" :disabled="loading" class="auth-button">
                {{ loading ? 'Logging in...' : 'Login' }}
            </button>
            <p class="auth-redirect">
                Don't have an account?
                <router-link to="/register" class="auth-link">Register</router-link>
            </p>
        </form>
    </AuthForm>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import AuthForm from './AuthForm.vue';
    import { useAuthStore } from '@/stores/authStore';

    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');
    const router = useRouter();
    const authStore = useAuthStore();

    const login = async () => {
        try {
            loading.value = true;
            error.value = '';
            await authStore.login(email.value, password.value);

            router.push('/');
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to login';
        } finally {
            loading.value = false;
        }
    };
</script>

<style scoped>
    .auth-title {
        color: white;
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.8rem;
        font-weight: 600;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-group {
        margin-bottom: 0.5rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #e0e0e0;
    }

    .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #555;
        border-radius: 4px;
        background-color: #333;
        color: white;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    .form-group input:focus {
        outline: none;
        border-color: #4d90fe;
        box-shadow: 0 0 0 2px rgba(77, 144, 254, 0.2);
    }

    .error {
        color: #ff6b6b;
        margin: 0.5rem 0;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .auth-button {
        width: 100%;
        padding: 0.75rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background 0.2s;
        margin-top: 0.5rem;
    }

    .auth-button:hover:not(:disabled) {
        background: #2980b9;
    }

    .auth-button:disabled {
        background: #666;
        cursor: not-allowed;
    }

    .auth-redirect {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 0.9rem;
        color: #aaa;
    }

    .auth-link {
        color: #5db3ff;
        text-decoration: none;
        font-weight: 500;
    }

    .auth-link:hover {
        text-decoration: underline;
    }
</style>
