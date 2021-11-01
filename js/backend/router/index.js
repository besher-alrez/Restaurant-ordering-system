import Vue from 'vue'
import Router from 'vue-router'
import Noty from 'noty'

// Containers
const Full = () => import('../containers/Full')

// Views
const Dashboard = () => import('../views/Dashboard')
const UserProfile = () => import('../views/UserProfile')
const UserForm = () => import('../views/UserForm')
const UserList = () => import('../views/UserList')
const RoleForm = () => import('../views/RoleForm')
const RoleList = () => import('../views/RoleList')

const CategoryForm = () => import('../views/CategoryForm')
const CategoryList = () => import('../views/CategoryList')

const MealForm = () => import('../views/MealForm')
const MealList = () => import('../views/MealList')

const TableForm = () => import('../views/TableForm')
const TableList = () => import('../views/TableList')

const OrderForm = () => import('../views/OrderForm')
const OrderList = () => import('../views/OrderList')

const AlertList = () => import('../views/AlertList')

const PromotionForm = () => import('../views/PromotionForm')
const PromotionList = () => import('../views/PromotionList')

const SettingList = () => import('../views/SettingList')

Vue.use(Router)

export function createRouter(base, i18n, route) {
    const router = new Router({
        mode: 'history',
        base: base,
        linkActiveClass: 'open active',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            {
                path: '/',
                redirect: '/dashboard',
                name: 'home',
                component: Full,
                meta: {
                    label: i18n.t('labels.backend.titles.administration'),
                },
                children: [
                    {
                        path: 'dashboard',
                        name: 'dashboard',
                        component: Dashboard,
                        meta: {
                            label: i18n.t('labels.backend.titles.dashboard'),
                        },
                    },
                    {
                        path: 'user_profile',
                        name: 'user_profile',
                        component: UserProfile,
                        meta: {
                            label: i18n.t(
                                'labels.backend.users.titles.profile'
                            ),
                        },
                    },
                    {
                        path: 'Access/users',
                        component: {
                            render(c) {
                                return c('router-view')
                            },
                        },
                        meta: {
                            label: i18n.t('labels.backend.users.titles.main'),
                        },
                        children: [
                            {
                                path: '/',
                                name: 'users',
                                component: UserList,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.users.titles.index'
                                    ),
                                    permission: 'view users',
                                },
                            },
                            {
                                path: 'create',
                                name: 'users_create',
                                component: UserForm,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.users.titles.create'
                                    ),
                                    permission: 'create users',
                                },
                            },
                            {
                                path: ':id/edit',
                                name: 'users_edit',
                                component: UserForm,
                                props: true,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.users.titles.edit'
                                    ),
                                    permission: 'edit users',
                                },
                            },
                        ],
                    },
                    {
                        path: 'Access/roles',
                        component: {
                            render(c) {
                                return c('router-view')
                            },
                        },
                        meta: {
                            label: i18n.t('labels.backend.roles.titles.main'),
                        },
                        children: [
                            {
                                path: '/',
                                name: 'roles',
                                component: RoleList,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.roles.titles.index'
                                    ),
                                    permission: 'view roles',
                                },
                            },
                            {
                                path: 'create',
                                name: 'roles_create',
                                component: RoleForm,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.roles.titles.create'
                                    ),
                                    permission: 'create roles',
                                },
                            },
                            {
                                path: ':id/edit',
                                name: 'roles_edit',
                                component: RoleForm,
                                props: true,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.roles.titles.edit'
                                    ),
                                    permission: 'edit roles',
                                },
                            },
                        ],
                    },
                    {
                        path: 'categories',
                        component: {
                            render(c) {
                                return c('router-view')
                            },
                        },
                        meta: {
                            label: i18n.t(
                                'labels.backend.categories.titles.main'
                            ),
                        },
                        children: [
                            {
                                path: '/',
                                name: 'categories',
                                component: CategoryList,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.categories.titles.index'
                                    ),
                                    permission: 'view categories',
                                },
                            },
                            {
                                path: 'create',
                                name: 'categories_create',
                                component: CategoryForm,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.categories.titles.create'
                                    ),
                                    permission: 'create categories',
                                },
                            },
                            {
                                path: ':id/edit',
                                name: 'categories_edit',
                                component: CategoryForm,
                                props: true,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.categories.titles.edit'
                                    ),
                                    permission: 'edit categories',
                                },
                            },
                        ],
                    },
                    {
                        path: 'meals',
                        component: {
                            render(c) {
                                return c('router-view')
                            },
                        },
                        meta: {
                            label: i18n.t('labels.backend.meals.titles.main'),
                        },
                        children: [
                            {
                                path: '/',
                                name: 'meals',
                                component: MealList,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.meals.titles.index'
                                    ),
                                    permission: 'view meals',
                                },
                            },
                            {
                                path: 'create',
                                name: 'meals_create',
                                component: MealForm,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.meals.titles.create'
                                    ),
                                    permission: 'create meals',
                                },
                            },
                            {
                                path: ':id/edit',
                                name: 'meals_edit',
                                component: MealForm,
                                props: true,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.meals.titles.edit'
                                    ),
                                    permission: 'edit meals',
                                },
                            },
                        ],
                    },
                    {
                        path: 'tables',
                        component: {
                            render(c) {
                                return c('router-view')
                            },
                        },
                        meta: {
                            label: i18n.t('labels.backend.tables.titles.main'),
                        },
                        children: [
                            {
                                path: '/',
                                name: 'tables',
                                component: TableList,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.tables.titles.index'
                                    ),
                                    permission: 'view tables',
                                },
                            },
                            {
                                path: 'create',
                                name: 'tables_create',
                                component: TableForm,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.tables.titles.create'
                                    ),
                                    permission: 'create tables',
                                },
                            },
                            {
                                path: ':id/edit',
                                name: 'tables_edit',
                                component: TableForm,
                                props: true,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.tables.titles.edit'
                                    ),
                                    permission: 'edit tables',
                                },
                            },
                        ],
                    },
                    {
                        path: 'orders',
                        component: {
                            render(c) {
                                return c('router-view')
                            },
                        },
                        meta: {
                            label: i18n.t('labels.backend.orders.titles.main'),
                        },
                        children: [
                            {
                                path: '/',
                                name: 'orders',
                                component: OrderList,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.orders.titles.index'
                                    ),
                                    permission: 'view orders',
                                },
                            },
                            {
                                path: 'create',
                                name: 'orders_create',
                                component: OrderForm,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.orders.titles.create'
                                    ),
                                    permission: 'create orders',
                                },
                            },
                            {
                                path: ':id/edit',
                                name: 'orders_edit',
                                component: OrderForm,
                                props: true,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.orders.titles.edit'
                                    ),
                                    permission: 'edit orders',
                                },
                            },
                        ],
                    },
                    {
                        path: 'alerts',
                        component: {
                            render(c) {
                                return c('router-view')
                            },
                        },
                        meta: {
                            label: i18n.t('labels.backend.alerts.titles.main'),
                        },
                        children: [
                            {
                                path: '/',
                                name: 'alerts',
                                component: AlertList,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.alerts.titles.index'
                                    ),
                                    permission: 'view alerts',
                                },
                            },
                        ],
                    },
                    {
                        path: 'promotions',
                        component: {
                            render(c) {
                                return c('router-view')
                            },
                        },
                        meta: {
                            label: i18n.t(
                                'labels.backend.promotions.titles.main'
                            ),
                        },
                        children: [
                            {
                                path: '/',
                                name: 'promotions',
                                component: PromotionList,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.promotions.titles.index'
                                    ),
                                    permission: 'view promotions',
                                },
                            },
                            {
                                path: 'create',
                                name: 'promotions_create',
                                component: PromotionForm,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.promotions.titles.create'
                                    ),
                                    permission: 'create promotions',
                                },
                            },
                            {
                                path: ':id/edit',
                                name: 'promotions_edit',
                                component: PromotionForm,
                                props: true,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.promotions.titles.edit'
                                    ),
                                    permission: 'edit promotions',
                                },
                            },
                        ],
                    },
                    {
                        path: 'settings',
                        component: {
                            render(c) {
                                return c('router-view')
                            },
                        },
                        meta: {
                            label: i18n.t(
                                'labels.backend.settings.titles.main'
                            ),
                        },
                        children: [
                            {
                                path: '/',
                                name: 'settings',
                                component: SettingList,
                                meta: {
                                    label: i18n.t(
                                        'labels.backend.settings.titles.index'
                                    ),
                                    permission: 'view settings',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    })

    router.beforeEach(async (to, from, next) => {
        if (
            to.meta.hasOwnProperty('permission') &&
            ((typeof to.meta.permission === 'string' &&
                !router.app.$app.user.can(to.meta.permission)) ||
                (typeof to.meta.permission === 'function' &&
                    !to.meta.permission(router.app.$app)))
        ) {
            new Noty({
                layout: 'topRight',
                theme: 'bootstrap-v4',
                timeout: 4000,
                text: 'Permission denied',
                type: 'error',
            }).show()
            next('/')
        }

        next()
    })
    return router
}
