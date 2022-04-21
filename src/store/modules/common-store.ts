import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { config } from 'vuex-module-decorators'

config.rawError = true

@Module({ namespaced: true, name: 'common' })
export default class CommonStore extends VuexModule {
    loading = false

    @Mutation
    public setLoading(loading: boolean): void {
        this.loading = loading
    }

    public get isLoading(): boolean {
        return this.loading
    }
}
