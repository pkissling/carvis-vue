export function register(vue, name, initFn, onLocal) {
  if (process.env.NODE_ENV === 'development' && !onLocal) {
    console.log('Skipping registry of', name)
    return
  }

  console.log('Registering', name)
  initFn(vue)
}