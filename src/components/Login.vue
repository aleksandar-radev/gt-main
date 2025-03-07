<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="email" type="email" required />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" v-model="password" type="password" required />
            </div>
            <div v-if="error" class="error">{{ error }}</div>
            <button type="submit" :disabled="loading">
                {{ loading ? 'Logging in...' : 'Login' }}
            </button>
            <p>
                Don't have an account?
                <router-link to="/register">Register</router-link>
            </p>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/auth.service';

export default {
    name: 'Login',
    setup() {
        const email = ref('');
        const password = ref('');
        const loading = ref(false);
        const error = ref('');
        const router = useRouter();

        const login = async () => {
            try {
                loading.value = true;
                error.value = '';
                await authService.login(email.value, password.value);
                router.push('/');
            } catch (err) {
                error.value = err.response?.data?.message || 'Failed to login';
            } finally {
                loading.value = false;
            }
        };

        return {
            email,
            password,
            loading,
            error,
            login,
        };
    },
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
}
.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.error {
    color: red;
    margin-bottom: 10px;
}
button {
    width: 100%;
    padding: 10px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:disabled {
    background: #cccccc;
}
</style>
