<template>
  <v-speed-dial
    fab
    fixed
    bottom
    right
  >
    <template v-slot:activator>
      <v-btn
        @click="createClicked"
        :loading="loading"
        color="primary"
        fab
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
  props: [
    'loading',
  ],
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