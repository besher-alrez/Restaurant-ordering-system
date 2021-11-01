<template>
    <div class="animated fadeIn">
        <b-card>
            <template slot="header" class="card-header">
                <span class="h3">
                    {{ $t('labels.backend.orders.titles.index') }}
                </span>
                <div
                    class="card-header-actions"
                    v-if="$app.user.can('create orders')"
                >
                    <b-btn-group>
                        <b-btn
                            v-b-toggle.filter
                            variant="success"
                            size="sm"
                            v-b-tooltip.hover
                            :title="$t('buttons.show_hide_filters')"
                        >
                            <font-awesome-icon
                                icon="filter"
                            ></font-awesome-icon>
                        </b-btn>
                        <b-btn
                            :to="{ name: 'orders_create' }"
                            size="sm"
                            variant="primary"
                            v-b-tooltip.hover
                            :title="$t('buttons.orders.create')"
                        >
                            <font-awesome-icon
                                icon="plus-circle"
                            ></font-awesome-icon>
                        </b-btn>
                        <b-btn
                            @click="closeAll"
                            size="sm"
                            variant="info"
                            v-b-tooltip.hover
                            :title="$t('buttons.close_all')"
                        >
                            <font-awesome-icon
                                color="white"
                                icon="door-closed"
                            ></font-awesome-icon>
                        </b-btn>
                    </b-btn-group>
                </div>
            </template>
            <b-datatable
                ref="datasource"
                @context-changed="onContextChanged"
                search-route="orders.search"
                delete-route="orders.destroy"
                :extra-search-criteria="extraSearchCriteria"
                :length-change="true"
                :paging="true"
                infos
                :export-data="false"
            >
                <template slot="extra_filters">
                    <b-col>
                        <b-collapse id="filter" class="mt-2">
                            <b-row>
                                <b-col lg="4" md="6" class="form-group">
                                    <b-form-group
                                        :label="
                                            $t('validation.attributes.status')
                                        "
                                        label-for="status"
                                        label-cols="3"
                                    >
                                        <b-form-checkbox-group
                                            id="type"
                                            v-model="extraSearchCriteria.status"
                                            :options="['closed', 'open']"
                                            buttons
                                            button-variant="outline-primary"
                                            @input="onContextChangedWithPage"
                                        >
                                        </b-form-checkbox-group>
                                    </b-form-group>
                                </b-col>
                                <b-col lg="4" md="6" class="form-group">
                                    <b-form-group
                                        :label="
                                            $t('validation.attributes.branch')
                                        "
                                        label-for="branch"
                                        label-cols="3"
                                    >
                                        <multiselect
                                            v-model="extraSearchCriteria.branch"
                                            :options="branches"
                                            id="branch"
                                            name="branch"
                                            track-by="id"
                                            label="name"
                                            :searchable="true"
                                            :close-on-select="true"
                                            :show-labels="false"
                                            @input="getTables"
                                            :placeholder="
                                                '-- ' +
                                                $t(
                                                    'validation.attributes.branch'
                                                ) +
                                                ' --'
                                            "
                                        ></multiselect>
                                    </b-form-group>
                                </b-col>
                                <b-col lg="4" md="6" class="form-group">
                                    <b-form-group
                                        :label="
                                            $t('validation.attributes.table')
                                        "
                                        label-for="table"
                                        label-cols="3"
                                    >
                                        <multiselect
                                            v-model="extraSearchCriteria.table"
                                            :options="tables"
                                            id="table"
                                            name="table"
                                            track-by="id"
                                            label="name"
                                            :searchable="true"
                                            :close-on-select="true"
                                            :show-labels="false"
                                            @input="onContextChangedWithPage"
                                            :placeholder="
                                                '-- ' +
                                                $t(
                                                    'validation.attributes.table'
                                                ) +
                                                ' --'
                                            "
                                        ></multiselect>
                                    </b-form-group>
                                </b-col>
                                <b-col lg="4" md="6" class="form-group">
                                    <b-form-group
                                        :label="
                                            $t('validation.attributes.amount')
                                        "
                                        label-for="amount"
                                        :label-cols="3"
                                    >
                                        <b-input-group
                                            prepend="RM"
                                            class="mb-2"
                                        >
                                            <b-form-input
                                                placeholder="Min"
                                                v-model="
                                                    extraSearchCriteria.min_amount
                                                "
                                                @change="
                                                    onContextChangedWithPage
                                                "
                                            ></b-form-input>
                                            <b-form-input
                                                placeholder="Max"
                                                v-model="
                                                    extraSearchCriteria.max_amount
                                                "
                                                @change="
                                                    onContextChangedWithPage
                                                "
                                            ></b-form-input>
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col lg="4" md="6" class="form-group">
                                    <b-form-group
                                        :label="
                                            $t(
                                                'validation.attributes.start_date'
                                            )
                                        "
                                        label-for="start_date"
                                        :horizontal="false"
                                        :label-cols="3"
                                    >
                                        <b-input-group>
                                            <p-datetimepicker
                                                id="start_date"
                                                name="start_date"
                                                :config="config"
                                                autocomplete="off"
                                                v-model="
                                                    extraSearchCriteria.start_date
                                                "
                                                @input="
                                                    onContextChangedWithPage
                                                "
                                            ></p-datetimepicker>
                                            <b-input-group-append>
                                                <b-input-group-text data-toggle>
                                                    <font-awesome-icon
                                                        icon="calendar"
                                                    ></font-awesome-icon>
                                                </b-input-group-text>
                                                <b-input-group-text data-clear>
                                                    <font-awesome-icon
                                                        icon="times"
                                                    ></font-awesome-icon>
                                                </b-input-group-text>
                                            </b-input-group-append>
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col lg="4" md="6" class="form-group">
                                    <b-form-group
                                        :label="
                                            $t('validation.attributes.end_date')
                                        "
                                        label-for="end_date"
                                        :horizontal="false"
                                        :label-cols="3"
                                    >
                                        <b-input-group>
                                            <p-datetimepicker
                                                id="end_date"
                                                name="end_date"
                                                :config="config"
                                                autocomplete="off"
                                                v-model="
                                                    extraSearchCriteria.end_date
                                                "
                                                @input="
                                                    onContextChangedWithPage
                                                "
                                            ></p-datetimepicker>
                                            <b-input-group-append>
                                                <b-input-group-text data-toggle>
                                                    <font-awesome-icon
                                                        icon="calendar"
                                                    ></font-awesome-icon>
                                                </b-input-group-text>
                                                <b-input-group-text data-clear>
                                                    <font-awesome-icon
                                                        icon="times"
                                                    ></font-awesome-icon>
                                                </b-input-group-text>
                                            </b-input-group-append>
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <!--                                <b-col lg="8" md="12" class="form-group">-->
                                <!--                                    <b-form-group-->
                                <!--                                        :label="-->
                                <!--                                            $t('validation.attributes.date')-->
                                <!--                                        "-->
                                <!--                                        label-for="date"-->
                                <!--                                        :label-cols="3"-->
                                <!--                                    >-->
                                <!--                                        <b-input-group>-->
                                <!--                                            <p-datetimepicker-->
                                <!--                                                :config="config"-->
                                <!--                                                id="date"-->
                                <!--                                                name="date"-->
                                <!--                                                autocomplete="off"-->
                                <!--                                                v-model="-->
                                <!--                                                    extraSearchCriteria.date-->
                                <!--                                                "-->
                                <!--                                                @input="-->
                                <!--                                                    onContextChangedWithPage-->
                                <!--                                                "-->
                                <!--                                            ></p-datetimepicker>-->
                                <!--                                            <b-input-group-append>-->
                                <!--                                                <b-input-group-text data-toggle>-->
                                <!--                                                    <font-awesome-icon-->
                                <!--                                                        icon="calendar"-->
                                <!--                                                    ></font-awesome-icon>-->
                                <!--                                                </b-input-group-text>-->
                                <!--                                                <b-input-group-text data-clear>-->
                                <!--                                                    <font-awesome-icon-->
                                <!--                                                        icon="times"-->
                                <!--                                                    ></font-awesome-icon>-->
                                <!--                                                </b-input-group-text>-->
                                <!--                                            </b-input-group-append>-->
                                <!--                                        </b-input-group>-->
                                <!--                                    </b-form-group>-->
                                <!--                                </b-col>-->
                            </b-row>
                        </b-collapse>
                    </b-col>
                </template>
                <b-table
                    ref="datatable"
                    striped
                    bordered
                    show-empty
                    stacked="md"
                    no-local-sorting
                    :empty-text="$t('labels.datatables.no_results')"
                    :empty-filtered-text="
                        $t('labels.datatables.no_matched_results')
                    "
                    :fields="fields"
                    :items="dataLoadProvider"
                    sort-by="id"
                    :sort-desc="true"
                    :busy.sync="isBusy"
                >
                    <template v-slot:cell(id)="row">
                        <router-link
                            v-if="row.item.can_edit"
                            :to="{
                                name: 'orders_edit',
                                params: { id: row.item.id },
                            }"
                            v-text="row.value"
                        ></router-link>
                        <span v-else v-text="row.value"></span>
                    </template>
                    <template v-slot:cell(status)="row">
                        <h5>
                            <b-badge
                                :variant="
                                    row.value === 'open' ? 'primary' : 'success'
                                "
                                >{{ row.value }}</b-badge
                            >
                        </h5>
                    </template>
                    <template v-slot:cell(type)="row">
                        <h5>
                            <b-badge
                                :variant="
                                    row.value === 'dine_in' ? 'info' : 'danger'
                                "
                                >{{
                                    row.value.replace(/_/g, ' ').toUpperCase()
                                }}</b-badge
                            >
                        </h5>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-btn-group>
                            <b-btn
                                v-if="row.item.can_edit"
                                size="sm"
                                variant="primary"
                                :to="{
                                    name: 'orders_edit',
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
                                v-if="
                                    row.item.can_edit &&
                                    row.item.status === 'open'
                                "
                                size="sm"
                                variant="info"
                                v-b-tooltip.hover
                                :title="$t('buttons.close')"
                                @click.stop="onClose(row.item.id)"
                            >
                                <font-awesome-icon
                                    color="white"
                                    icon="door-closed"
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
import axios from 'axios'
import Multiselect from 'vue-multiselect'

export default {
    name: 'OrderList',
    components: {
        Multiselect,
    },
    mixins: [list],
    data() {
        return {
            isBusy: false,
            item_type: 'order',
            extraSearchCriteria: {
                branch: null,
                table: null,
                status: [],
                start_date: null,
                end_date: null,
                min_amount: null,
                max_amount: null,
            },
            branches: [],
            tables: [],
            config: {
                wrap: true,
                time_24hr: true,
                enableTime: true,
            },
        }
    },
    computed: {
        fields() {
            let fields = [
                {
                    key: 'id',
                    label: this.$t('validation.attributes.id'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'branch_name',
                    label: this.$t('validation.attributes.branch'),
                    class: 'text-center d-print-none',
                    sortable: true,
                },
                {
                    key: 'table_name',
                    label: this.$t('validation.attributes.table'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'status',
                    label: this.$t('validation.attributes.status'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'type',
                    label: this.$t('validation.attributes.order_type'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'amount',
                    label: this.$t('validation.attributes.amount'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'created_at',
                    label: this.$t('validation.attributes.created_at'),
                    class: 'text-center',
                    sortable: true,
                },
            ]
            if (
                this.$app.user.can('edit orders') ||
                this.$app.user.can('delete orders')
            ) {
                fields.push({
                    key: 'actions',
                    label: this.$t('labels.actions'),
                    class: 'nowrap text-center',
                })
            }
            return fields
        },
    },
    async created() {
        let { data } = await axios.get(this.$app.route(`branches.search`))
        this.branches = data.data.map((item) => {
            return { id: item.id, name: item.name }
        })
        ;({ data } = await axios.get(this.$app.route(`tables.search`)))
        this.tables = data.data.map((item) => {
            return {
                id: item.id,
                name: `${item.internal_id}@${item.branch_name}`,
            }
        })
    },
    methods: {
        async onClose(id) {
            let result = await window.swal.fire({
                title: this.$t('labels.are_you_sure'),
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$t('buttons.cancel'),
                confirmButtonColor: '#dd4b39',
                confirmButtonText: this.$t('buttons.close'),
            })
            if (result.value) {
                try {
                    let { data } = await axios.put(
                        this.$app.route('orders.close', { order: id })
                    )
                    this.onContextChanged()
                    this.$app.noty[data.status](data.message)
                } catch (e) {
                    this.$app.error(e)
                }
            }
        },
        async closeAll() {
            let result = await window.swal.fire({
                title: this.$t('labels.are_you_sure'),
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$t('buttons.cancel'),
                confirmButtonColor: '#dd4b39',
                confirmButtonText: this.$t('buttons.close'),
            })
            if (result.value) {
                try {
                    let { data } = await axios.put(
                        this.$app.route('orders.close_all')
                    )
                    this.onContextChanged()
                    this.$app.noty[data.status](data.message)
                } catch (e) {
                    this.$app.error(e)
                }
            }
        },
        async getTables() {
            this.onContextChangedWithPage()
            this.extraSearchCriteria.table = null
            let { data } = await axios.get(this.$app.route(`tables.search`), {
                params: {
                    perPage: 200,
                    extraSearch: {
                        branch: this.extraSearchCriteria.branch,
                    },
                },
            })
            this.tables = data.data.map((item) => {
                return {
                    id: item.id,
                    name: item.internal_id,
                }
            })
        },
    },
}
</script>
