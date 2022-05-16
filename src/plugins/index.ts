export const register = (name: string, initFn: (() => void), onLocal: boolean): void => {
    if (process.env.NODE_ENV === 'development' && !onLocal) {
        // eslint-disable-next-line no-console
        console.log('Skipping registry of', name)
        return
    }

    initFn()
}
