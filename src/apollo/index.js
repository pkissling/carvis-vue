/* eslint-disable no-console */
import Vue from 'vue'
import AWSAppSyncClient, { createAppSyncLink } from 'aws-appsync';
import VueApollo from 'vue-apollo'
import { obtainJwtToken } from '../auth/utils'
import { appsyncUrl, appsyncRegion } from '../../app.config'
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import store from '../store/index'


Vue.use(VueApollo)

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    const errorMessages = graphQLErrors.map(({ message, locations, path }) => `Message: ${message}, Location: ${locations}, Path: ${path}`)
    store.dispatch('notifications/error', 'Es ist ein Fehler aufgetreten: ' + errorMessages)
  }

  if (networkError) {
    store.dispatch('notifications/error', 'Es gibt Netzwerkprobleme: ' + networkError)
  }
})

const appSyncClientConfig = {
  url: appsyncUrl,
  region: appsyncRegion,
  auth: {
    type: 'OPENID_CONNECT',
    jwtToken: async () => obtainJwtToken()
  }
}
const appSyncLink = createAppSyncLink(appSyncClientConfig);
const link = ApolloLink.from([errorLink, appSyncLink]);

const appSyncClientOptions = {
  link,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    }
  }
}

export const apolloClient = new AWSAppSyncClient(appSyncClientConfig, appSyncClientOptions)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

export default apolloProvider