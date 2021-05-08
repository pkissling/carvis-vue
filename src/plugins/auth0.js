import { auth0Domain, auth0ClientId } from '../../app.config'
import { Auth0Plugin } from '../auth'

export default (vue) => {
  debugger
  vue.use(Auth0Plugin, {
    domain: auth0Domain,
    clientId: auth0ClientId,
    onRedirectCallback: appState => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      );
    }
  })
}