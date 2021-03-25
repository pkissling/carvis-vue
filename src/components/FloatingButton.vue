<template>
  <v-speed-dial
    fab
    fixed
    bottom
    right
  >
    <template v-slot:activator>
      <v-btn
        :loading="loading"
        color="primary"
        fab
        @click="createClicked"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </template>
  </v-speed-dial>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
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