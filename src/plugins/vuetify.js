import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework'
import '@mdi/font/css/materialdesignicons.css'
import de from 'vuetify/es5/locale/de'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#4f0007',
        secondary: '#eeeee4',
        accent: '#0f0909'
      },
    },
  },
  lang: {
    locales: { de },
    current: 'de',
  },
});
