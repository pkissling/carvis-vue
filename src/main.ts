import Vue from 'vue'
import Vuex from 'vuex'
import App from '@/App.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import { register } from '@/plugins'
import auth0Plugin from '@/plugins/auth0'
import sentryPlugin from '@/plugins/sentry'

register('auth0', auth0Plugin, true)
register('sentry', sentryPlugin, false)

Vue.use(Vuex)
Vue.config.productionTip = false

new Vue({
    render: (h) => h(App),
    router,
    vuetify,
}).$mount('#app')
