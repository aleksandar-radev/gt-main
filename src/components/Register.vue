<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit" :disabled="loading || !isFormValid">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/auth.service'

export default {
  name: 'Register',
  setup() {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const loading = ref(false)
    const error = ref('')
    const router = useRouter()

    const isFormValid = computed(() => {
      return (
        name.value.trim() !== '' &&
        email.value.trim() !== '' &&
        password.value.length >= 6 &&
        password.value === confirmPassword.value
      )
    })

    const register = async () => {
      if (!isFormValid.value) {
        error.value = 'Please check your inputs'
        return
      }

      try {
        loading.value = true
        error.value = ''
        await authService.register(name.value, email.value, password.value)
        router.push('/login')
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to register'
      } finally {
        loading.value = false
      }
    }

    return {
      name,
      email,
      password,
      confirmPassword,
      loading,
      error,
      isFormValid,
      register,
    }
  },
}
</script>

<style scoped>
.register-container {
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
