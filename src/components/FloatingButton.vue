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
    }
  },
  data () {
    return {
      expanded: false,
      show: true,
      lastScrollTop: 0
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    createClicked () {
      this.$emit('create-clicked')
    },
    handleScroll (event) {
      var st = window.pageYOffset || document.documentElement.scrollTop
      this.show = st > this.lastScrollTop
      this.lastScrollTop = st <= 0 ? 0 : st
    }
  }
}
</script>