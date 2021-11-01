<template>
    <div class="animated fadeIn">
        <form @submit.prevent="onSubmit">
            <b-row class="justify-content-center">
                <b-col xl="6">
                    <b-card>
                        <template slot="header">
                            <span class="h3">{{
                                isNew
                                    ? $t('labels.backend.tables.titles.create')
                                    : $t('labels.backend.tables.titles.edit')
                            }}</span>
                        </template>
                        <b-row class="justify-content-center">
                            <b-col xl="12">
                                <b-form-group
                                    :label="
                                        $t('validation.attributes.internal_id')
                                    "
                                    label-class="font-weight-bold"
                                    label-for="internal_id"
                                    :horizontal="true"
                                    :label-cols="3"
                                    :invalid-feedback="feedback('internal_id')"
                                >
                                    <b-form-input
                                        id="internal_id"
                                        name="internal_id"
                                        :placeholder="
                                            $t(
                                                'validation.attributes.internal_id'
                                            )
                                        "
                                        v-model="model.internal_id"
                                        :state="state('internal_id')"
                                    ></b-form-input>
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
                                    :label="$t('validation.attributes.guid')"
                                    label-class="font-weight-bold"
                                    label-for="guid"
                                    :horizontal="true"
                                    :label-cols="3"
                                    :state="state('guid')"
                                    :invalid-feedback="feedback('guid')"
                                >
                                    <b-input-group>
                                        <b-form-input
                                            id="guid"
                                            name="guid"
                                            :placeholder="
                                                $t('validation.attributes.guid')
                                            "
                                            v-model="model.guid"
                                            :state="state('guid')"
                                        ></b-form-input>
                                        <b-input-group-append>
                                            <b-btn
                                                variant="primary"
                                                @click="generateGuid"
                                                >Generate</b-btn
                                            >
                                        </b-input-group-append>
                                    </b-input-group>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row slot="footer">
                            <b-col>
                                <b-btn to="/tables" variant="danger" size="sm">
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
                                                'create tables'
                                            )) ||
                                        this.$app.user.can('edit tables')
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
import { uuid } from 'vue-uuid'

export default {
    name: 'TableForm',
    mixins: [form],
    data() {
        return {
            modelName: 'table',
            resourceRoute: 'tables',
            listPath: '/tables',
            branches: [],
            model: {
                internal_id: null,
                branch: null,
                guid: null,
            },
        }
    },
    async created() {
        let { data } = await axios.get(this.$app.route(`branches.search`))
        this.branches = data.data.map((item) => {
            return { id: item.id, name: item.name }
        })
    },
    methods: {
        generateGuid() {
            this.model.guid = uuid.v4()
        },
    },
}
</script>
