<template>
    <div class="animated fadeIn">
        <b-card>
            <template slot="header" class="card-header">
                <span class="h3">
                    {{ $t('labels.backend.tables.titles.index') }}
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
                        <b-btn
                            :to="{ name: 'tables_create' }"
                            size="sm"
                            variant="primary"
                            v-b-tooltip.hover
                            :title="$t('buttons.tables.create')"
                            v-if="$app.user.can('create tables')"
                        >
                            <font-awesome-icon
                                icon="plus-circle"
                            ></font-awesome-icon>
                        </b-btn>
                        <b-btn
                            @click="print"
                            size="sm"
                            variant="secondary"
                            v-b-tooltip.hover
                            :title="$t('buttons.print')"
                            v-if="$app.user.can('print tables')"
                        >
                            <font-awesome-icon icon="print"></font-awesome-icon>
                        </b-btn>
                        <b-btn
                            @click="closeAll"
                            size="sm"
                            variant="info"
                            v-b-tooltip.hover
                            :title="$t('buttons.close_all')"
                            v-if="$app.user.can('close orders')"
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
                search-route="tables.search"
                delete-route="tables.destroy"
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
                                <b-col class="form-group">
                                    <b-form-group
                                        :label="
                                            $t('validation.attributes.status')
                                        "
                                        label-for="status"
                                        label-cols="3"
                                    >
                                        <b-form-radio-group
                                            id="type"
                                            v-model="extraSearchCriteria.status"
                                            :options="[
                                                'Available',
                                                'Reserved',
                                                'All',
                                            ]"
                                            buttons
                                            button-variant="outline-primary"
                                            @input="onContextChangedWithPage"
                                        >
                                        </b-form-radio-group>
                                    </b-form-group>
                                </b-col>
                                <b-col class="form-group">
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
                    :sort-desc="false"
                    :busy.sync="isBusy"
                >
                    <template v-slot:cell(id)="row">
                        <router-link
                            v-if="row.item.can_edit"
                            :to="{
                                name: 'tables_edit',
                                params: { id: row.item.id },
                            }"
                            v-text="row.value"
                        ></router-link>
                        <span v-else v-text="row.value"></span>
                    </template>
                    <template v-slot:cell(guid)="row">
                        <qrcode-vue
                            :value="row.item.table_link"
                            size="150"
                            level="H"
                            render-as="svg"
                        ></qrcode-vue>
                    </template>
                    <template v-slot:cell(guid_print)="row">
                        <h2>
                            {{
                                `${row.item.internal_id}@${row.item.branch_name}`
                            }}
                        </h2>
                        <qrcode-vue
                            :value="row.item.table_link"
                            size="400"
                            level="H"
                            render-as="svg"
                        ></qrcode-vue>
                    </template>
                    <template v-slot:cell(status)="row">
                        <b-badge
                            :variant="
                                row.value === 'Available' ? 'success' : 'danger'
                            "
                            >{{ row.value }}</b-badge
                        >
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-btn-group>
                            <b-btn
                                v-if="row.item.can_edit"
                                size="sm"
                                variant="primary"
                                :to="{
                                    name: 'tables_edit',
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
                                    row.item.status === 'Reserved'
                                "
                                size="sm"
                                variant="info"
                                v-b-tooltip.hover
                                :title="$t('buttons.close')"
                                @click.stop="onClose(row.item.order_id)"
                            >
                                <font-awesome-icon
                                    color="white"
                                    icon="door-closed"
                                ></font-awesome-icon>
                            </b-btn>
                            <b-btn
                                v-if="row.item.can_delete"
                                size="sm"
                                variant="success"
                                v-b-tooltip.hover
                                :title="$t('buttons.view')"
                                :href="row.item.table_link"
                                target="_blank"
                            >
                                <font-awesome-icon
                                    icon="eye"
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
import QrcodeVue from 'qrcode.vue'
import Vue from 'vue'
import VueHtmlToPaper from 'vue-html-to-paper'
import axios from 'axios'
import Multiselect from 'vue-multiselect'

const options = {
    name: '_blank',
    specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
    styles: [
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        'https://unpkg.com/kidlat-css/css/kidlat.css',
    ],
}
Vue.use(VueHtmlToPaper, options)

export default {
    name: 'TableList',
    components: {
        QrcodeVue,
        Multiselect,
    },
    mixins: [list],
    data() {
        return {
            isBusy: false,
            item_type: 'table',
            extraSearchCriteria: {
                branch: null,
                status: null,
            },
            branches: [],
        }
    },
    computed: {
        fields() {
            let fields = [
                {
                    key: 'id',
                    label: this.$t('validation.attributes.id'),
                    class: 'text-center d-print-none',
                    sortable: true,
                },
                {
                    key: 'internal_id',
                    label: this.$t('validation.attributes.internal_id'),
                    class: 'text-center internal_id d-print-none',
                    sortable: true,
                },
                {
                    key: 'branch_name',
                    label: this.$t('validation.attributes.branch'),
                    class: 'text-center d-print-none',
                    sortable: true,
                },
                {
                    key: 'guid',
                    label: this.$t('validation.attributes.guid'),
                    class: 'text-center d-print-none',
                    sortable: false,
                },
                {
                    key: 'guid_print',
                    label: this.$t('validation.attributes.guid'),
                    class: 'text-center d-none d-print-block',
                    sortable: false,
                },
                {
                    key: 'status',
                    label: this.$t('validation.attributes.status'),
                    class: 'text-center d-print-none',
                    sortable: false,
                },
            ]
            if (
                this.$app.user.can('edit tables') ||
                this.$app.user.can('delete tables')
            ) {
                fields.push({
                    key: 'actions',
                    label: this.$t('labels.actions'),
                    class: 'nowrap text-center  d-print-none',
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
    },
    methods: {
        print() {
            this.$htmlToPaper('printMe')
        },
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
    },
}
</script>

<style>
/*@media print {*/
/*    .internal_id {*/
/*        width: 10% !important;*/
/*    }*/
/*}*/
.internal_id {
    width: 10% !important;
}
.b-table-stacked-md .internal_id {
    width: 100% !important;
}
</style>
