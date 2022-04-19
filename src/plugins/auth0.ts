import Vue from 'vue'
import { auth0Domain, auth0ClientId } from '../../carvis.config'
import { Auth0Plugin } from '@/auth'
import router from '@/router'
import { RedirectLoginOptions } from '@auth0/auth0-spa-js'

export default (): void => {
    Vue.use(Auth0Plugin, {
        domain: auth0Domain,
        clientId: auth0ClientId,
        onRedirectCallback: (appState: RedirectLoginOptions) => {
            router.push(
                appState && appState.targetUrl
                    ? appState.targetUrl
                    : window.location.pathname
            )
        },
    })
}
