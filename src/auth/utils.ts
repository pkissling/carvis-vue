import { getInstance } from '@/auth'

export const obtainJwtToken = async (): Promise<string | undefined> => {
    const authService = getInstance()

    while (authService.loading) {
        await new Promise(resolve => setTimeout(resolve, 10))
    }

    return onLoaded()
}

const onLoaded = async (): Promise<string | undefined> => {
    const authService = getInstance()

    if (authService.isAuthenticated) {
        // Return token if authenticated
        const token = await authService.getIdTokenClaims()
        if (token && token.__raw) {
            return token.__raw
        }
    }

    // otherwise login
    await authService.loginWithRedirect({})
}
