import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#0f0909',
        secondary: '#0f0909',
        accent: '#4f0007'
      },
    },
  },
});
