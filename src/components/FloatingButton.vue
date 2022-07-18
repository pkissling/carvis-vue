<template>
  <v-speed-dial
    fab
    fixed
    bottom
    right
    :value="fabVisible"
  >
    <template #activator>
      <v-fab-transition>
        <v-btn
          v-if="operation"
          :loading="loading"
          color="primary"
          fab
          @click.stop="invokeAction"
        >
          <v-icon>
            {{ operation.icon }}
          </v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
  </v-speed-dial>
</template>

<script lang="ts">
import { modalsStore, userStore } from '@/store'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class FloatingButton extends Vue {
  loading = false
  fabVisible = true

  get operation(): { icon: string, action: () => Promise<unknown> } | undefined {
    if (this.$route.path === '/cars') {
      return { icon: 'mdi-plus', action: () => this.$router.push({ path: '/cars/add' })}
    }

    if (this.$route.path === '/requests') {
      return { icon: 'mdi-plus', action: () => this.$router.push({ path: '/requests/add' })}
    }

    if (this.$route.name === 'CarDetailPage' && this.$route.params.carId && userStore.isAdmin) {
      return {
        icon: 'mdi-share-variant-outline',
        action: () => modalsStore.open({ name: 'CreateShareableLinkModal', context: this.$route.params.carId }) 
      }
    }
  }

  @Watch('operation')
  operationChanged(operation?: { icon: string, action: () => Promise<unknown> }) {
    if (operation) {
      this.fabVisible = true
    } else {
      this.fabVisible = false
    }
  }

  async invokeAction (): Promise<unknown> {
    if (!this.operation) {
      return
    }
    this.loading = true
    try {
      return await this.operation.action()
    } finally {
      this.loading = false
    }
  }
}
</script>
