import Vue from 'vue'
import Vuex from 'vuex'
import cars from './stores/cars-store'
import common from './stores/common-store'
import images from './stores/images-store'
import notifications from './stores/notifications-store'
import requests from './stores/requests-store'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    cars,
    common,
    images,
    notifications,
    requests
  },
  plugins: [new VuexPersistence().plugin]
})
