export class Auth0User {
    sub?: string
    name?: string
    nickname?: string
    picture?: string
    updatedAt?: string
    email?: string
    emailVerified?: boolean

    provider?: string
    id?: string

    givenName?: string
    familyName?: string
    locale?: string
    roles?: string[];
    [key: string]: string | boolean | string[] | undefined

    constructor(auth0User?: {
        [key: string]: string | string[] | boolean | undefined
    }) {
        if (!auth0User) return
        for (const key in auth0User) {
            this[key] = auth0User[key]
        }

        this.sub = auth0User.sub as string
        this.provider = this.sub.split('|')[0]
        this.id = this.sub.split('|')[1]
        this.roles = auth0User['https://carvis.cloud/roles'] as string[]
    }
}
