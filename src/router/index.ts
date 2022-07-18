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
          { text: 'Fahrzeuge', to: '/cars' },
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
          { text: 'Fahrzeuge', to: '/cars' },
          { text: 'Fahrzeug hinzufügen', to: '/cars/add' }
        ]
      }
    }
  },
  {
    path: '/cars/:carId',
    component: () => import('@/components/pages/CarDetailPage.vue'),
    name: 'CarDetailPage',
    props: true,
    meta: {
      requiresRole: 'user',
      breadcrumbs(route: Route, title: string) {
        const carId = route.params.carId
        return [
          { text: 'Fahrzeuge', to: '/cars' },
          { text: title, to: `/cars/${carId}` },
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
          { text: 'Gesuche', to: '/requests' },
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
          { text: 'Gesuche', to: '/requests' },
          { text: 'Gesuche hinzufügen', to: '/requests/add' },
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
      breadcrumbs(route: Route, title: string) {
        const requestId = route.params.requestId
        return [
          { text: 'Gesuche', to: '/requests' },
          { text: title, to: `/requests/${requestId}` },
        ]
      }
    }
  },
  {
    path: '/my-account',
    component: () => import('@/components/pages/MyAccountPage.vue'),
    meta: {
      requiresRole: 'user',
      breadcrumbs() {
        return [
          { text: 'Mein Profil', to: '/my-account' },
        ]
      }
    }
  },
  {
    path: '/user-management',
    component: () => import('@/components/pages/UserManagementPage.vue'),
    meta: {
      requiresRole: 'admin',
      breadcrumbs() {
        return [
          { text: 'Benutzerverwaltung', to: '/user-management' },
        ]
      }
    }
  },
  {
    path: '/shareable-links',
    component: () => import('@/components/pages/ShareableLinksPage.vue'),
    meta: {
      requiresRole: 'admin',
      breadcrumbs() {
        return [
          { text: 'Geteilte Links', to: '/shareable-links' },
        ]
      }
    }
  },
  {
    path: '/share/:shareableLinkReference',
    component: () => import('@/components/pages/AnonymousCarDetailPage.vue'),
    props: true
  },
  {
    path: '/invalid-link',
    component: () => import('@/components/pages/ShareableLinkInvalidPage.vue'),
    props: route => {
      return ({ reason: route.query.reason })
    }
  },
  {
    path: '/not-found',
    component: () => import('@/components/pages/NotFoundPage.vue'),
  },
  {
    path: '*',
    beforeEnter: (to: Route, from: Route, next: NavigationGuardNext) => {
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
