import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { auth0Domain, auth0ClientId } from '../app.config'
import { Auth0Plugin } from './auth'
import apolloProvider from './apollo'
import vuetify from './plugins/vuetify'
import store from './store'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

// auth
Vue.use(Auth0Plugin, {
  domain: auth0Domain,
  clientId: auth0ClientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
})

// sentry
Sentry.init({
  Vue,
  dsn: 'https://d6e0397557fd4cefb61c460d0b0e4797@o582664.ingest.sentry.io/5736641',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  release: process.env.npm_package_version
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  vuetify,
  store,
  apolloProvider
}).$mount('#app')
