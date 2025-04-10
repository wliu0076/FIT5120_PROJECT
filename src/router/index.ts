import { createRouter, createWebHistory } from 'vue-router'
import EventsView from '../views/EventsView.vue'
import NavigationView from '../views/NavigationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
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
      component: NavigationView
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router 