import Vue from 'vue'

export default {
    SET_CATEGORIES: (state, { categories }) => {
        state.categories = categories
    },
    SET_PROMOTIONS: (state, { promotions }) => {
        state.promotions = promotions
    },
    SET_CART_ITEM: (state, { item, amount }) => {
        Vue.set(state.cart, item.id, { meal: item, amount: amount })
    },
    SET_ORDER_TYPE: (state, { type }) => {
        state.order_type = type
    },
    SET_TABLE_INFO: (state, { table_info }) => {
        state.table_info = table_info
    },
    SET_ORDER_DETAILS: (state, { order_details }) => {
        state.order_details = order_details
    },
    SET_SETTINGS: (state, { settings }) => {
        state.settings = settings
    },
    RESET_CART_ITEM: (state) => {
        state.cart = {}
    },
}
