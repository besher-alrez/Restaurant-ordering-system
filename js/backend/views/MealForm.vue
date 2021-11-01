<template>
    <div class="animated fadeIn">
        <form @submit.prevent="onSubmit">
            <b-row class="justify-content-center">
                <b-col xl="12">
                    <b-card>
                        <template slot="header">
                            <span class="h3">{{
                                isNew
                                    ? $t('labels.backend.meals.titles.create')
                                    : $t('labels.backend.meals.titles.edit')
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
                            <b-col xl="6">
                                <template
                                    v-for="(l, index) in $app.available_locales"
                                >
                                    <b-form-group
                                        :key="`name_${index}`"
                                        label-class="font-weight-bold"
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
                                <b-form-group
                                    :label="
                                        $t('validation.attributes.category')
                                    "
                                    label-class="font-weight-bold"
                                    label-for="category"
                                    :label-cols="3"
                                    :invalid-feedback="feedback('category')"
                                    :state="state('category')"
                                >
                                    <multiselect
                                        v-model="model.category"
                                        :options="categories"
                                        id="category"
                                        name="category"
                                        track-by="id"
                                        label="name"
                                        :searchable="true"
                                        :close-on-select="true"
                                        :show-labels="false"
                                        :placeholder="
                                            '-- ' +
                                            $t(
                                                'validation.attributes.category'
                                            ) +
                                            ' --'
                                        "
                                        :state="state('category')"
                                    ></multiselect>
                                </b-form-group>
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
                                    :label="$t('validation.attributes.status')"
                                    label-class="font-weight-bold"
                                    label-for="status"
                                    :horizontal="true"
                                    :label-cols="3"
                                    :invalid-feedback="feedback('status')"
                                    :state="state('status')"
                                >
                                    <b-form-radio-group
                                        id="btn-radios-1"
                                        v-model="model.status"
                                        :options="statuses"
                                        buttons
                                        button-variant="outline-primary"
                                        name="radios-btn-default"
                                        size="sm"
                                        :state="state('status')"
                                    ></b-form-radio-group>
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
                            </b-col>
                            <b-col xl="6">
                                <template
                                    v-for="(l, index) in $app.available_locales"
                                >
                                    <b-form-group
                                        :key="`description_${index}`"
                                        label-class="font-weight-bold"
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
                                        :label-cols-md="3"
                                        :label-cols="12"
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
                                    :label="$t('validation.attributes.price')"
                                    label-class="font-weight-bold"
                                    label-for="name"
                                    horizontal
                                    :label-cols="3"
                                    :invalid-feedback="feedback('price')"
                                >
                                    <b-form-input
                                        id="price"
                                        name="price"
                                        required
                                        :placeholder="
                                            $t('validation.attributes.price')
                                        "
                                        v-model="model.price"
                                        :state="state('price')"
                                    ></b-form-input>
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
                                <b-btn to="/meals" variant="danger" size="sm">
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
                                                'create meals'
                                            )) ||
                                        this.$app.user.can('edit meals')
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
import Photo from './components/Photo'
import axios from 'axios'
import { formatting_numeric } from '../../libraries/helpers'

export default {
    name: 'MealForm',
    components: { Photo },
    mixins: [form],
    data() {
        return {
            modelName: 'meal',
            resourceRoute: 'meals',
            listPath: '/meals',
            translatables: ['name', 'description'],
            branches: [],
            categories: [],
            statuses: [
                { text: 'Sold out', value: 0 },
                { text: 'Available', value: 1 },
            ],
            model: {
                name: {},
                description: {},
                branch: null,
                category: null,
                image: null,
                image_path: null,
                status: null,
                active: true,
                ordering: 1000,
                price: null,
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
        ;({ data } = await axios.get(this.$app.route(`categories.search`), {
            params: {
                perPage: 200,
            },
        }))
        this.categories = data.data.map((item) => {
            return { id: item.id, name: item.category_name }
        })
    },
}
</script>
