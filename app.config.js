export const appsyncUrl = () => {
  if(process.env.NODE_ENV === 'development') {
    return 'https://kdf3255uqzayjdacltoipgn7pm.appsync-api.eu-west-1.amazonaws.com/graphql'
  } else {
    return 'https://ppuwso2by5a4te3zokxnobgtyu.appsync-api.eu-west-1.amazonaws.com/graphql'
  }
}

export const appsyncRegion = 'eu-west-1'

export const auth0Domain = 'blumenerd.eu.auth0.com'
export const auth0ClientId = 'S2yHjIXzCcEGctf6EZpiaXFBNCEc8Hgp'
