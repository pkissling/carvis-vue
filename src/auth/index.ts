import { VueConstructor } from 'vue'
import {
    Auth0Wrapper,
    Auth0Options,
    RedirectCallback,
} from '@/auth/auth0-wrapper'

type Auth0PluginOptions = {
    onRedirectCallback: RedirectCallback
    redirectUri: string
    domain: string
    clientId: string
    audience?: string
    [key: string]: string | RedirectCallback | undefined
}

let instance: Auth0Wrapper

/** Returns the current instance of the SDK */
export const getInstance = (): Auth0Wrapper => instance

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = ({
    onRedirectCallback,
    redirectUri = window.location.origin,
    ...options
}: Auth0PluginOptions): Auth0Wrapper => {
    if (instance) return instance

    // The 'instance' is simply a Vue object
    instance = new Auth0Wrapper()
    instance.init(onRedirectCallback, redirectUri, options as Auth0Options)
    return instance
}

// Create a simple Vue plugin to expose the wrapper object throughout the application

export const Auth0Plugin = {
    install(Vue: VueConstructor, options: Auth0PluginOptions): void {
        Vue.prototype.$auth = useAuth0(options)
    },
}
