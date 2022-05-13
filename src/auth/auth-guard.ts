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

        // If role is required and user is not logged in, redirect to login
        if (!authService.user) {
            return await authService.loginWithRedirect({ appState: { targetUrl: to.fullPath }})
        }

        // Dispatch to 'forbidden' on missing permission
        const requiredRole = to.meta?.requiresRole
        if (!hasRole(authService.user, requiredRole)) {
            return next('/forbidden')
        }

        // otherwise forward
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
