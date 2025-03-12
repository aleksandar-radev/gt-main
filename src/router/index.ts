import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/MainLayout.vue';
import AboutView from '@/views/AboutView.vue';
import GameList from '@/components/GameList.vue';
import GameDetail from '@/components/GameDetail.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import HomeView from '../views/HomeView.vue';
import FeedbackView from '../views/FeedbackView.vue';

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
            ],
        },
    ],
});

export default router;
