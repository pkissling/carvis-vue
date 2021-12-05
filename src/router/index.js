import Vue from 'vue'
import VueRouter from 'vue-router'
import authGuard from '../auth/authGuard'
import HomePage from '../pages/HomePage'
import goTo from 'vuetify/es5/services/goto'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomePage,
    meta: {
      requiresNoAuth: true
    }
  },
  {
    path: '/cars',
    component: () => import('../pages/CarsPage.vue')
  },
  {
    path: '/cars/add',
    component: () => import('../pages/CreateCarPage.vue')
  },
  {
    path: '/cars/:carId',
    component: () => import('../pages/CarDetailPage.vue'),
    props: true
  },
  {
    path: '/forbidden',
    component: () => import('../pages/ForbiddenPage.vue'),
    meta: {
      requiresNoAuth: true
    }
  },
  {
    path: '/requests',
    component: () => import('../pages/RequestsPage.vue')
  },
  {
    path: '/requests/add',
    component: () => import('../pages/CreateRequestPage.vue')
  },
  {
    path: '/requests/:requestId',
    component: () => import('../pages/RequestDetailPage.vue'),
    props: true
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue')
  },
  {
    path: '*',
    beforeEnter: (to, from, next) => {
      next('/404')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta?.requiresNoAuth) next()
  else authGuard(to, from, next)
})

export default router
