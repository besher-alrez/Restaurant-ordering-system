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
                                          'labels.backend.promotions.titles.create'
                                      )
                                    : $t(
                                          'labels.backend.promotions.titles.edit'
                                      )
                            }}</span>
                        </template>
                        <b-row class="justify-content-center">
                            <b-col xl="12">
                                <b-form-group
                                    :label="
                                        $t('validation.attributes.is_active')
                                    "
                                    label-class="font-weight-bold"
                                    label-for="is_active"
                                    :horizontal="true"
                                    :label-cols="4"
                                    :invalid-feedback="feedback('is_active')"
                                    :state="state('is_active')"
                                >
                                    <b-form-checkbox
                                        name="check-button"
                                        v-model="model.is_active"
                                        :unchecked-value="0"
                                        :value="1"
                                        switch
                                        :state="state('is_active')"
                                    ></b-form-checkbox>
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
                                        @input="model.meal = null"
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

                                <photo
                                    v-model="model.image"
                                    :label="$t('validation.attributes.image')"
                                    field-name="image"
                                    :image-path="model.image_path"
                                ></photo>

                                <b-form-group
                                    :label="$t('validation.attributes.meal')"
                                    label-class="font-weight-bold"
                                    label-for="meal"
                                    :label-cols="3"
                                    :invalid-feedback="feedback('meal')"
                                    :state="state('meal')"
                                    v-if="meals.length"
                                >
                                    <multiselect
                                        v-model="model.meal"
                                        :options="current_branch_meals"
                                        id="meal"
                                        name="meal"
                                        track-by="id"
                                        label="name"
                                        :searchable="true"
                                        :close-on-select="true"
                                        :show-labels="false"
                                        group-values="meals"
                                        group-label="category"
                                        :placeholder="
                                            $t('validation.attributes.meal')
                                        "
                                        :state="state('meal')"
                                    ></multiselect>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row slot="footer">
                            <b-col>
                                <b-btn
                                    to="/promotions"
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
                                                'create promotions'
                                            )) ||
                                        this.$app.user.can('edit promotions')
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
import { mapGetters } from 'vuex'

export default {
    name: 'PromotionForm',
    components: { Photo },
    mixins: [form],
    data() {
        return {
            modelName: 'promotion',
            resourceRoute: 'promotions',
            listPath: '/promotions',
            branches: [],
            model: {
                is_active: null,
                branch: null,
                image: null,
                image_path: null,
                meal: null,
            },
        }
    },
    computed: {
        ...mapGetters(['meals']),
        current_branch_meals() {
            return this.model.branch && this.meals.length
                ? this.meals.filter((i) => {
                      console.log(i)
                      return (
                          parseInt(this.model.branch.id) ===
                          parseInt(i.branch_id)
                      )
                  })
                : []
        },
    },
    async created() {
        await this.$store.dispatch('GET_MEALS')
        let { data } = await axios.get(this.$app.route(`branches.search`))
        this.branches = data.data.map((item) => {
            return { id: item.id, name: item.name }
        })
    },
}
</script>
