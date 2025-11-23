// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import VueDatePicker from '@vuepic/vue-datepicker';

// CSS
import '@vuepic/vue-datepicker/dist/main.css'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .component('VueDatePicker', VueDatePicker);
}
