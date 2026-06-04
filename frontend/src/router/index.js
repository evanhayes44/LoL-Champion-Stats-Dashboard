import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/champion/:id',
      name: 'champion',
      component: () => import('../views/ChampionDetailView.vue'),
    },
  ],
})

export default router
