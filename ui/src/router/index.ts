import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/views/Events.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// Basic routing guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('access_token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
