export function env() {
  if (process.env.NODE_ENV === 'development') {
    return 'development'
  }

  if( process.env.VUE_APP_NETLIFY_PREVIEW === 'true') {
    return 'deploy-preview'
  }

  return 'production'
}
