import Vue from 'vue'
import App from './App.vue'
import AWSAppSyncClient from "aws-appsync"
import VueApollo from 'vue-apollo'
import router from './router'

const client = new AWSAppSyncClient({
  url: 'https://emh6z2joqvcw7fcbfnd7nperv4.appsync-api.eu-west-1.amazonaws.com/graphql',
  region: 'eu-west-1',
  auth: {
    type: 'API_KEY',
    apiKey: 'da2-j2q5slniuverjlv56phyxkrkdm',
  }
},{
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    }
  }
})
const appsyncProvider = new VueApollo({
  defaultClient: client
})
Vue.config.productionTip = false
Vue.use(VueApollo)


new Vue({
  render: h => h(App),
  router,
  provide: appsyncProvider.provide()
}).$mount('#app')
