<template>
    <div class="animated fadeIn">
        <b-card>
            <template slot="header" class="card-header">
                <span class="h3">
                    {{ $t('labels.backend.settings.titles.index') }}
                </span>
            </template>
            <b-datatable
                ref="datasource"
                @context-changed="onContextChanged"
                search-route="settings.search"
                delete-route="settings.destroy"
                :length-change="true"
                :paging="true"
                infos
                :export-data="false"
            >
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
                    @row-dblclicked="enableEdit"
                >
                    <template #table-colgroup="scope">
                        <col
                            v-for="field in scope.fields"
                            :key="field.key"
                            :style="{
                                width: field.key === 'value' ? '30%' : null,
                            }"
                        />
                    </template>
                    <template v-slot:cell(key)="row">
                        <span
                            v-text="
                                $t(`labels.backend.settings.data.${row.value}`)
                            "
                        ></span>
                    </template>
                    <template v-slot:cell(value)="row">
                        <span
                            v-text="row.value"
                            v-if="!row.item.editable"
                        ></span>

                        <b-input-group v-else>
                            <b-form-input
                                :ref="`input_${row.item.id}`"
                                :value="row.value"
                            >
                            </b-form-input>
                            <b-input-group-append>
                                <b-btn
                                    variant="info"
                                    @click="save(row.item)"
                                    v-b-tooltip.hover
                                    :title="$t('buttons.save')"
                                >
                                    <font-awesome-icon
                                        icon="save"
                                    ></font-awesome-icon>
                                </b-btn>
                                <b-btn
                                    variant="warning"
                                    @click="row.item.editable = false"
                                    v-b-tooltip.hover
                                    :title="$t('buttons.cancel')"
                                >
                                    <font-awesome-icon
                                        icon="times"
                                    ></font-awesome-icon>
                                </b-btn>
                            </b-input-group-append>
                        </b-input-group>
                    </template>
                </b-table>
            </b-datatable>
        </b-card>
    </div>
</template>

<script>
import list from '../mixins/list'
import axios from 'axios'

export default {
    name: 'SettingList',
    mixins: [list],
    data() {
        return {
            isBusy: false,
            item_type: 'setting',
        }
    },
    computed: {
        fields() {
            let fields = [
                // {
                //     key: 'id',
                //     label: this.$t('validation.attributes.id'),
                //     class: 'text-center',
                //     sortable: true,
                // },
                {
                    key: 'key',
                    label: this.$t('validation.attributes.key'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'value',
                    label: this.$t('validation.attributes.value'),
                    class: 'text-center',
                    sortable: true,
                },
            ]

            return fields
        },
    },
    methods: {
        enableEdit(row) {
            row.editable = true
        },
        async save(row) {
            let result = await window.swal.fire({
                title: this.$t('labels.are_you_sure'),
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$t('buttons.cancel'),
                confirmButtonColor: '#dd4b39',
                confirmButtonText: this.$t('buttons.yes'),
            })
            if (result.value) {
                row.editable = false

                let formData = this.$app.objectToFormData({
                    key: row.key,
                    value: this.$refs[`input_${row.id}`].localValue,
                    _method: 'PATCH',
                })

                axios
                    .post(
                        this.$app.route('settings.update', { setting: row.id }),
                        formData
                    )
                    .then((response) => {
                        this.$app.noty[response.data.status](
                            response.data.message
                        )
                        this.onContextChanged()
                    })
                    .catch((error) => {
                        this.$app.error(error)
                    })
            }
        },
    },
}
</script>
