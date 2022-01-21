export const register = (name: string, initFn: Function, onLocal: boolean) => {
    if (process.env.NODE_ENV === 'development' && !onLocal) {
        console.log('Skipping registry of', name)
        return
    }

    console.log('Registering', name)
    initFn()
}
