import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Vuetify from 'vuetify'
import de from 'vuetify/src/locale/de'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#FF4C29',
                secondary: '#2C394B',
                accent: '#334756',
                background: '#082032',
            }
        }
    },
    lang: {
        locales: { de },
        current: 'de',
    },
})
