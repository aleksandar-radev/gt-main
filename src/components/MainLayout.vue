<template>
    <div class="website-container">
        <!-- Navigation Header -->
        <nav class="header">
            <router-link to="/" class="logo">
                <img width="150px" src="/main-logo-wide-transparent.png" alt="Company Logo" />
            </router-link>
            <div class="nav-links">
                <router-link to="/games" class="nav-link">{{ t('main.games') }}</router-link>
                <router-link to="/about" class="nav-link">{{ t('main.about') }}</router-link>
                <router-link to="/feedback" class="nav-link">{{ t('main.feedback') }}</router-link>
                <!-- Admin-only link -->
                <router-link
                    v-if="authStore.user && authStore.user.role === 'admin'"
                    to="/admin/feedback"
                    class="nav-link admin-link"
                >
                    {{ t('main.manageFeedback') }}
                </router-link>
                <router-link
                    v-if="authStore.user && authStore.user.role === 'admin'"
                    to="/admin/games"
                    class="nav-link admin-link"
                >
                    {{ t('main.manageGames') }}
                </router-link>
            </div>
            <div class="auth-section">
                <!-- Show user info and logout button when logged in -->
                <template v-if="authStore.user">
                    <span class="username">{{ t('main.whatsUp', { name: authStore.user.username }) }}</span>
                    <button class="logout-btn" @click="handleLogout">{{ t('main.logout') }}</button>
                </template>
                <!-- Show login/register links when logged out -->
                <template v-else>
                    <router-link to="/login" class="auth-link">{{ t('main.login') }}</router-link>
                    <router-link to="/register" class="auth-link">{{ t('main.register') }}</router-link>
                </template>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <router-view></router-view>
        </main>

        <!-- Footer (Slimmer Version) -->
        <footer class="footer">
            <div class="slim-footer-content">
                <div class="footer-links">
                    <!-- <a href="#">About</a> -->
                    <!-- <a href="#">Contact</a> -->
                    <!-- <a href="#">Privacy</a> -->
                    <!-- <a href="#">Terms</a> -->
                </div>
                <p class="copyright">{{ t('main.copyright') }}</p>
                <div class="social-links">
                    <!-- <a href="#">Twitter</a> -->
                    <!-- <a href="#">Facebook</a> -->
                    <a href="https://discord.gg/8rgwg2zzqc" target="_blank" rel="noopener">{{ t('main.discord') }}</a>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore';
    import { useRouter } from 'vue-router';
    import { onMounted } from 'vue';
    import { useI18n } from '@/plugins/i18n';

    const authStore = useAuthStore();
    const router = useRouter();
    const { t } = useI18n();

    // Check authentication status when component mounts
    onMounted(async () => {
        try {
            await authStore.getCurrentUser();
            // console.log('Current user:', authStore.user);
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

    /* New slimmer footer styles */
    .footer {
        background-color: #1a1a1a;
        color: white;
        padding: 1rem 2rem;
        margin-top: auto;
    }

    .slim-footer-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .footer-links {
        display: flex;
        gap: 1.5rem;
    }

    .footer-links a {
        color: #ccc;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
    }

    .footer-links a:hover {
        color: #3498db;
    }

    .social-links {
        display: flex;
        gap: 1rem;
    }

    .social-links a {
        color: #ccc;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
    }

    .social-links a:hover {
        color: #3498db;
    }

    .copyright {
        font-size: 0.8rem;
        color: #888;
        margin: 0;
    }

    @media (max-width: 768px) {
        .footer-links,
        .social-links {
            flex-wrap: wrap;
            justify-content: center;
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
