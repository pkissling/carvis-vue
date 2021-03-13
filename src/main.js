import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { domain, clientId } from '../auth.config.json';
import { Auth0Plugin } from './auth';
import apolloProvider from './apollo';

// auth
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  apolloProvider
}).$mount('#app')
