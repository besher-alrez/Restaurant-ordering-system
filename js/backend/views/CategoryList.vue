<template>
    <div class="animated fadeIn">
        <b-card>
            <template slot="header" class="card-header">
                <span class="h3">
                    {{ $t('labels.backend.categories.titles.index') }}
                </span>
                <div class="card-header-actions">
                    <b-form-radio-group
                        buttons
                        button-variant="outline-secondary"
                        v-model="locale"
                        :options="$app.available_locales"
                        name="locale"
                        v-if="$app.available_locales.length > 1"
                    ></b-form-radio-group>
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
                            :to="{ name: 'categories_create' }"
                            size="sm"
                            variant="primary"
                            v-b-tooltip.hover
                            :title="$t('buttons.categories.create')"
                            v-if="$app.user.can('create categories')"
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
                search-route="categories.search"
                delete-route="categories.destroy"
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
                    sort-by="ordering"
                    :sort-desc="false"
                    :busy.sync="isBusy"
                >
                    <template v-slot:cell(id)="row">
                        <router-link
                            v-if="row.item.can_edit"
                            :to="{
                                name: 'categories_edit',
                                params: { id: row.item.id },
                            }"
                            v-text="row.value"
                        ></router-link>
                        <span v-else v-text="row.value"></span>
                    </template>
                    <template v-slot:cell(image)="row">
                        <img
                            class="img-thumbnail"
                            :src="row.item.image_path"
                            :alt="row.item.title"
                            width="100"
                        />
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-btn-group>
                            <b-btn
                                v-if="row.item.can_edit"
                                size="sm"
                                variant="primary"
                                :to="{
                                    name: 'categories_edit',
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
import Multiselect from 'vue-multiselect'
import axios from 'axios'

export default {
    name: 'CategoryList',
    components: {
        Multiselect,
    },
    mixins: [list],
    data() {
        return {
            isBusy: false,
            item_type: 'category',
            extraSearchCriteria: {
                branch: null,
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
                    key: 'category_name',
                    label: this.$t('validation.attributes.name'),
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
                    key: 'ordering',
                    label: this.$t('validation.attributes.order'),
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
                this.$app.user.can('edit categories') ||
                this.$app.user.can('delete categories')
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
}
</script>
