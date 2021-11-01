<template>
    <div class="table-container">
        <b-row class="mb-3" v-if="extraSearchCriteria">
            <slot name="extra_filters"></slot>
        </b-row>
        <b-row v-if="search || infos || lengthChange">
            <b-col md="4" class="mb-3">
                <b-form v-if="lengthChange">
                    <b-form-group>
                        <b-input-group
                            :append="$t('labels.datatables.entries_per_page')"
                            :prepend="$t('labels.datatables.show_per_page')"
                        >
                            <b-form-select
                                :options="pageOptions"
                                v-model="perPage"
                                @input="onContextChangedWithPage"
                            ></b-form-select>
                        </b-input-group>
                    </b-form-group>
                </b-form>
            </b-col>
            <b-col md="4" class="mb-3 text-center">
                <label class="mt-2" v-if="infos">
                    {{
                        $t('labels.datatables.infos', {
                            offset_start: perPage * (currentPage - 1) + 1,
                            offset_end: perPage * currentPage,
                            total: totalRows,
                        })
                    }}
                </label>
            </b-col>
            <b-col md="4" class="mb-3">
                <b-form
                    inline
                    v-if="search"
                    class="d-flex justify-content-end"
                    @submit.prevent
                >
                    <b-input-group :prepend="$t('labels.datatables.search')">
                        <b-form-input
                            v-model="searchQuery"
                            v-debounce:2s="debounceInput"
                            :debounce-events="'input'"
                        ></b-form-input>
                        <b-input-group-append>
                            <b-btn
                                variant="primary"
                                size="sm"
                                v-b-tooltip.hover
                                :title="$t('buttons.refresh')"
                                @click="onContextChanged"
                            >
                                <font-awesome-icon
                                    icon="sync-alt"
                                ></font-awesome-icon>
                            </b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-form>
            </b-col>
        </b-row>
        <div style="position: relative" id="printMe">
            <slot></slot>
            <atom-spinner
                :animation-duration="1000"
                :size="200"
                :color="'#97191D'"
                :loading="loading"
            ></atom-spinner>
        </div>
        <b-row>
            <b-col md="4">
                <!--<form class="form-inline" @submit.prevent="onBulkAction" v-if="actions && Object.keys(actions).length">-->
                <!--<div class="form-group form-group-sm">-->
                <!--<select name="action" class="form-control mr-1" v-model="action">-->
                <!--<option v-for="(action, value) in actions" :key="value" :value="value">{{ action }}</option>-->
                <!--</select>-->
                <!--<b-btn type="submit" variant="danger">{{ $t('buttons.execute') }}</b-btn>-->
                <!--</div>-->
                <!--</form>-->
                <form
                    class="form-inline"
                    @submit.prevent="onBulkAction"
                    v-if="actions && Object.keys(actions).length"
                >
                    <div class="form-group">
                        <b-input-group>
                            <b-form-select
                                :options="actions"
                                v-model="action"
                            ></b-form-select>
                            <b-input-group-append>
                                <b-btn
                                    type="submit"
                                    variant="danger"
                                    v-b-tooltip.hover
                                    :title="$t('buttons.execute')"
                                    :disabled="selected.length === 0"
                                >
                                    <font-awesome-icon
                                        icon="bolt"
                                    ></font-awesome-icon>
                                </b-btn>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                </form>
            </b-col>
            <b-col md="4" style="padding: 0px">
                <b-pagination
                    :total-rows="totalRows"
                    :per-page="perPage"
                    v-model="currentPage"
                    v-if="paging && totalRows > perPage"
                    class="justify-content-center"
                    @input="onContextChanged"
                ></b-pagination>
            </b-col>
            <b-col md="4">
                <div v-if="exportData" class="d-flex justify-content-end">
                    <b-btn @click.prevent="onExportData">
                        <i class="fe fe-download"></i> {{ $t('labels.export') }}
                    </b-btn>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import AtomSpinner from './AtomSpinner'

export default {
    components: {
        AtomSpinner,
    },
    props: {
        lengthChange: {
            type: Boolean,
            default: true,
        },
        paging: {
            type: Boolean,
            default: true,
        },
        infos: {
            type: Boolean,
            default: true,
        },
        search: {
            type: Boolean,
            default: true,
        },
        searchRoute: {
            type: String,
            default: null,
        },
        exportData: {
            type: Boolean,
            default: false,
        },
        exportRoute: {
            type: String,
            default: null,
        },
        deleteRoute: {
            type: String,
            default: null,
        },
        actionRoute: {
            type: String,
            default: null,
        },
        actions: {
            type: Array,
            default: () => {
                return []
            },
        },
        otherSearchCriteria: {
            type: Object,
            default: null,
        },
        extraSearchCriteria: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            currentPage: 1,
            perPage: 30,
            totalRows: 0,
            // pageOptions: [ 5, 10, 15, 25, 50 ],
            pageOptions: [10, 20, 30, 50, 100],
            searchQuery: null,
            selected: [],
            action: null,
            loading: false,
        }
    },
    watch: {
        currentPage(newValue, oldValue) {
            if (oldValue !== newValue) window.location.hash = newValue
        },
    },
    mounted() {
        if (this.actions && this.actions.length > 0) {
            this.action = this.actions[0].value
        }
    },
    methods: {
        debounceInput() {
            this.onContextChangedWithPage()
        },
        onContextChangedWithPage() {
            this.currentPage = 1
            this.onContextChanged()
        },
        onContextChanged() {
            this.$emit('context-changed')
        },
        async loadData(sortBy, sortDesc, summery = {}) {
            try {
                this.loading = true
                let { data } = await axios.get(
                    this.$app.route(this.searchRoute),
                    {
                        params: {
                            page: this.currentPage,
                            perPage: this.perPage,
                            column: sortBy,
                            direction: sortDesc ? 'desc' : 'asc',
                            search: this.searchQuery,
                            otherSearch: this.otherSearchCriteria,
                            extraSearch: this.extraSearchCriteria,
                        },
                    }
                )

                this.totalRows = data.meta.pagination.total
                this.loading = false
                summery.summery = data.summery
                return data.data
            } catch (e) {
                this.$app.error(e)
                this.loading = false
                return []
            }
        },
        onExportData() {
            window.location = `${this.$app.route(
                this.exportRoute
            )}?${qs.stringify({
                search: this.searchQuery,
                otherSearch: this.otherSearchCriteria,
                extraSearch: this.extraSearchCriteria,
            })}`
        },
        async deleteRow(params) {
            let result = await window.swal.fire({
                title: this.$t('labels.are_you_sure'),
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$t('buttons.cancel'),
                confirmButtonColor: '#dd4b39',
                confirmButtonText: this.$t('buttons.delete'),
            })
            if (result.value) {
                try {
                    let { data } = await axios.delete(
                        this.$app.route(this.deleteRoute, params)
                    )
                    this.onContextChanged()
                    this.$app.noty[data.status](data.message)
                } catch (e) {
                    this.$app.error(e)
                }
            }
        },
        async onBulkAction() {
            let result = await window.swal.fire({
                title: this.$t('labels.are_you_sure'),
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$t('buttons.cancel'),
                confirmButtonColor: '#dd4b39',
                confirmButtonText: this.$t('buttons.confirm'),
            })

            if (result.value) {
                try {
                    let { data } = await axios.post(
                        this.$app.route(this.actionRoute),
                        {
                            action: this.action,
                            ids: this.selected,
                        }
                    )

                    this.onContextChanged()
                    this.$emit('bulk-action-success')
                    this.$app.noty[data.status](data.message)
                } catch (e) {
                    this.$app.error(e)
                }
            }
        },
    },
}
</script>
