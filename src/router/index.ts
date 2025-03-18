import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/MainLayout.vue';
import AboutView from '@/views/AboutView.vue';
import GameList from '@/components/GameList.vue';
import GameDetail from '@/components/GameDetail.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import HomeView from '../views/HomeView.vue';
import FeedbackView from '../views/FeedbackView.vue';
import { useAuthStore } from '../stores/authStore';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: MainLayout,
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: HomeView,
                },
                {
                    path: '/feedback',
                    name: 'feedback',
                    component: FeedbackView,
                },
                {
                    path: '/games',
                    name: 'games',
                    component: GameList,
                },
                {
                    path: 'game/:id',
                    name: 'gameDetail',
                    component: GameDetail,
                    props: true,
                },
                {
                    path: 'about',
                    name: 'about',
                    component: AboutView,
                },
                {
                    path: '/login',
                    name: 'Login',
                    component: Login,
                    meta: { guest: true },
                },
                {
                    path: '/register',
                    name: 'Register',
                    component: Register,
                    meta: { guest: true },
                },
                {
                    path: '/admin/feedback',
                    name: 'adminFeedback',
                    component: () => import('../views/AdminFeedbackView.vue'),
                    meta: {
                        requiresAuth: true,
                        requiresAdmin: true,
                    },
                },
                {
                    path: '/admin/games',
                    name: 'gameManagement',
                    component: () => import('../views/GameManagement.vue'),
                    meta: {
                        requiresAuth: true,
                        requiresAdmin: true,
                    },
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isLoggedIn = !!authStore.user;
    const isAdmin = isLoggedIn && authStore.user?.role === 'admin';

    // Check if route requires admin role
    if (to.meta.requiresAdmin && !isAdmin) {
        next({ name: 'home' }); // Redirect non-admins
        return;
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !isLoggedIn) {
        next({ name: 'login' });
        return;
    }

    next();
});

export default router;
