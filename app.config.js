export const auth0Domain = 'carvis.eu.auth0.com'
export const auth0ClientId = 'ukQnXHJoRrZwGf85Uh4Jpk8V932GsfKt'

export const apiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080'
  } else if (process.env.VUE_APP_USE_DEV === 'true') {
    return 'https://api.dev.carvis.cloud/'
  } else {
    return 'https://api.carvis.cloud'
  }
}