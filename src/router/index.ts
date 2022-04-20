import Vue from 'vue'
import VueRouter, { NavigationGuardNext, Route } from 'vue-router'
import { authGuard } from '@/auth/auth-guard'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: () => import('@/components/pages/HomePage.vue'),
        meta: {
            requiresNoAuth: true,
        },
    },
    {
        path: '/cars',
        component: () => import('@/components/pages/CarsPage.vue'),
    },
    {
        path: '/cars/add',
        component: () => import('@/components/pages/CreateCarPage.vue'),
    },
    {
        path: '/cars/:carId',
        component: () => import('@/components/pages/CarDetailPage.vue'),
        props: true,
    },
    {
        path: '/forbidden',
        component: () => import('@/components/pages/ForbiddenPage.vue'),
        meta: {
            requiresNoAuth: true,
        },
    },
    {
        path: '/requests',
        component: () => import('@/components/pages/RequestsPage.vue'),
    },
    {
        path: '/requests/add',
        component: () => import('@/components/pages/CreateRequestPage.vue'),
    },
    {
        path: '/requests/:requestId',
        component: () => import('@/components/pages/RequestDetailPage.vue'),
        props: true,
    },
    {
        path: '/not-found',
        name: 'NotFound',
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
    if (to.meta?.requiresNoAuth) next()
    else authGuard(to, from, next)
})

export default router
