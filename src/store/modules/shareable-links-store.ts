import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { config } from 'vuex-module-decorators'
import AdminShareableLinksApi from '@/api/admin-shareable-links-api'

config.rawError = true

const admiShareableLinksApi = new AdminShareableLinksApi()

@Module({ namespaced: true, name: 'shareableLinks' })
export default class ShareableLinksStore extends VuexModule {
    shareableLinks: ShareableLinkDto[] = []

    @Action({ commit: 'setShareableLinks' })
    public async fetchAllShareableLinks(): Promise<ShareableLinkDto[]> {
        return await admiShareableLinksApi.fetchAllShareableLinks()
    }

    @Action({ commit: 'setShareableLinks' })
    public async deleteShareableLink(reference: string): Promise<ShareableLinkDto[]> {
        await admiShareableLinksApi.deleteShareableLink(reference)
        return await admiShareableLinksApi.fetchAllShareableLinks()
    }

    @Mutation
    public setShareableLinks(shareableLinks: ShareableLinkDto[]): void {
        this.shareableLinks = shareableLinks
    }
}
