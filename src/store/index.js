import Vue from 'vue'
import Vuex from 'vuex'
import notifications from './stores/notifications'
import images from './stores/images'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notifications,
    images
  }
})
