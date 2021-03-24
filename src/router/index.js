import Vue from 'vue'
import VueRouter from 'vue-router'
import authGuard from '../auth/authGuard'
import CarsPage from '../pages/CarsPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: CarsPage,
    beforeEnter: authGuard
  },
  {
    path: '/add',
    component: () => import('../pages/CreateCarPage.vue')
  },
  {
    path: '/:carId',
    component: () => import('../pages/CarDetailPage.vue'),
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  authGuard(to, from, next)
})

export default router
