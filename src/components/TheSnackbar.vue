<template>
  <v-snackbar
    v-model="show"
    :color="severity"
    :timeout="timeout"
    outlined
    bottom
    transition="scale-transition"
    elevation="24"
  >
    {{ message }}

    <template #action="{ attrs }">
      <v-btn
        icon
        v-bind="attrs"
        :color="severity"
        @click="show = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { notificationsStore } from '@/store'

@Component
export default class TheSnackbar extends Vue {
  timeout = 10000

  get message(): string | null {
    return notificationsStore.message
  }

  get severity(): string | null {
      return notificationsStore.severity
  }

  get show(): boolean{
    return notificationsStore.show
  }

  set show(_: boolean) {
    notificationsStore.dismiss()
  }
}
</script>
