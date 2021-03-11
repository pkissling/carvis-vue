import Vue from 'vue'
import App from './App.vue'
import AWSAppSyncClient from "aws-appsync"
import VueApollo from 'vue-apollo'
import router from './router'
import { domain, clientId } from "../auth_config.json";
import { Auth0Plugin } from "./auth";
import { setContext } from "apollo-link-context";

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


const authLink = setContext(async (_, { headers }) => {
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'x-api-header': await Auth0Plugin.getTokenSilently()
    }
  }
})
const client = new AWSAppSyncClient({
  url: 'https://emh6z2joqvcw7fcbfnd7nperv4.appsync-api.eu-west-1.amazonaws.com/graphql',
  region: 'eu-west-1',
  auth: {
    type: 'API_KEY',
    apiKey: 'da2-j2q5slniuverjlv56phyxkrkdm',
  }
},{
  defaultOptions: {
    link: authLink,
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
