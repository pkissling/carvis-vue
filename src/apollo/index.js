import Vue from 'vue'
import AWSAppSyncClient from 'aws-appsync'
import VueApollo from 'vue-apollo'
import { obtainJwtToken } from '../auth/utils'
import { url, region } from '../../appsync.config.json'

Vue.use(VueApollo)

// apollo
const client = new AWSAppSyncClient({
  url,
  region,
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
  defaultClient: client
})

export default apolloProvider