import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import EventsView from '../views/EventsView.vue'
import TrainingView from '../views/TrainingView.vue'
import CreatorDashboardView from '../views/CreatorDashboardView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: HomeView,
      meta: { requiresAuth: true, layout: 'main' }
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView,
      meta: { requiresAuth: true, layout: 'main' }
    },
    {
      path: '/training',
      name: 'training',
      component: TrainingView,
      meta: { requiresAuth: true, layout: 'main' }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'auth' }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { layout: 'auth' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, layout: 'main' }
    },
    {
      path: '/creator',
      name: 'creator',
      component: CreatorDashboardView,
      meta: { requiresAuth: true, layout: 'main' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      meta: { requiresAuth: true, layout: 'main' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Mock authentication logic for UI dev purposes
  const isAuthenticated = localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
