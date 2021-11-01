import Vue from 'vue'
// import Vuetify from 'vuetify'
import Vuetify from 'vuetify/lib'
// import 'vuetify/dist/vuetify.min.css'

import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
/**
 * JS Settings App
 */
let jsonSettings = document.querySelector(
    '[data-settings-selector="settings-json"]'
)
window.settings = jsonSettings ? JSON.parse(jsonSettings.textContent) : {}

Vue.use(Vuetify)

const opts = { rtl: window.settings.locale === 'ar' }

export default new Vuetify(opts)
