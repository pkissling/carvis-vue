import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Vuetify from 'vuetify'
import de from 'vuetify/src/locale/de'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#660000',
                secondary: '#DDDDDD',
                accent: '#111111',
            },
        },
    },
    lang: {
        locales: { de },
        current: 'de',
    },
})
