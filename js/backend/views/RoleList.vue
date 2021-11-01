<template>
    <div>
        <b-card>
            <template slot="header" class="card-header">
                <span class="h3">
                    {{ $t('labels.backend.roles.titles.index') }}
                </span>
                <div
                    class="card-header-actions"
                    v-if="this.$app.user.can('create roles')"
                >
                    <b-btn
                        :to="{ name: 'roles_create' }"
                        size="sm"
                        variant="primary"
                        v-b-tooltip.hover
                        :title="$t('buttons.roles.create')"
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
                search-route="roles.search"
                delete-route="roles.destroy"
                :length-change="false"
                :paging="false"
                infos
                :search="false"
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
                    sort-by="id"
                    :sort-desc="false"
                    :busy.sync="isBusy"
                >
                    <template v-slot:cell(name)="row">
                        <router-link
                            v-if="row.item.can_edit"
                            :to="{
                                name: 'roles_edit',
                                params: { id: row.item.id },
                            }"
                            v-text="row.value"
                        ></router-link>
                        <span v-else v-text="row.value"></span>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-btn-group>
                            <b-btn
                                v-if="row.item.can_edit"
                                size="sm"
                                variant="primary"
                                :to="{
                                    name: 'roles_edit',
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
import list from '../mixins/list'

export default {
    name: 'RoleList',
    mixins: [list],
    data() {
        return {
            isBusy: false,
            item_type: 'role',
            fields: [
                {
                    key: 'name',
                    label: this.$t('validation.attributes.name'),
                    class: 'text-center',
                    sortable: true,
                },
                // { key: 'order', label: this.$t('validation.attributes.order'), 'class': 'text-right', sortable: true },
                {
                    key: 'display_name',
                    label: this.$t('validation.attributes.display_name'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'description',
                    label: this.$t('validation.attributes.description'),
                    sortable: true,
                },
                {
                    key: 'created_at',
                    label: this.$t('labels.created_at'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'updated_at',
                    label: this.$t('labels.updated_at'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'actions',
                    label: this.$t('labels.actions'),
                    class: 'nowrap',
                },
            ],
        }
    },
    methods: {},
}
</script>
