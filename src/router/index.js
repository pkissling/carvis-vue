import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import authGuard from '../auth/authGuard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cars',
    name: 'CarsTable',
    component: () => import('../views/CarsTable.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/add',
    name: 'CreateCarWizard',
    component: () => import('../views/CreateCarWizard.vue'),
    beforeEnter: authGuard
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
