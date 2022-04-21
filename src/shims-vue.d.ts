import { Auth0Wrapper } from './auth/auth0-wrapper'
import Vue from 'vue'
import { Route } from 'vue-router';

declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}


declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth0Wrapper;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresRole: Role
    breadCrumbs?: (route?: Route) => void
  }
}