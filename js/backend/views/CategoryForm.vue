<template>
    <div class="animated fadeIn">
        <form @submit.prevent="onSubmit">
            <b-row class="justify-content-center">
                <b-col xl="6">
                    <b-card>
                        <template slot="header">
                            <span class="h3">{{
                                isNew
                                    ? $t(
                                          'labels.backend.categories.titles.create'
                                      )
                                    : $t(
                                          'labels.backend.categories.titles.edit'
                                      )
                            }}</span>
                            <div class="card-header-actions">
                                <b-form-radio-group
                                    buttons
                                    button-variant="outline-secondary"
                                    v-model="locale"
                                    :options="$app.available_locales"
                                    v-if="$app.available_locales.length > 1"
                                    name="locale"
                                ></b-form-radio-group>
                            </div>
                        </template>
                        <b-row class="justify-content-center">
                            <b-col xl="12">
                                <template
                                    v-for="(l, index) in $app.available_locales"
                                >
                                    <b-form-group
                                        :key="`name_${index}`"
                                        :label="
                                            $t(
                                                `validation.attributes.name_locale`,
                                                {
                                                    locale: $t(
                                                        `validation.attributes.${l}_locale`
                                                    ),
                                                }
                                            )
                                        "
                                        label-class="font-weight-bold"
                                        label-for="name"
                                        :horizontal="true"
                                        :label-cols="3"
                                        :invalid-feedback="feedbacks('name', l)"
                                        v-if="locale === l"
                                    >
                                        <b-form-input
                                            :id="`name_${l}`"
                                            :name="`name_${l}`"
                                            :placeholder="
                                                $t(
                                                    `validation.attributes.name_locale`,
                                                    {
                                                        locale: $t(
                                                            `validation.attributes.${l}_locale`
                                                        ),
                                                    }
                                                )
                                            "
                                            v-model="model.name[l]"
                                            :state="states('name')"
                                        ></b-form-input>
                                    </b-form-group>
                                </template>
                                <template
                                    v-for="(l, index) in $app.available_locales"
                                >
                                    <b-form-group
                                        :key="`description_${index}`"
                                        :label="
                                            $t(
                                                `validation.attributes.description_locale`,
                                                {
                                                    locale: $t(
                                                        `validation.attributes.${l}_locale`
                                                    ),
                                                }
                                            )
                                        "
                                        label-for="description"
                                        :horizontal="true"
                                        :label-cols="3"
                                        label-class="font-weight-bold"
                                        :invalid-feedback="
                                            feedbacks('description', l)
                                        "
                                        v-if="locale === l"
                                    >
                                        <b-form-textarea
                                            :rows="3"
                                            :id="`description_${l}`"
                                            :name="`description_${l}`"
                                            :placeholder="
                                                $t(
                                                    `validation.attributes.description_locale`,
                                                    {
                                                        locale: $t(
                                                            `validation.attributes.${l}_locale`
                                                        ),
                                                    }
                                                )
                                            "
                                            v-model="model.description[l]"
                                            :state="states('description')"
                                        ></b-form-textarea>
                                    </b-form-group>
                                </template>
                                <b-form-group
                                    :label="$t('validation.attributes.branch')"
                                    label-class="font-weight-bold"
                                    label-for="branch"
                                    :label-cols="3"
                                    :invalid-feedback="feedback('branch')"
                                    :state="state('branch')"
                                >
                                    <multiselect
                                        v-model="model.branch"
                                        :options="branches"
                                        id="branch"
                                        name="branch"
                                        track-by="id"
                                        label="name"
                                        :searchable="true"
                                        :close-on-select="true"
                                        :show-labels="false"
                                        :placeholder="
                                            '-- ' +
                                            $t('validation.attributes.branch') +
                                            ' --'
                                        "
                                        :state="state('branch')"
                                    ></multiselect>
                                </b-form-group>
                                <b-form-group
                                    :label="$t('validation.attributes.active')"
                                    label-class="font-weight-bold"
                                    label-for="active"
                                    horizontal
                                    :label-cols="4"
                                >
                                    <b-form-checkbox
                                        name="check-button"
                                        v-model="model.active"
                                        switch
                                    ></b-form-checkbox>
                                </b-form-group>
                                <b-form-group
                                    :label="$t('validation.attributes.order')"
                                    label-class="font-weight-bold"
                                    label-for="ordering"
                                    horizontal
                                    :label-cols="3"
                                    :invalid-feedback="feedback('ordering')"
                                >
                                    <b-form-input
                                        id="ordering"
                                        name="ordering"
                                        required
                                        :placeholder="
                                            $t('validation.attributes.order')
                                        "
                                        v-model="model.ordering"
                                        :state="state('ordering')"
                                    ></b-form-input>
                                </b-form-group>
                                <photo
                                    v-model="model.image"
                                    :label="$t('validation.attributes.image')"
                                    field-name="image"
                                    :image-path="model.image_path"
                                ></photo>
                            </b-col>
                        </b-row>

                        <b-row slot="footer">
                            <b-col>
                                <b-btn
                                    to="/categories"
                                    variant="danger"
                                    size="sm"
                                >
                                    {{ $t('buttons.back') }}
                                </b-btn>
                            </b-col>
                            <b-col>
                                <b-btn
                                    type="submit"
                                    variant="success"
                                    size="sm"
                                    class="float-right"
                                    :disabled="pending"
                                    v-if="
                                        (isNew &&
                                            this.$app.user.can(
                                                'create categories'
                                            )) ||
                                        this.$app.user.can('edit categories')
                                    "
                                >
                                    {{
                                        isNew
                                            ? $t('buttons.create')
                                            : $t('buttons.edit')
                                    }}
                                </b-btn>
                            </b-col>
                        </b-row>
                    </b-card>
                    <atom-spinner
                        :animation-duration="1000"
                        :size="400"
                        :color="'#97191D'"
                        :loading="loading"
                        :full="true"
                    ></atom-spinner>
                </b-col>
            </b-row>
        </form>
    </div>
</template>

<script>
import form from '../mixins/form'
import axios from 'axios'
import Photo from './components/Photo'
import { formatting_numeric } from '../../libraries/helpers'

export default {
    name: 'CategoryForm',
    components: { Photo },
    mixins: [form],
    data() {
        return {
            modelName: 'category',
            resourceRoute: 'categories',
            listPath: '/categories',
            translatables: ['name', 'description'],
            branches: [],
            model: {
                name: {},
                description: {},
                branch: null,
                active: true,
                ordering: 1000,
                image: null,
                image_path: null,
            },
        }
    },
    watch: {
        'model.ordering': function (newValue) {
            if (newValue) {
                const result = formatting_numeric(newValue)
                this.$nextTick(() => (this.model.ordering = result))
            }
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
