export default (app, i18n) => {
    return [
        {
            name: i18n.t('labels.backend.titles.dashboard'),
            url: '/dashboard',
            icon: 'fa.tachometer-alt',
            access: true,
        },
        {
            divider: true,
            access: true,
        },
        {
            name: i18n.t('labels.backend.categories.titles.main'),
            url: '/categories',
            icon: 'fa.tags',
            access: app.user.can('view categories'),
        },
        {
            name: i18n.t('labels.backend.meals.titles.main'),
            url: '/meals',
            icon: 'fa.hamburger',
            access: app.user.can('view meals'),
        },
        {
            divider: true,
            access: true,
        },
        {
            name: i18n.t('labels.backend.tables.titles.main'),
            url: '/tables',
            icon: 'fa.utensils',
            access: app.user.can('view tables'),
        },
        {
            divider: true,
            access: true,
        },
        {
            name: i18n.t('labels.backend.orders.titles.main'),
            url: '/orders',
            icon: 'fa.receipt',
            access: app.user.can('view orders'),
        },
        {
            name: i18n.t('labels.backend.alerts.titles.main'),
            url: '/alerts',
            icon: 'fa.bell',
            access: app.user.can('view alerts'),
        },
        {
            divider: true,
            access: true,
        },
        {
            name: i18n.t('labels.backend.promotions.titles.main'),
            url: '/promotions',
            icon: 'fa.ad',
            access: app.user.can('view promotions'),
        },
        {
            divider: true,
            access: true,
        },
        {
            name: i18n.t('labels.backend.sidebar.access'),
            url: '/Access',
            icon: 'fa.user-shield',
            access: app.user.can('view users') || app.user.can('view roles'),
            children: [
                {
                    name: i18n.t('labels.backend.users.titles.main'),
                    url: '/Access/users',
                    icon: 'fa.users',
                    access: app.user.can('view users'),
                },
                {
                    name: i18n.t('labels.backend.roles.titles.main'),
                    url: '/Access/roles',
                    icon: 'fa.user-shield',
                    access: app.user.can('view roles'),
                },
            ],
        },
        {
            divider: true,
            access: true,
        },
        {
            name: i18n.t('labels.backend.settings.titles.main'),
            url: '/settings',
            icon: 'fa.tools',
            access: app.user.can('view settings'),
        },
    ]
}
