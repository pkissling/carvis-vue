export const appsyncUrl = () => {
  if(process.env.NODE_ENV === 'development') {
    return 'https://fnh2bjixzbfafjf6v3xv3c25bq.appsync-api.eu-west-1.amazonaws.com/graphql'
  } else {
    return 'https://p5nldcfbbbhr3ejxiy7gxgy7yi.appsync-api.eu-west-1.amazonaws.com/graphql'
  }
}

export const appsyncRegion = 'eu-west-1'

export const auth0Domain = 'carvis.eu.auth0.com'
export const auth0ClientId = 'ukQnXHJoRrZwGf85Uh4Jpk8V932GsfKt'
