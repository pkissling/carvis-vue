import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import { register } from './plugins'
import auth0Plugin from './plugins/auth0'
import sentryPlugin from './plugins/sentry'

register(Vue, 'auth0', auth0Plugin, true)
register(Vue, 'sentry', sentryPlugin, false)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
