import Vue from 'vue'
import AWSAppSyncClient from 'aws-appsync'
import VueApollo from 'vue-apollo'
import { getInstance } from "../auth";
import { url, region } from '../../appsync.config.json'

Vue.use(VueApollo)

// apollo
const client = new AWSAppSyncClient({
  url,
  region,
  auth: {
    type: 'OPENID_CONNECT',
    jwtToken: async () => {
      const instance = await getInstance()

      if (!instance.isAuthenticated) {
        await instance.loginWithRedirect()
      }
      const claims = await getInstance().getIdTokenClaims()
      return claims.__raw
    }
  }
  },{
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    }
  }
})
const apolloProvider = new VueApollo({
  defaultClient: client
})

export default apolloProvider