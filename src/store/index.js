import Vue from 'vue'
import Vuex from 'vuex'
import cars from './stores/cars-store'
import images from './stores/images-store'
import notifications from './stores/notifications-store'
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
