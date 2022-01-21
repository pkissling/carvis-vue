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

    <template v-slot:action="{ attrs }">
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

<script>
import { notificationsStore } from '@/store'

export default {
  data () {
    return {
      timeout: 10000
    }
  },

  computed: {
    message() {
      return notificationsStore.getMessage
    },

    severity() {
      return notificationsStore.getSeverity
    },

    show: {
      get() {
        return notificationsStore.isShow
      },
      set() {
        notificationsStore.dismiss()
      }
    }
  },

  methods: {
    onClick() {
      notificationsStore.setShow(false)
    }
  }
}
</script>