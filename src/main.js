import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { auth0Domain, auth0ClientId } from '../app.config';
import { Auth0Plugin } from './auth';
import apolloProvider from './apollo';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

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
});

// bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  apolloProvider
}).$mount('#app')
