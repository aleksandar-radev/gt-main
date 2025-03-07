import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import AboutView from '@/views/AboutView.vue'
import GameList from '@/components/GameList.vue'
import GameDetail from '@/components/GameDetail.vue'

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
  ],
})

export default router
