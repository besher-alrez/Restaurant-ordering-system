// Vue & axios
import Vue from 'vue'
import '../axios-config'

import 'babel-polyfill'

import vueDebounce from 'vue-debounce'
Vue.use(vueDebounce)

// Vendor plugins components
import { createRouter } from './router'
import { createStore } from './store'
import { createLocales } from '../vue-i18n-config'

import App from './App.vue'
import VueProgressBar from 'vue-progressbar'

import vuetify from './vuetify'
/**
 * JS Settings App
 */
let jsonSettings = document.querySelector(
    '[data-settings-selector="settings-json"]'
)
window.settings = jsonSettings ? JSON.parse(jsonSettings.textContent) : {}

// import Ads from 'vue-google-adsense'

Vue.config.productionTip = false
const options = {
    color: '#20a8d8',
    failedColor: 'red',
    thickness: '2px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300,
    },
    autoRevert: true,
    location: 'top',
    inverse: window.settings.locale === 'ar',
}

Vue.use(VueProgressBar, options)
// Custom components

// Vue.use(require('vue-script2'))

// Vue.use(Ads.Adsense)

export function createApp() {
    const i18n = createLocales(window.settings.locale)
    const store = createStore(window.route)
    // Init router
    const router = createRouter('/', i18n, store)

    /**
     * Server-side named routes function router
     */
    Vue.prototype.$app = {}
    Vue.prototype.$app = window.settings
    Vue.prototype.$app.route = window.route

    router.beforeEach((to, from, next) => {
        document.title = 'Julio Restaurant'
        next()
    })

    const app = new Vue({
        router,
        store,
        i18n,
        vuetify,
        render: (h) => h(App),
    })

    return { app, router, store }
}

// Init App
if (document.getElementById('app') !== null) {
    const { app } = createApp()
    app.$mount('#app')
}
