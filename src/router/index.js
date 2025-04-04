import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EventsCalendar from '../components/EventsCalendar.vue'
import NavigationView from '../views/NavigationView.vue'
import HelpView from '../views/HelpView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/events',
      name: 'events',
      component: EventsCalendar
    },
    {
      path: '/travel',
      name: 'travel',
      component: NavigationView
    },
    {
      path: '/help',
      name: 'help',
      component: HelpView
    },
    {
      path: '/navigation/:eventId?',
      name: 'navigation',
      component: NavigationView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
})

export default router 