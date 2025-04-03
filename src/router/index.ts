import { createRouter, createWebHistory } from 'vue-router'
import EventsView from '@/views/EventsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/events'
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView
    },
    {
      path: '/travel',
      name: 'travel',
      component: () => import('@/views/TravelView.vue')
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/HelpView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    }
  ]
})

export default router 