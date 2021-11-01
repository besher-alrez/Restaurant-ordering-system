<template>
    <div class="animated fadeIn">
        <b-card>
            <template slot="header" class="card-header">
                <span class="h3">
                    {{ $t('labels.backend.users.titles.index') }}
                </span>
                <div
                    class="card-header-actions"
                    v-if="this.$app.user.can('create users')"
                >
                    <b-btn
                        :to="{ name: 'users_create' }"
                        size="sm"
                        variant="primary"
                        v-b-tooltip.hover
                        :title="$t('buttons.users.create')"
                    >
                        <font-awesome-icon
                            icon="plus-circle"
                        ></font-awesome-icon>
                    </b-btn>
                </div>
            </template>
            <b-datatable
                ref="datasource"
                @context-changed="onContextChanged"
                search-route="users.search"
                delete-route="users.destroy"
                action-route="users.batch_action"
            >
                <b-table
                    ref="datatable"
                    striped
                    bordered
                    show-empty
                    responsive
                    no-local-sorting
                    :empty-text="$t('labels.datatables.no_results')"
                    :empty-filtered-text="
                        $t('labels.datatables.no_matched_results')
                    "
                    :fields="fields"
                    :items="dataLoadProvider"
                    :busy.sync="isBusy"
                >
                    <template v-slot:head(checkbox)="row">
                        <br />
                    </template>
                    <template v-slot:cell(checkbox)="row">
                        <b-form-checkbox
                            :value="row.item.id"
                            v-model="selected"
                        ></b-form-checkbox>
                    </template>
                    <template v-slot:cell(name)="row">
                        <router-link
                            v-if="row.item.can_edit"
                            :to="{
                                name: 'users_edit',
                                params: { id: row.item.id },
                            }"
                            v-text="row.value"
                        ></router-link>
                        <span v-else v-text="row.value"></span>
                    </template>
                    <!--                    <template v-slot:cell(confirmed)="row">-->
                    <!--                        <b-badge :variant="row.value ? 'success' : 'danger'">-->
                    <!--                            {{ row.value ? $t('labels.yes') : $t('labels.no') }}-->
                    <!--                        </b-badge>-->
                    <!--                    </template>-->
                    <template v-slot:cell(active)="row">
                        <b-form-checkbox
                            name="check-button"
                            switch
                            :checked="row.value"
                            @change="onActiveToggle(row.item.id)"
                            class="text-right"
                        >
                        </b-form-checkbox>
                    </template>
                    <template v-slot:cell(roles)="row">
                        {{ formatRoles(row.value) }}
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-btn-group>
                            <b-btn
                                v-if="row.item.can_edit"
                                size="sm"
                                variant="primary"
                                :to="{
                                    name: 'users_edit',
                                    params: { id: row.item.id },
                                }"
                                v-b-tooltip.hover
                                :title="$t('buttons.edit')"
                            >
                                <font-awesome-icon
                                    icon="edit"
                                ></font-awesome-icon>
                            </b-btn>
                            <b-btn
                                v-if="row.item.can_impersonate"
                                size="sm"
                                variant="warning"
                                :href="
                                    $app.route('users.impersonate', {
                                        user: row.item.id,
                                    })
                                "
                                v-b-tooltip.hover
                                :title="
                                    $t('buttons.login-as', {
                                        name: row.item.name,
                                    })
                                "
                            >
                                <font-awesome-icon
                                    icon="user-lock"
                                ></font-awesome-icon>
                            </b-btn>
                            <b-btn
                                v-if="row.item.can_delete"
                                size="sm"
                                variant="danger"
                                v-b-tooltip.hover
                                :title="$t('buttons.delete')"
                                @click.stop="onDelete(row.item.id)"
                            >
                                <font-awesome-icon
                                    icon="trash-alt"
                                ></font-awesome-icon>
                            </b-btn>
                        </b-btn-group>
                    </template>
                </b-table>
            </b-datatable>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios'
import list from '../mixins/list'

export default {
    name: 'UserList',
    mixins: [list],
    data() {
        return {
            isLoading: false,
            selected: [],
            isBusy: false,
            item_type: 'user',
            fields: [
                // { key: 'checkbox' },
                {
                    key: 'id',
                    label: this.$t('validation.attributes.id'),
                    sortable: true,
                },
                {
                    key: 'name',
                    label: this.$t('validation.attributes.name'),
                    sortable: true,
                },
                {
                    key: 'email',
                    label: this.$t('validation.attributes.email'),
                    sortable: true,
                },
                // {
                //     key: 'confirmed',
                //     label: this.$t('validation.attributes.confirmed'),
                //     class: 'text-center',
                // },
                { key: 'roles', label: this.$t('validation.attributes.roles') },
                {
                    key: 'last_access_at',
                    label: this.$t('labels.last_access_at'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'active',
                    label: this.$t('validation.attributes.active'),
                    class: 'text-center',
                },
                {
                    key: 'branch_name',
                    label: this.$t('validation.attributes.branch'),
                    class: 'text-center',
                    sortable: true,
                },
                // {
                //     key: 'created_at',
                //     label: this.$t('labels.created_at'),
                //     class: 'text-center',
                //     sortable: true,
                // },
                // {
                //     key: 'updated_at',
                //     label: this.$t('labels.updated_at'),
                //     class: 'text-center',
                //     sortable: true,
                // },
                {
                    key: 'actions',
                    label: this.$t('labels.actions'),
                    class: 'nowrap',
                },
            ],
        }
    },
    watch: {
        selected(value) {
            this.$refs.datasource.selected = value
        },
    },
    methods: {
        onActiveToggle(id) {
            axios
                .post(this.$app.route('users.active', { user: id }))
                .then((response) => {
                    this.$app.noty[response.data.status](response.data.message)
                })
                .catch((error) => {
                    this.$app.error(error)
                })
        },
        // onBulkActionSuccess() {
        //     this.selected = []
        // },
        formatRoles(roles) {
            return roles.data
                .map((key) => {
                    return key.display_name
                })
                .join(', ')
        },
    },
}
</script>
