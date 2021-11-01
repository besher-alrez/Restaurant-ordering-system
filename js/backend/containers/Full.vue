<template>
    <div class="app">
        <MyAppHeader></MyAppHeader>
        <div class="app-body">
            <Sidebar fixed>
                <div class="sidebar-header">
                    <font-awesome-icon icon="user"></font-awesome-icon
                    >&nbsp;&nbsp;{{ $app.user.name }}
                </div>
                <SidebarNav :nav-items="nav"></SidebarNav>
                <SidebarFooter></SidebarFooter>
                <SidebarMinimizer></SidebarMinimizer>
            </Sidebar>
            <main class="main">
                <breadcrumb :list="$route.matched"></breadcrumb>
                <div class="container-fluid">
                    <router-view :key="$route.name"></router-view>
                </div>
            </main>
            <!--<Aside fixed></Aside>-->
        </div>
        <AppFooter
            :name="$app.appName"
            :editor-name="$app.editorName"
            :editor-site-url="$app.editorSiteUrl"
        ></AppFooter>
    </div>
</template>

<script>
import nav from '../_nav'

import AppFooter from '../components/Footer'
import MyAppHeader from '../components/Header'
import { mapGetters } from 'vuex'

export default {
    name: 'Full',
    components: {
        MyAppHeader,
        AppFooter,
    },
    data() {
        return {
            nav: [],
            interval: null,
        }
    },
    computed: {
        ...mapGetters(['latest_alerts']),
    },
    watch: {
        $route: 'fetchData',
    },
    async created() {
        this.initNav()
        this.fetchData()
        let self = this
        this.interval = setInterval(async function () {
            await self.$store.dispatch('GET_LATEST_ALERTS')
            if (
                self.latest_alerts &&
                self.latest_alerts.data &&
                self.latest_alerts.data.length
            ) {
                self.latest_alerts.data.forEach((item) => {
                    // let noty_title =
                    //     item.type === 'help'
                    //         ? 'Assistance required'
                    //         : 'Invoice request'
                    //
                    // let noty_body =
                    //     item.type === 'help'
                    //         ? `Table #${
                    //               item.table + ' @ ' + item.branch
                    //           } asking for assistance`
                    //         : `Table #${
                    //               item.table + ' @ ' + item.branch
                    //           } request the invoice`
                    //
                    // self.$app.noty[item.type === 'help' ? 'info' : 'warning'](
                    //     `<a href='/admin/alerts'><h3>${noty_title}</h3>${noty_body}</a>`,
                    //     30000
                    // )
                    let data = self.getAlertData(item)
                    self.$bvToast.toast(data.message, {
                        title: data.title,
                        solid: true,
                        to: { name: 'alerts' },
                        variant: data.variant,
                        autoHideDelay: 30000,
                    })
                })
            }
        }, 5000)
    },
    beforeDestroy() {
        // clearInterval(this.interval)
    },
    methods: {
        getAlertData(item) {
            let data = null
            switch (item.type) {
                case 'help':
                    data = {
                        title: 'Assistance required',
                        message: `Table #${
                            item.table + ' @ ' + item.branch
                        } asking for assistance`,
                        variant: 'info',
                    }
                    break
                case 'bill':
                    data = {
                        title: 'Invoice request',
                        message: `Table #${
                            item.table + ' @ ' + item.branch
                        } request the invoice`,
                        variant: 'danger',
                    }
                    break
                case 'new_order':
                    data = {
                        title: 'New order',
                        message: `Table #${
                            item.table + ' @ ' + item.branch
                        } got a new order`,
                        variant: 'success',
                    }
                    break

                case 'new_order_items':
                    data = {
                        title: 'Order changed',
                        message: `The order in table #${
                            item.table + ' @ ' + item.branch
                        } got new items`,
                        variant: 'default',
                    }
                    break
            }
            return data
        },
        initNav() {
            this.nav = nav(
                this.$app,
                this.$i18n,
                this.$store.state.counters.newPostsCount,
                this.$store.state.counters.pendingPostsCount
            )
        },
        async fetchData() {
            await this.$store.dispatch('LOAD_COUNTERS')
            this.initNav()
        },
    },
}
</script>

<style>
.dropdown-item svg {
    width: 20px;
    margin-right: 10px;
    margin-left: -10px;
    color: rgba(0, 40, 100, 0.12);
    text-align: center;
}
.dropdown-item.active svg {
    color: white !important;
}
.file-upload-group .invalid-feedback {
    display: block;
}
.multiselect--active,
.multiselect__content-wrapper {
    z-index: 1030 !important;
}
.multiselect .multiselect__tags {
    border-radius: 0px !important;
    border: 1px solid #c2cfd6 !important;
}
.custom-file-label {
    overflow: hidden;
    white-space: nowrap;
}
.form-fieldset {
    background: #fff4f4;
    border: 1px solid #e9ecef;
    padding: 1rem;
    border-radius: 3px;
    margin-bottom: 1rem;
}
.form-fieldset.take_away {
    background: #fff4f4;
}
.form-fieldset.dine_in {
    background: #cfdbff;
}
.is-invalid .flatpickr-input {
    border-color: #cd201f;
}
.is-invalid .multiselect__tags {
    border-color: #f86c6b !important;
}
.is-invalid .form-control {
    border-color: #f86c6b !important;
}
.is-invalid .custom-file-label {
    border-color: #f86c6b !important;
}
.is-invalid .btn-outline-primary {
    border-color: #f86c6b !important;
}
.pointer_cursor {
    cursor: pointer;
}
.close {
    position: absolute;
    right: 3px;
    top: 0;
    padding: 3px;
}
.app-header {
    padding: 0 !important;
}
@media (max-width: 991.98px) {
    .app-body {
        margin-top: 0 !important;
    }
}
.header-fixed .app-body {
    margin-top: 55px !important;
}
</style>
