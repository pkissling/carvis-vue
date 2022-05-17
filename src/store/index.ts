import Vue from 'vue'
import Vuex from 'vuex'
import CarsStore from '@/store/modules/cars-store'
import NotificationsStore from '@/store/modules/notifications-store'
import RequestsStore from '@/store/modules/requests-store'
import SentryStore from '@/store/modules/sentry-store'
import UserStore from '@/store/modules/user-store'
import UserManagementStore from '@/store/modules/user-management-store'
import { getModule } from 'vuex-module-decorators'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        cars: CarsStore,
        notifications: NotificationsStore,
        requests: RequestsStore,
        sentry: SentryStore,
        user: UserStore,
        userManagement: UserManagementStore
    }
})

export const carsStore = getModule(CarsStore, store)
export const notificationsStore = getModule(NotificationsStore, store)
export const requestsStore = getModule(RequestsStore, store)
export const sentryStore = getModule(SentryStore, store)
export const userStore = getModule(UserStore, store)
export const userManagementStore = getModule(UserManagementStore, store)
