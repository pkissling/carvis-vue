export const register = (name: string, initFn: (() => void), onLocal: boolean): void => {
    if (process.env.NODE_ENV === 'development' && !onLocal) {
        console.log('Skipping registry of', name)
        return
    }

    console.log('Registering', name)
    initFn()
}
