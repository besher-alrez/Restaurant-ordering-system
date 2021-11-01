import axios from 'axios'

/**
 * Axios config
 */
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.timeout = 5000

let token = document.head.querySelector('meta[name="csrf-token"]')

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
}
axios.interceptors.response.use(null, (error) => {
    if (error.config && error.response && error.response.status === 419) {
        console.log(error.response, error.response.status)
        return refreshAppTokens().then(() => {
            error.config.headers['X-CSRF-TOKEN'] =
                axios.defaults.headers.common['X-CSRF-TOKEN']

            return axios.request(error.config)
        })
    }

    return Promise.reject(error)
})

let refreshAppTokens = () => {
    // Retrieve a new page with a fresh token
    return axios.get('/admin/refresh_csrf').then(({ data }) => {
        token = data.csrfToken
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token
        document
            .querySelector('meta[name=csrf-token]')
            .setAttribute('content', token)
    })
}

export { axios }
