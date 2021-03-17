import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import authGuard from '../auth/authGuard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/cars',
    component: () => import('../pages/CarsPage.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/add',
    component: () => import('../pages/CreateCarPage.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/cars/:carId',
    component: () => import('../pages/ViewCarPage.vue'),
    beforeEnter: authGuard,
    props: true
  },
  {
    path: '/cars/:carId/edit',
    component: () => import('../pages/EditCarPage.vue'),
    beforeEnter: authGuard,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
