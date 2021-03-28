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
        secondary: '#5a5a5a',
        accent: '#111111'
      },
    },
  },
  lang: {
    locales: { de },
    current: 'de',
  },
});
