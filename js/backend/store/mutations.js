export default {
    SET_COUNTER: (state, { type, counter }) => {
        state.counters[type] = counter
    },
    SET_USER: (state, { user }) => {
        state.user = user
    },
    SET_MEALS: (state, { meals }) => {
        state.meals = meals
    },
    SET_LATEST_ALERTS: (state, { alerts }) => {
        state.latest_alerts = alerts
    },
}
