import Vue from 'vue'
import VueRouter, { NavigationGuardNext, Route } from 'vue-router'
import { authGuard } from '@/auth/auth-guard'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: () => import('@/pages/HomePage.vue'),
        meta: {
            requiresNoAuth: true,
        },
    },
    {
        path: '/cars',
        component: () => import('@/pages/CarsPage.vue'),
    },
    {
        path: '/cars/add',
        component: () => import('@/pages/CreateCarPage.vue'),
    },
    {
        path: '/cars/:carId',
        component: () => import('@/pages/CarDetailPage.vue'),
        props: true,
    },
    {
        path: '/forbidden',
        component: () => import('@/pages/ForbiddenPage.vue'),
        meta: {
            requiresNoAuth: true,
        },
    },
    {
        path: '/requests',
        component: () => import('@/pages/RequestsPage.vue'),
    },
    {
        path: '/requests/add',
        component: () => import('@/pages/CreateRequestPage.vue'),
    },
    {
        path: '/requests/:requestId',
        component: () => import('@/pages/RequestDetailPage.vue'),
        props: true,
    },
    {
        path: '/not-found',
        name: 'NotFound',
        component: () => import('@/pages/NotFoundPage.vue'),
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
    if (to.meta?.requiresNoAuth) next()
    else authGuard(to, from, next)
})

export default router
