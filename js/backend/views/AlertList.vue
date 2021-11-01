<template>
    <div class="animated fadeIn">
        <b-card>
            <template slot="header" class="card-header">
                <span class="h3">
                    {{ $t('labels.backend.alerts.titles.index') }}
                </span>
                <div class="card-header-actions">
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
                    </b-btn-group>
                </div>
            </template>
            <b-datatable
                ref="datasource"
                @context-changed="onContextChanged"
                search-route="alerts.search"
                delete-route="alerts.destroy"
                :length-change="true"
                :paging="true"
                infos
                :export-data="false"
                :extra-search-criteria="extraSearchCriteria"
            >
                <template slot="extra_filters">
                    <b-col>
                        <b-collapse id="filter" class="mt-2">
                            <b-row>
                                <b-col lg="4" md="6" sm="12" class="form-group">
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
                                            @input="onContextChangedWithPage"
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
                                <b-col lg="4" md="6" sm="12" class="form-group">
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
                                <b-col lg="4" md="6" sm="12" class="form-group">
                                    <b-form-group
                                        :label="
                                            $t(
                                                'validation.attributes.alert_type'
                                            )
                                        "
                                        label-for="alert_type"
                                        label-cols="3"
                                    >
                                        <multiselect
                                            v-model="extraSearchCriteria.type"
                                            :options="Object.values(alerts)"
                                            id="alert_type"
                                            name="type"
                                            track-by="value"
                                            label="label"
                                            :searchable="true"
                                            :close-on-select="true"
                                            :show-labels="false"
                                            multiple
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
                            </b-row>
                        </b-collapse>
                    </b-col>
                </template>
                <b-table
                    ref="datatable"
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
                    small
                    @row-dblclicked="showOrderInfo"
                >
                    <template v-slot:cell(id)="row">
                        <router-link
                            v-if="row.item.can_edit"
                            :to="{
                                name: 'alerts_edit',
                                params: { id: row.item.id },
                            }"
                            v-text="row.value"
                        ></router-link>
                        <span v-else v-text="row.value"></span>
                    </template>
                    <template v-slot:cell(status)="row">
                        <h5>
                            <b-badge
                                @click="markAsDone(row.item)"
                                :variant="
                                    row.value === 'done' ? 'info' : 'warning'
                                "
                                >{{ row.value }}</b-badge
                            >
                        </h5>
                    </template>
                    <template v-slot:cell(type)="row">
                        <h5 v-if="alerts[row.value]">
                            <b-badge :variant="alerts[row.value].variant">
                                <font-awesome-icon
                                    :icon="alerts[row.value].icon"
                                ></font-awesome-icon>
                                {{ alerts[row.value].label }}</b-badge
                            >
                        </h5>
                    </template>
                </b-table>
            </b-datatable>
        </b-card>
        <model-modal
            componenet-name="OrderForm"
            :componenet-props="{ disabled: true, popup: true }"
            :model-id="order_id ? order_id : 0"
            :show-modal.sync="showOrderModal"
            :reload-table="false"
        ></model-modal>
    </div>
</template>

<script>
import list from '../mixins/list'
import ModelModal from './components/ModelModal'
import Multiselect from 'vue-multiselect'
import axios from 'axios'

export default {
    name: 'AlertList',
    components: { ModelModal, Multiselect },
    mixins: [list],
    data() {
        return {
            isBusy: false,
            item_type: 'alert',
            interval: null,
            showOrderModal: false,
            order_id: null,
            extraSearchCriteria: {
                branch: null,
                table: null,
                type: [],
            },
            branches: [],
            tables: [],
            alerts: {
                bill: {
                    label: 'Bill',
                    icon: 'file-invoice-dollar',
                    variant: 'primary',
                    value: 'bill',
                },
                help: {
                    label: 'Assist',
                    icon: 'question-circle',
                    variant: 'info',
                    value: 'help',
                },
                new_order: {
                    label: 'New Order',
                    icon: 'receipt',
                    variant: 'success',
                    value: 'new_order',
                },
                new_order_items: {
                    label: 'New Order Items',
                    icon: 'plus-circle',
                    variant: 'secondary',
                    value: 'new_order_items',
                },
            },
        }
    },
    computed: {
        fields() {
            return [
                {
                    key: 'id',
                    label: this.$t('validation.attributes.id'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'branch_name',
                    label: this.$t('validation.attributes.branch'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'table_name',
                    label: this.$t('validation.attributes.table'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'type',
                    label: this.$t('validation.attributes.alert_type'),
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
                    key: 'created_at',
                    label: this.$t('validation.attributes.created_at'),
                    class: 'text-center',
                    sortable: true,
                },
            ]
        },
    },
    watch: {
        '$store.state.latest_alerts.max': function (newVal, oldVal) {
            if (newVal && oldVal) this.onContextChanged()
        },
    },
    async created() {
        let self = this
        this.interval = setInterval(function () {
            self.onContextChanged()
        }, 30000)
        let { data } = await axios.get(this.$app.route(`branches.search`))
        this.branches = data.data.map((item) => {
            return { id: item.id, name: item.name }
        })
        ;({ data } = await axios.get(this.$app.route(`tables.search`), {
            params: {
                perPage: 200,
            },
        }))
        this.tables = data.data.map((item) => {
            return {
                id: item.id,
                name: `${item.internal_id}@${item.branch_name}`,
            }
        })
    },
    beforeDestroy() {
        clearInterval(this.interval)
    },
    methods: {
        showOrderInfo(item) {
            if (item.order_id) {
                this.order_id = item.order_id
                this.showOrderModal = true
            }
        },
        async markAsDone(item) {
            if (item.status === 'done') return
            let result = await window.swal.fire({
                title: this.$t('labels.are_you_sure_change_status'),
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$t('buttons.cancel'),
                confirmButtonColor: '#dd4b39',
                confirmButtonText: this.$t('buttons.yes'),
            })
            if (result.value) {
                try {
                    let { data } = await axios.put(
                        this.$app.route('alerts.mark_as_done', {
                            alert: item.id,
                        })
                    )
                    this.onContextChanged()
                    this.$app.noty[data.status](data.message)
                } catch (e) {
                    this.$app.error(e)
                }
            }
        },
    },
}
</script>
