import Vue from 'vue'
import VueRouter from 'vue-router'
import CarsTable from '../views/CarsTable.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'CarsTable',
    component: CarsTable
  },
  {
    path: '/add',
    name: 'CreateCarWizard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateCarWizard.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
