<template>
  <component
    :is="modalName"
    :context="modalContext"
  />
</template>

<script lang="ts">
import { modalsStore } from '@/store'
import { Component, Vue} from 'vue-property-decorator'
import DeleteUserModal from '@/components/modals/DeleteUserModal.vue'
import DeleteShareableLinkModal from '@/components/modals/DeleteShareableLinkModal.vue'
import DeleteCarModal from '@/components/modals/DeleteCarModal.vue'
import DeleteRequestModal from '@/components/modals/DeleteRequestModal.vue'
import EditUserModal from '@/components/modals/EditUserModal.vue'
import CreateShareableLinkModal from '@/components/modals/CreateShareableLinkModal.vue'
import CreatedShareableLinkModal from '@/components/modals/CreatedShareableLinkModal.vue'

@Component({ 
  components: { 
    DeleteUserModal,
    DeleteShareableLinkModal,
    DeleteCarModal,
    DeleteRequestModal,
    EditUserModal,
    CreateShareableLinkModal,
    CreatedShareableLinkModal
  } 
})
export default class TheModalHome extends Vue {

  get modal(): ModalContext | null {
    return modalsStore.modalContext
  }

  get modalName(): string | undefined {
    return modalsStore.modalContext?.name
  }

  get modalContext(): unknown {
    return modalsStore.modalContext?.context
  }
}
</script>