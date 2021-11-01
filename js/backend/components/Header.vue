<template>
    <AppHeader fixed style="position: fixed">
        <SidebarToggler class="d-lg-none" display="md" mobile></SidebarToggler>
        <b-link class="navbar-brand" to="#" style="background-color: #2f353a">
            <img
                class="navbar-brand-full"
                src="/images/logo.png"
                width="100"
                height="50"
                alt="LOGO"
            />
            <img
                class="navbar-brand-minimized"
                src="/images/logo.png"
                width="30"
                height="30"
                alt="LOGO"
            />
        </b-link>
        <SidebarToggler class="d-md-down-none" display="lg"></SidebarToggler>
        <b-badge
            class="m-2 d-md-block d-none"
            v-if="$app.user.branch_id"
            variant="primary"
            ><h5>
                Selected Branch: {{ branches[$app.user.branch_id].label }}
            </h5></b-badge
        >
        <b-dropdown
            class="m-2 d-md-block d-none"
            v-else
            :text="`Selected Branch: ${
                branches.find((o) => o.value === $app.selected_branch).label
            }`"
            variant="primary"
        >
            <b-dropdown-item
                v-for="branch in branches"
                :href="`/admin/change_branch?branch=${branch.value}`"
                :key="branch.label"
                >{{ branch.label }}</b-dropdown-item
            >
        </b-dropdown>

        <b-navbar-nav class="ml-auto">
            <!--            <HeaderDropdown-->
            <!--                right-->
            <!--                class="px-3 d-none d-md-block"-->
            <!--                v-if="users.length > 1"-->
            <!--            >-->
            <!--                <template slot="header">-->
            <!--                    <span class="d-md-down-none">-->
            <!--                        <font-awesome-icon icon="lock"></font-awesome-icon>-->
            <!--                    </span>-->
            <!--                </template>-->
            <!--                <template slot="dropdown">-->
            <!--                    <b-form-input v-model="search" type="text"></b-form-input>-->
            <!--                    <b-dropdown-item-->
            <!--                        v-for="(item, index) in users_list"-->
            <!--                        :href="-->
            <!--                            $app.route('users.impersonate', { user: item.id })-->
            <!--                        "-->
            <!--                        :key="index"-->
            <!--                    >-->
            <!--                        <font-awesome-icon-->
            <!--                            class="text-primary"-->
            <!--                            icon="user"-->
            <!--                        ></font-awesome-icon>-->
            <!--                        {{ item.name }}-->
            <!--                    </b-dropdown-item>-->
            <!--                </template>-->
            <!--            </HeaderDropdown>-->

            <HeaderDropdown
                right
                no-caret
                v-if="$app.available_locales.length > 1"
            >
                <template slot="header">
                    <font-awesome-icon
                        icon="language"
                        size="2x"
                    ></font-awesome-icon>
                </template>
                <template slot="dropdown">
                    <b-dropdown-item
                        :key="index"
                        v-for="(locale, index) in $app.locales"
                        :hreflang="index"
                        :href="`${$app.adminHomePath}/${index}`"
                        :disabled="index === $app.locale"
                    >
                        <gb-flag :code="locale.flag" size="small"></gb-flag>
                        <span class="ml-3">
                            {{ locale.native }}
                        </span>
                    </b-dropdown-item>
                </template>
            </HeaderDropdown>

            <HeaderDropdown right no-caret v-if="create_list.length">
                <template slot="header">
                    <font-awesome-icon
                        size="lg"
                        icon="plus-circle"
                    ></font-awesome-icon>
                </template>
                <template slot="dropdown">
                    <b-dropdown-item
                        v-for="(item, index) in create_list"
                        :to="item.to"
                        :key="index"
                    >
                        <font-awesome-icon
                            class="text-primary"
                            v-if="item.icon.match(/^fa\./)"
                            :icon="item.icon.split('.')[1]"
                        ></font-awesome-icon>
                        <i :class="item.icon + ' text-primary'" v-else></i>
                        {{ item.text }}
                    </b-dropdown-item>
                </template>
            </HeaderDropdown>

            <HeaderDropdown right no-caret class="d-md-none d-block">
                <template slot="header">
                    <font-awesome-icon
                        icon="building"
                        size="lg"
                    ></font-awesome-icon>
                </template>
                <template slot="dropdown">
                    <b-dropdown-header class="text-center">
                        <span class="h5">
                            {{
                                $app.user.branch_id &&
                                branches[$app.user.branch_id]
                                    ? branches[$app.user.branch_id].label
                                    : `${
                                          branches.find(
                                              (o) =>
                                                  o.value ===
                                                  $app.selected_branch
                                          ).label
                                      }`
                            }}
                        </span>
                    </b-dropdown-header>
                    <template v-if="!$app.user.branch_id">
                        <b-dropdown-item
                            v-for="branch in branches"
                            :href="`/admin/change_branch?branch=${branch.value}`"
                            :key="branch.label"
                        >
                            <font-awesome-icon
                                icon="user"
                                class="text-primary"
                            ></font-awesome-icon
                            >&nbsp;&nbsp;{{ branch.label }}</b-dropdown-item
                        >
                    </template>
                </template>
            </HeaderDropdown>

            <HeaderDropdown right no-caret>
                <template slot="header">
                    <font-awesome-icon
                        icon="cogs"
                        size="lg"
                    ></font-awesome-icon>
                </template>
                <template slot="dropdown">
                    <b-dropdown-header class="text-center">
                        <span class="h5">
                            {{ this.$app.user.name.substring(0, 12) }}
                        </span>
                    </b-dropdown-header>
                    <!--<b-dropdown-item to="/admin/user_profile" :href="$app.route('user.account')">-->
                    <b-dropdown-item
                        :to="{ name: 'user_profile' }"
                        v-if="$app.user.can('change password')"
                    >
                        <font-awesome-icon
                            icon="user"
                            class="text-primary"
                        ></font-awesome-icon
                        >&nbsp;&nbsp;{{ $t('labels.user.profile') }}
                    </b-dropdown-item>
                    <b-dropdown-item :href="$app.route('logout')">
                        <font-awesome-icon
                            class="text-primary"
                            icon="sign-out-alt"
                        ></font-awesome-icon
                        >&nbsp;&nbsp;{{ $t('labels.user.logout') }}
                    </b-dropdown-item>
                </template>
            </HeaderDropdown>

            <!--<b-nav-item to="/settings" class="pl-2 d-sm-down-none" v-if="$app.user.can('view settings')">-->
            <!--<i class="fas fa-cog font-3xl text-primary"></i>-->
            <!--</b-nav-item>      -->
        </b-navbar-nav>
        <!--<AsideToggler class="d-none d-lg-block"></AsideToggler>-->
    </AppHeader>
</template>

<script>
import axios from 'axios'
import AppHeader from '../../vendor/coreui/components/Header/Header'

export default {
    name: 'MyAppHeader',
    components: {
        AppHeader,
    },
    data() {
        return {
            users: [],
            search: null,
            branches: [
                {
                    label: 'All',
                    value: 0,
                },
                {
                    label: 'Damansara',
                    value: 1,
                },
                {
                    label: 'Cyberjaya',
                    value: 2,
                },
            ],
        }
    },
    computed: {
        create_list() {
            return []
            let list = [
                {
                    to: { name: 'users_create' },
                    text: this.$t('labels.backend.new_menu.user'),
                    icon: 'fa.user',
                    permission: this.$app.user.can('create users'),
                    mobile: false,
                },
                {
                    to: { name: 'roles_create' },
                    text: this.$t('labels.backend.new_menu.role'),
                    icon: 'fa.shield-alt',
                    permission: this.$app.user.can('create roles'),
                    mobile: false,
                },
            ]

            return list.filter((item) => {
                return item.permission
            })
        },
        users_list() {
            if (!this.search) return this.users

            let myReg = new RegExp(this.search, 'i')

            return this.users.filter((user) => {
                return user.name.match(myReg)
            })
        },
    },
}
</script>
