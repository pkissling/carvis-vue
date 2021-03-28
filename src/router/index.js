import Vue from 'vue'
import VueRouter from 'vue-router'
import authGuard from '../auth/authGuard'
import CarsPage from '../pages/CarsPage'
import goTo from 'vuetify/es5/services/goto'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: CarsPage,
  },
  {
    path: '/cars/add',
    component: () => import('../pages/CreateCarPage.vue')
  },
  {
    path: '/forbidden',
    component: () => import('../pages/ForbiddenPage.vue'),
  },
  {
    path: '/cars/:carId',
    component: () => import('../pages/CarDetailPage.vue'),
    props: true
  },
  {
    path: '*',
    component: () => import('../pages/NotFoundPage.vue'),
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
  if (to.path === '/forbidden') next()
  else authGuard(to, from, next)
})

export default router
