import Vue from 'vue'
import Router from 'vue-router'
// import Meta from 'vue-meta'

// Containers

// Views
import Full from '../containers/Full'
import Welcome from '../views/Welcome'
import NotFound from '../views/NotFound'
import Categories from '../views/Categories'
import Meals from '../views/Meals'
import Search from '../views/Search'
import Checkout from '../views/Checkout'
import Promotion from '../views/Promotion'
import axios from 'axios'

Vue.use(Router)
// Vue.use(Meta)

export function createRouter(base, i18n, store) {
    const router = new Router({
        mode: 'history',
        base: base,
        routes: [
            {
                // path: '/:table_id(\\d+)',
                path:
                    '/:table_id([0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12})',
                redirect: { name: 'welcome' },
                name: 'home',
                component: Full,
                // meta: {
                //     label: i18n.t('labels.frontend.pages.categories'),
                // },
                children: [
                    {
                        path: 'search',
                        name: 'search',
                        component: Search,
                        props: true,
                        // meta: {
                        //     label: i18n.t('labels.frontend.pages.search'),
                        // },
                    },
                    {
                        path: 'welcome',
                        name: 'welcome',
                        component: Welcome,
                        // meta: {
                        //     label: i18n.t('labels.frontend.pages.welcome'),
                        // },
                    },
                    {
                        path: 'categories',
                        name: 'categories',
                        component: Categories,
                        // meta: {
                        //     label: i18n.t('labels.frontend.pages.categories'),
                        // },
                    },
                    {
                        path: 'meals',
                        name: 'meals',
                        component: Meals,
                        props: true,
                        // meta: {
                        //     label: i18n.t('labels.frontend.pages.meals'),
                        // },
                    },
                    {
                        path: 'checkout',
                        name: 'checkout',
                        component: Checkout,
                        // meta: {
                        //     label: i18n.t('labels.frontend.pages.meals'),
                        // },
                    },
                    {
                        path: 'promotion',
                        name: 'promotion',
                        component: Promotion,
                        props: true,
                        // meta: {
                        //     label: i18n.t('labels.frontend.pages.meals'),
                        // },
                    },
                ],
            },
            {
                path: '*',
                name: 'NotFoundPage',
                component: NotFound,
            },
        ],
    })

    router.beforeEach(async (to, from, next) => {
        if (
            to.name === 'NotFoundPage' ||
            (store.getters.table_info && store.getters.order_type)
        ) {
            next()
            return
        }

        try {
            await store.dispatch('GET_TABLE', {
                table_id: to.params.table_id,
            })

            await store.dispatch('GET_ORDER', {
                table_id: to.params.table_id,
            })

            if (!store.getters.order_type && to.name !== 'welcome') {
                next(`${store.getters.table_info.guid}/welcome`)
                return
            }
        } catch (e) {
            next('/NotFound')
        }

        next()
    })

    return router
}
