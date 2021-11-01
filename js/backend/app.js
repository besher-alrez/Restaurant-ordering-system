import './load-client-scripts'

// Vue & axios
import Vue from 'vue'
import '../axios-config'

import 'babel-polyfill'
import VueFlags from '@growthbunker/vueflags'

// Vendor plugins components
import '../vendor/coreui/components'
import DataTable from './components/Plugins/DataTable'
import DateTimePicker from './components/Plugins/DateTimePicker'
// import Switch from './components/Plugins/Switch'
// import vSelect from './components/Plugins/Select'
// import VueSlimScroll from 'vue-slimscroll'

import { createRouter } from './router'
import { createStore } from './store'
import { createLocales } from '../vue-i18n-config'

import App from './App.vue'
import Noty from 'noty'
import VueProgressBar from 'vue-progressbar'
import {
    FontAwesomeIcon,
    FontAwesomeLayers,
} from '@fortawesome/vue-fontawesome'

// import { Ziggy } from '../vendor/laravel-routes.generated'
// import route from '../../../vendor/tightenco/ziggy/src/js/route'

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
    inverse: false,
}

Vue.use(VueProgressBar, options)
// Vue.use(VueSlimScroll)
Vue.use(VueFlags, {
    // Specify the path of the folder where the flags are stored.
    iconPath: '/images/flags/',
})

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

// Bootstrap Vue
// import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
// Vue.use(BootstrapVue)

import {
    BModal,
    BCard,
    BCol,
    BRow,
    BTable,
    BBadge,
    BButton,
    BButtonGroup,
    BLink,
    BDropdown,
    BDropdownItem,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownHeader,
    BForm,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BFormSelect,
    BInputGroupAppend,
    BInputGroupPrepend,
    BCollapse,
    BCardBody,
    BCardHeader,
    BListGroup,
    BListGroupItem,
    BFormCheckbox,
    BFormCheckboxGroup,
    BFormRadio,
    BFormRadioGroup,
    BInputGroupText,
    BPagination,
    BFormTextarea,
    BFormFile,
    BCardGroup,
    VBTooltip,
    VBToggle,
    ToastPlugin,
} from 'bootstrap-vue'
Vue.component('b-input-group-text', BInputGroupText)
Vue.component('b-form-radio', BFormRadio)
Vue.component('b-form-textarea', BFormTextarea)
Vue.component('b-card-group', BCardGroup)
Vue.component('b-form-file', BFormFile)
Vue.component('b-form-radio-group', BFormRadioGroup)
Vue.component('b-form-checkbox', BFormCheckbox)
Vue.component('b-form-checkbox-group', BFormCheckboxGroup)
Vue.component('b-pagination', BPagination)
Vue.component('b-card-body', BCardBody)
Vue.component('b-card-header', BCardHeader)
Vue.component('b-list-group', BListGroup)
Vue.component('b-list-group-item', BListGroupItem)
Vue.component('b-modal', BModal)
Vue.component('b-card', BCard)
Vue.component('b-col', BCol)
Vue.component('b-row', BRow)
Vue.component('b-table', BTable)
Vue.component('b-badge', BBadge)
Vue.component('b-btn', BButton)
Vue.component('b-btn-group', BButtonGroup)
Vue.component('b-link', BLink)
Vue.component('b-dropdown', BDropdown)
Vue.component('b-dropdown-item', BDropdownItem)
Vue.component('b-navbar-nav', BNavbarNav)
Vue.component('b-nav-item-dropdown', BNavItemDropdown)
Vue.component('b-dropdown-header', BDropdownHeader)
Vue.component('b-form-group', BFormGroup)
Vue.component('b-form', BForm)
Vue.component('b-input-group', BInputGroup)
Vue.component('b-form-input', BFormInput)
Vue.component('b-form-select', BFormSelect)
Vue.component('b-input-group-append', BInputGroupAppend)
Vue.component('b-input-group-prepend', BInputGroupPrepend)
Vue.component('b-collapse', BCollapse)
Vue.use(ToastPlugin)
Vue.directive('b-tooltip', VBTooltip)
Vue.directive('b-toggle', VBToggle)

// vue-select
// Vue.component('v-select', vSelect)

import vueDebounce from 'vue-debounce'
Vue.use(vueDebounce)

// Custom components
// Vue.component('c-switch', Switch)
Vue.component('p-datetimepicker', DateTimePicker)
Vue.component('b-datatable', DataTable)

export function createApp() {
    // Init router and store
    const i18n = createLocales(window.settings.locale)
    const router = createRouter(
        window.settings.adminHomePath,
        i18n,
        window.route
    )
    const store = createStore(window.route)

    /**
     * Server-side settings
     */
    Vue.prototype.$app = window.settings
    Vue.prototype.$app.available_locales = Object.keys(window.settings.locales)

    /**
     * Server-side named routes function router
     */
    Vue.prototype.$app.route = window.route
    // Vue.prototype.$app.route = function (name, params, absolute) {
    //     return route(name, params, absolute, Ziggy)
    // }
    /**
     * Client-side permissions
     */
    if (Vue.prototype.$app.user) {
        Vue.prototype.$app.user.can = (permission) => {
            if (
                Vue.prototype.$app.user.id === 1 ||
                Vue.prototype.$app.permissions.includes('access all backend')
            ) {
                return true
            }
            return Vue.prototype.$app.permissions.includes(permission)
        }

        Vue.prototype.$app.user.isSuperAdmin = () => {
            return (
                Vue.prototype.$app.user.id === 1 ||
                Vue.prototype.$app.permissions.includes('access all backend')
            )
        }
    }

    let objectToFormData = (model, form, namespace) => {
        let formData = form || new FormData()

        if (model == null) {
            formData.append(namespace, '')
        } else if (typeof model === 'string' || typeof model === 'number') {
            formData.append(namespace, model.toString())
            return formData
        }

        for (let propertyName in model) {
            if (!model.hasOwnProperty(propertyName)) {
                continue
            }
            let formKey = namespace
                ? `${namespace}[${propertyName}]`
                : propertyName
            if (model[propertyName] instanceof Date) {
                formData.append(formKey, model[propertyName].toISOString())
            } else if (model[propertyName] instanceof Array) {
                if (!model[propertyName].length) {
                    formData.append(formKey, '')
                }
                model[propertyName].forEach((element, index) => {
                    const tempFormKey = `${formKey}[${index}]`
                    objectToFormData(element, formData, tempFormKey)
                })
            } else if (
                typeof model[propertyName] === 'object' &&
                !(model[propertyName] instanceof File)
            ) {
                objectToFormData(model[propertyName], formData, formKey)
            } else if (model[propertyName] instanceof File) {
                formData.append(formKey, model[propertyName])
            } else {
                formData.append(formKey, model[propertyName].toString())
            }
        }
        return formData
    }

    Vue.prototype.$app.objectToFormData = objectToFormData

    /**
     * Notifications
     */
    let noty = (type, text, to = 4000) => {
        new Noty({
            layout: 'topRight',
            theme: 'bootstrap-v4',
            timeout: to,
            text,
            type,
        }).show()
    }

    Vue.prototype.$app.noty = {
        alert: (text, to = 4000) => {
            noty('alert', text, to)
        },
        success: (text, to = 4000) => {
            noty('success', text, to)
        },
        error: (text, to = 4000) => {
            noty('error', text, to)
        },
        warning: (text, to = 4000) => {
            noty('warning', text, to)
        },
        info: (text, to = 4000) => {
            noty('info', text, to)
        },
    }

    Vue.prototype.$app.error = (error) => {
        if (error instanceof String) {
            noty('error', error)
            return
        }

        if (error.hasOwnProperty('response') && error.response) {
            // Not allowed error
            if (error.response.status === 403) {
                // window.location = window.route('home')
                router.push({ name: 'home' })
                noty('error', i18n.t('exceptions.unauthorized'))
                return
            }

            if (error.response.status === 404) {
                noty('error', i18n.t('exceptions.not_found'))
                return
            }

            if (error.response.status === 401) {
                // noty('error', i18n.t('exceptions.login_again'))
                window.location = window.route('login')
                return
            }

            // Domain error
            if (
                error.response.data.error !== undefined ||
                (error.response.data.hasOwnProperty('message') &&
                    error.response.data.message !== undefined)
            ) {
                noty('error', error.response.data.message)
                return
            }
        } else if (error.response === undefined) {
            return
        }

        // Generic error
        noty('error', i18n.t('exceptions.general'))
    }

    router.beforeEach((to, from, next) => {
        document.title = `${to.meta.label} | ${window.settings.appName}`
        next()
    })

    const app = new Vue({
        router,
        store,
        i18n,
        render: (h) => h(App),
    })

    return { app, router, store }
}

// Init App
if (document.getElementById('app') !== null) {
    const { app } = createApp()
    app.$mount('#app')
}
