<template>
    <div class="animated fadeIn">
        <b-card>
            <template slot="header" class="card-header">
                <span class="h3">
                    {{ $t('labels.backend.promotions.titles.index') }}
                </span>
                <div
                    class="card-header-actions"
                    v-if="$app.user.can('create promotions')"
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
                            :to="{ name: 'promotions_create' }"
                            size="sm"
                            variant="primary"
                            v-b-tooltip.hover
                            :title="$t('buttons.promotions.create')"
                        >
                            <font-awesome-icon
                                icon="plus-circle"
                            ></font-awesome-icon>
                        </b-btn>
                    </b-btn-group>
                </div>
            </template>
            <b-datatable
                ref="datasource"
                @context-changed="onContextChanged"
                search-route="promotions.search"
                delete-route="promotions.destroy"
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
                                            $t(
                                                'validation.attributes.is_active'
                                            )
                                        "
                                        label-for="is_active"
                                        label-cols="3"
                                    >
                                        <b-form-checkbox-group
                                            id="type"
                                            v-model="
                                                extraSearchCriteria.is_active
                                            "
                                            :options="[
                                                { text: 'Yes', value: true },
                                                { text: 'No', value: false },
                                            ]"
                                            buttons
                                            button-variant="outline-primary"
                                            @input="onContextChangedWithPage"
                                        >
                                        </b-form-checkbox-group>
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
                                name: 'promotions_edit',
                                params: { id: row.item.id },
                            }"
                            v-text="row.value"
                        ></router-link>
                        <span v-else v-text="row.value"></span>
                    </template>
                    <template v-slot:cell(meal)="row">
                        <span v-text="row.value.name"></span>
                    </template>
                    <template v-slot:cell(image)="row">
                        <img
                            class="img-thumbnail"
                            :src="row.item.image_path"
                            :alt="row.item.title"
                            width="100"
                        />
                    </template>
                    <template v-slot:cell(is_active)="row">
                        <h5>
                            <b-badge
                                :variant="row.value ? 'success' : 'warning'"
                                class="pointer_cursor"
                                @click="onStatusToggle(row.item.id)"
                            >
                                {{ row.value ? 'YES' : 'NO' }}
                            </b-badge>
                        </h5>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-btn-group>
                            <b-btn
                                v-if="row.item.can_edit"
                                size="sm"
                                variant="primary"
                                :to="{
                                    name: 'promotions_edit',
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
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import QrcodeVue from 'qrcode.vue'

export default {
    name: 'PromotionList',
    components: {
        Multiselect,
    },
    mixins: [list],
    data() {
        return {
            isBusy: false,
            item_type: 'promotion',
            extraSearchCriteria: {
                branch: null,
                is_active: [],
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
                    key: 'meal',
                    label: this.$t('validation.attributes.meal'),
                    class: 'text-center',
                    sortable: false,
                },
                {
                    key: 'is_active',
                    label: this.$t('validation.attributes.is_active'),
                    class: 'text-center',
                    sortable: true,
                },
                {
                    key: 'image',
                    label: this.$t('validation.attributes.image'),
                    class: 'text-center',
                },
            ]
            if (
                this.$app.user.can('edit promotions') ||
                this.$app.user.can('delete promotions')
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
    },
    methods: {
        onStatusToggle(id) {
            axios
                .post(
                    this.$app.route('promotions.toggle_status', {
                        promotion: id,
                    })
                )
                .then((response) => {
                    this.$app.noty[response.data.status](response.data.message)
                    this.onContextChanged()
                })
                .catch((error) => {
                    this.$app.error(error)
                })
        },
    },
}
</script>
