<template>
    <div class="home">
        <h1>Welcome, {{ user ? user.name : 'User' }}!</h1>
        <button class="logout-btn" @click="logout">Logout</button>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'

export default {
    name: 'HomeScreen',
    setup() {
        const user = ref(null)
        const router = useRouter()

        onMounted(() => {
            user.value = authService.getCurrentUser()
        })

        const logout = () => {
            authService.logout()
            router.push('/login')
        }

        return {
            user,
            logout,
        }
    },
}
</script>

<style scoped>
.home {
    padding: 20px;
    text-align: center;
}
.logout-btn {
    padding: 8px 16px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
}
</style>
