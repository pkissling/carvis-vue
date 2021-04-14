import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework'
import '@mdi/font/css/materialdesignicons.css'
import de from 'vuetify/es5/locale/de'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#660000',
        secondary: '#DDDDDD',
        accent: '#111111'
      },
    },
  },
  lang: {
    locales: { de },
    current: 'de',
  },
});
