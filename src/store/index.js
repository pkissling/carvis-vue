import Vue from 'vue'
import Vuex from 'vuex'
import cars from './stores/cars'
import images from './stores/images'
import notifications from './stores/notifications'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    cars,
    images,
    notifications
  },
  plugins: [new VuexPersistence().plugin]
})
