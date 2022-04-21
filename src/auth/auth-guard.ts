import { getInstance } from '@/auth'
import { hasRole } from '@/store/modules/user-store'
import { NavigationGuard, NavigationGuardNext, Route } from 'vue-router'

export const authGuard: NavigationGuard = async (
    to: Route,
    from: Route,
    next: NavigationGuardNext
): Promise<void> => {
    const authService = getInstance()

    const fn = async () => {
        // Unwatch loading
        unwatch && unwatch()

        // If the routes does not require a role, continue with the route
        const requiredRole = to.meta?.requiresRole
        if (!requiredRole) {
            return next()
        }

        // If role is required and user is not logged in, redirect to login
        if (!authService.isAuthenticated || !authService.user) {
            await authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } })
        }

        // If user does not have required role, show forbidden page
        if (!hasRole(authService.user, requiredRole)) {
            return next('/forbidden')
        }

        // otherwise foward
        return next()
    }

    // If loading has already finished, check our auth state using `fn()`
    if (!authService.loading) {
        return fn()
    }

    // Watch for the loading property to change before we check isAuthenticated
    const unwatch = authService.$watch('loading', (loading: boolean) => {
        if (loading === false) {
            return fn()
        }
    })
}
