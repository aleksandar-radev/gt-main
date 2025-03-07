import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import AboutView from '@/views/AboutView.vue'
import GameList from '@/components/GameList.vue'
import GameDetail from '@/components/GameDetail.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import authService from '../services/auth.service'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: MainLayout,
            children: [
                {
                    path: '',
                    name: 'home',
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
            ],
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
})

// Navigation guard
router.beforeEach((to, from, next) => {
    const isLoggedIn = authService.isLoggedIn()

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!isLoggedIn) {
            next({ name: 'Login' })
        } else {
            next()
        }
    } else if (to.matched.some((record) => record.meta.guest)) {
        if (isLoggedIn) {
            next({ name: 'Home' })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
