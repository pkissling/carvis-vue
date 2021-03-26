<template>
  <v-speed-dial
    fab
    fixed
    bottom
    right
  >
    <template v-slot:activator>
      <v-fab-transition>
        <v-btn
          v-show="show"
          :loading="loading"
          color="primary"
          fab
          @click="createClicked"
        >
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
  </v-speed-dial>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      expanded: false
    }
  },
  methods: {
    createClicked () {
      this.$emit('create-clicked')
    }
  }
}
</script>