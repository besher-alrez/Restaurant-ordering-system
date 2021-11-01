import axios from 'axios'

export function createActions(route) {
    return {
        GET_CATEGORIES: ({ commit }, { branch_id }) => {
            return new Promise((resolve) => {
                axios
                    // .get(route(`web.api.categories`), {
                    .get('/api/web/categories/' + branch_id, {
                        params: {
                            include: 'meals',
                        },
                    })
                    .then((response) => {
                        commit('SET_CATEGORIES', { categories: response.data })

                        resolve()
                    })
            })
        },
        GET_PROMOTIONS: ({ commit }, { branch_id }) => {
            return new Promise((resolve) => {
                axios
                    // .get(route(`web.api.categories`), {
                    .get('/api/web/promotions/' + branch_id)
                    .then((response) => {
                        commit('SET_PROMOTIONS', { promotions: response.data })

                        resolve()
                    })
            })
        },
        // SET_TABLE: ({ commit }, { table }) => {
        //     commit('SET_TABLE_INFO', { table_info: table })
        // },
        async GET_TABLE({ commit }, { table_id }) {
            let table = await axios.get(`/api/web/table/${table_id}`)

            commit('SET_TABLE_INFO', { table_info: table.data })
        },
        async GET_ORDER({ commit }, { table_id }) {
            let order = await axios.get(`/api/web/table/${table_id}/order`)

            commit('SET_ORDER_DETAILS', {
                order_details: order.data,
            })
        },
        async GET_SETTINGS({ commit }) {
            let settings = await axios.get(`/api/web/settings`)

            commit('SET_SETTINGS', {
                settings: settings.data,
            })
        },
        ADD_TO_CART: ({ commit, state }, payload) => {
            if (state.cart[payload.meal.id])
                commit('SET_CART_ITEM', {
                    item: payload.meal,
                    amount: state.cart[payload.meal.id].amount + 1,
                })
            else commit('SET_CART_ITEM', { item: payload.meal, amount: 1 })
        },
        REMOVE_FROM_CART: ({ commit, state }, payload) => {
            if (
                state.cart[payload.meal.id] &&
                state.cart[payload.meal.id].amount > 0
            )
                commit('SET_CART_ITEM', {
                    item: payload.meal,
                    amount: state.cart[payload.meal.id].amount - 1,
                })
            else commit('SET_CART_ITEM', { item: payload.meal, amount: 0 })
        },
        SET_ORDER_TYPE: ({ commit, state }, type) => {
            commit('SET_ORDER_TYPE', { type: type })
        },
    }
}
