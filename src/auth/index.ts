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

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = (appState: unknown) => {
    window.history.replaceState({}, document.title, window.location.pathname)
}

let instance: Auth0Wrapper

/** Returns the current instance of the SDK */
export const getInstance = () => instance

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = ({
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    redirectUri = window.location.origin,
    ...options
}) => {
    if (instance) return instance

    // The 'instance' is simply a Vue object
    instance = new Auth0Wrapper()
    instance.init(onRedirectCallback, redirectUri, options as Auth0Options)
    return instance
}

// Create a simple Vue plugin to expose the wrapper object throughout the application

export const Auth0Plugin = {
    install(Vue: VueConstructor, options: Auth0PluginOptions) {
        Vue.prototype.$auth = useAuth0(options)
    },
}
