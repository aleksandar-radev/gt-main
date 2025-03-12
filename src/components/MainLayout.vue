<template>
    <div class="website-container">
        <!-- Navigation Header -->
        <nav class="header">
            <router-link to="/" class="logo">
                <img src="https://placehold.co/150x50" alt="Company Logo" />
            </router-link>
            <div class="nav-links">
                <router-link to="/games" class="nav-link">Games</router-link>
                <router-link to="/about" class="nav-link">About</router-link>
                <router-link to="/feedback" class="nav-link">Feedback</router-link>
                <!-- Admin-only link -->
                <router-link
                    v-if="authStore.user && authStore.user.role === 'admin'"
                    to="/admin/feedback"
                    class="nav-link admin-link"
                >
                    Manage Feedback
                </router-link>
            </div>
            <div class="auth-section">
                <!-- Show user info and logout button when logged in -->
                <template v-if="authStore.user">
                    <span class="username">Whats up, {{ authStore.user.username }}</span>
                    <button class="logout-btn" @click="handleLogout">Logout</button>
                </template>
                <!-- Show login/register links when logged out -->
                <template v-else>
                    <router-link to="/login" class="auth-link">Login</router-link>
                    <router-link to="/register" class="auth-link">Register</router-link>
                </template>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <router-view></router-view>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>About Us</h4>
                    <p>Your gaming platform description</p>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p>Email: contact@example.com</p>
                </div>
                <div class="footer-section">
                    <h4>Follow Us</h4>
                    <div class="social-links">
                        <a href="#">Twitter</a>
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2024 Gaming Platform. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore';
    import { useRouter } from 'vue-router';
    import { onMounted } from 'vue';

    const authStore = useAuthStore();
    const router = useRouter();

    // Check authentication status when component mounts
    onMounted(async () => {
        try {
            await authStore.getCurrentUser();
            console.log('Current user:', authStore.user);
        } catch (error) {
            console.error('Failed to get current user:', error);
        }
    });

    const handleLogout = () => {
        authStore.logout();
        router.push('/login');
    };
</script>

<style scoped>
    /* Styles remain unchanged */
    .website-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #1a1a1a;
        color: white;
    }

    .nav-links {
        display: flex;
        gap: 2rem;
    }

    .nav-link,
    .auth-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
    }

    .nav-link.router-link-active {
        color: #3498db;
        font-weight: bold;
    }

    .auth-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .username {
        color: white;
        font-weight: bold;
    }

    .logout-btn {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .logout-btn:hover {
        background-color: #c0392b;
    }

    .main-content {
        flex: 1;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
    }

    .footer {
        background-color: #1a1a1a;
        color: white;
        padding: 2rem;
        margin-top: auto;
    }

    .footer-content {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin-bottom: 2rem;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }

    .social-links {
        display: flex;
        gap: 1rem;
    }

    .social-links a {
        color: white;
        text-decoration: none;
        transition: color 0.2s;
    }

    .social-links a:hover {
        color: #3498db;
    }

    .footer-bottom {
        text-align: center;
        padding-top: 2rem;
        border-top: 1px solid #333;
    }

    @media (max-width: 768px) {
        .footer-content {
            grid-template-columns: 1fr;
        }

        .nav-links {
            display: none;
        }
    }

    .admin-link {
        background-color: #e74c3c;
        border-radius: 4px;
        padding: 0.3rem 0.7rem;
        font-weight: bold;
    }

    .admin-link:hover {
        background-color: #c0392b;
    }
</style>
