import { Auth0Wrapper } from './auth/auth0-wrapper'
import Vue from 'vue'

declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}


declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth0Wrapper;
  }
}