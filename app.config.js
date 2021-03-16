export const appsyncUrl = () => {
  if(process.env.NODE_ENV === 'development') {
    return 'https://fdi2im3g7ja6dnkhzxnyfjdxpq.appsync-api.eu-west-1.amazonaws.com/graphql'
  } else {
    return 'https://lch5tvepkfcsznx6xdqpthnxfa.appsync-api.eu-west-1.amazonaws.com/graphql'
  }
}

export const appsyncRegion = 'eu-west-1'

export const auth0Domain = 'blumenerd.eu.auth0.com'
export const auth0ClientId = 'S2yHjIXzCcEGctf6EZpiaXFBNCEc8Hgp'
