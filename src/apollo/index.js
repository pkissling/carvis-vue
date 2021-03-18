import Vue from 'vue'
import AWSAppSyncClient from 'aws-appsync'
import VueApollo from 'vue-apollo'
import { obtainJwtToken } from '../auth/utils'
import { appsyncUrl, appsyncRegion } from '../../app.config'

Vue.use(VueApollo)

// apollo
export const apolloClient = new AWSAppSyncClient({
  url: appsyncUrl,
  region: appsyncRegion,
  auth: {
    type: 'OPENID_CONNECT',
    jwtToken: async () => obtainJwtToken()
  }
},
  {
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    }
  }
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

export default apolloProvider