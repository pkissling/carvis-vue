import Vue from 'vue'
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from 'vue-router'
import { authGuard } from '@/auth/auth-guard'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('@/components/pages/HomePage.vue'),
  },
  {
    path: '/cars',
    component: () => import('@/components/pages/CarsPage.vue'),
    meta: {
      requiresRole: 'user',
      breadcrumbs() {
        return [
          { text: 'Fahrzeuge', href: '/cars' },
        ]
      }
    }
  },
  {
    path: '/cars/add',
    component: () => import('@/components/pages/CreateCarPage.vue'),
    meta: {
      requiresRole: 'user',
      breadcrumbs() {
        return [
          { text: 'Fahrzeuge', href: '/cars' },
          { text: 'Fahrzeug hinzufügen', href: '/cars/add' }
        ]
      }
    }
  },
  {
    path: '/cars/:carId',
    component: () => import('@/components/pages/CarDetailPage.vue'),
    props: true,
    meta: {
      requiresRole: 'user',
      breadcrumbs(route: Route) {
        const carId = route.params.carId
        return [
          { text: 'Fahrzeuge', href: '/cars' },
          { text: carId, href: `/cars/${carId}` },
        ]
      }
    }
  },
  {
    path: '/forbidden',
    component: () => import('@/components/pages/ForbiddenPage.vue'),
  },
  {
    path: '/requests',
    component: () => import('@/components/pages/RequestsPage.vue'),
    meta: {
      requiresRole: 'user',
      breadcrumbs() {
        return [
          { text: 'Gesuche', href: '/requests' },
        ]
      }
    }
  },
  {
    path: '/requests/add',
    component: () => import('@/components/pages/CreateRequestPage.vue'),
    meta: {
      requiresRole: 'user',
      breadcrumbs() {
        return [
          { text: 'Gesuche', href: '/requests' },
          { text: 'Gesuche hinzufügen', href: '/requests/add' },
        ]
      }
    }
  },
  {
    path: '/requests/:requestId',
    component: () => import('@/components/pages/RequestDetailPage.vue'),
    props: true,
    meta: {
      requiresRole: 'user',
      breadcrumbs(route: Route) {
        const requestId = route.params.requestId
        return [
          { text: 'Gesuche', href: '/requests' },
          { text: requestId, href: `/requests/${requestId}` },
        ]
      }
    }
  },
  {
    path: '/my-account',
    component: () => import('@/components/pages/MyAccountPage.vue'),
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: () => import('@/components/pages/NotFoundPage.vue'),
  },
  {
    path: '*',
    beforeEnter: (href: Route, from: Route, next: NavigationGuardNext) => {
      next('/not-found')
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
  if (!to.meta?.requiresRole) next()
  else authGuard(to, from, next)
})

export default router
