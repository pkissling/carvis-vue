import Vue from 'vue'
import Vuex from 'vuex'
import CarsStore from '@/store/modules/cars-store'
import ImagesStore from '@/store/modules/images-store'
import NotificationsStore from '@/store/modules/notifications-store'
import RequestsStore from '@/store/modules/requests-store'
import SentryStore from '@/store/modules/sentry-store'
import UserStore from '@/store/modules/user-store'
import { getModule } from 'vuex-module-decorators'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        cars: CarsStore,
        images: ImagesStore,
        notifications: NotificationsStore,
        requests: RequestsStore,
        sentry: SentryStore,
        user: UserStore,
    }
})

export const carsStore = getModule(CarsStore, store)
export const imagesStore = getModule(ImagesStore, store)
export const notificationsStore = getModule(NotificationsStore, store)
export const requestsStore = getModule(RequestsStore, store)
export const sentryStore = getModule(SentryStore, store)
export const userStore = getModule(UserStore, store)
