import Vue from 'vue'
import App from './App.vue'
import AWSAppSyncClient from "aws-appsync"
import VueApollo from 'vue-apollo'
import router from './router'
import { domain, clientId } from "../auth_config.json";
import { Auth0Plugin } from "./auth";

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

const client = new AWSAppSyncClient({
  url: 'https://emh6z2joqvcw7fcbfnd7nperv4.appsync-api.eu-west-1.amazonaws.com/graphql',
  region: 'eu-west-1',
  auth: {
    type: 'OPENID_CONNECT',
    jwtToken: () => {
      console.log('auth')
      Vue.prototype.$auth.auth0Client.getTokenSilently()
    }
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
