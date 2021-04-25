import Vue from 'vue'
import Vuex from 'vuex'
import notifications from './stores/notifications'
import images from './stores/images'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notifications,
    images
  },
  plugins: [new VuexPersistence().plugin]
})
