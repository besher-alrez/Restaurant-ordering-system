import axios from 'axios'

export function createActions(route) {
    return {
        LOAD_COUNTERS: ({ commit }) => {
            // commit('SET_COUNTER', { type: 'newPostsCount', counter: 1 })
            // commit('SET_COUNTER', { type: 'pendingPostsCount', counter: 2 })
            // commit('SET_COUNTER', { type: 'publishedPostsCount', counter: 3 })
            // commit('SET_COUNTER', { type: 'activeUsersCount', counter: 4 })
            // commit('SET_COUNTER', { type: 'formSubmissionsCount', counter: 5 })
        },
        GET_USER: ({ commit }) => {
            return new Promise((resolve) => {
                axios.get(route('session_status')).then((response) => {
                    commit('SET_USER', { user: response.data.user })

                    resolve()
                })
            })
        },
        GET_MEALS: ({ commit }) => {
            return new Promise((resolve) => {
                axios
                    // .get(route(`web.api.categories`), {
                    .get('/api/web/categories', {
                        params: {
                            include: 'meals',
                        },
                    })
                    .then((response) => {
                        commit('SET_MEALS', {
                            meals: response.data.map((i) => {
                                return {
                                    category: i.name,
                                    meals: i.meals,
                                    branch_id: i.branch,
                                }
                            }),
                        })

                        resolve()
                    })
            })
        },
        GET_LATEST_ALERTS: ({ commit, state }) => {
            return new Promise((resolve) => {
                let latest_id = state.latest_alerts
                    ? state.latest_alerts.max
                    : ''
                axios
                    .get(`/admin/alerts/latest?id=${latest_id}`)
                    .then((response) => {
                        commit('SET_LATEST_ALERTS', { alerts: response.data })
                        resolve()
                    })
            })
        },
    }
}
