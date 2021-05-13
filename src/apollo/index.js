/* eslint-disable no-console */
import Vue from 'vue'
import AWSAppSyncClient, { createAppSyncLink } from 'aws-appsync';
import VueApollo from 'vue-apollo'
import { obtainJwtToken } from '../auth/utils'
import { appsyncUrl, appsyncRegion } from '../../app.config'
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import notificationService from '../service/notification-service'
import sentryService from '../service/sentry-service';


Vue.use(VueApollo)

const errorLink = onError(({ networkError, graphQLErrors }) => {
  notificationService.error('Fehler beim Laden der Daten vom Server. Bitte versuche es später erneut.')
  if (graphQLErrors) {
    graphQLErrors.forEach(error => sentryService.captureError('graphql network error', { error }))
  }

  if (networkError) {
    sentryService.captureError('graphql network error', { networkError })
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