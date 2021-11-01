import Vue from 'vue'
import Vuex from 'vuex'

import { createActions } from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export function createStore(route) {
    const actions = createActions(route)

    return new Vuex.Store({
        state: {
            cart: {},
            categories: null,
            order_type: null,
            table_info: null,
            order_details: null,
            promotions: null,
            settings: null,
        },
        actions,
        mutations,
        getters: {
            categories: (state) => state.categories,
            table_info: (state) => state.table_info,
            cart: (state) => state.cart,
            order_type: (state) => state.order_type,
            order_details: (state) => state.order_details,
            promotions: (state) => state.promotions,
            settings: (state) => state.settings,
        },
    })
}
