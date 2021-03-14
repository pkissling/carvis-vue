import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/list',
    name: 'CarsTable',
    component: () => import('../views/CarsTable.vue')
  },
  {
    path: '/add',
    name: 'CreateCarWizard',
    component: () => import('../views/CreateCarWizard.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
