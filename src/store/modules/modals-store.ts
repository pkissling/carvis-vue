import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { config } from 'vuex-module-decorators'

config.rawError = true

@Module({ namespaced: true, name: 'modals' })
export default class ModalsStore extends VuexModule {
    modalContext: ModalContext | null = null

    @Action
    public async open(modalContext: ModalContext): Promise<void> {
        this.setModalContext(modalContext)
    }

    @Action
    public async close(): Promise<void> {
        this.setModalContext(null)
    }

    @Mutation
    public setModalContext(modalContext: ModalContext | null): void {
        this.modalContext = modalContext
    }
}
