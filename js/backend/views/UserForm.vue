<template>
    <div>
        <form @submit.prevent="onSubmit">
            <b-row class="justify-content-center">
                <b-col xl="6" md="8">
                    <b-card>
                        <h3 class="card-title" slot="header">
                            {{
                                isNew
                                    ? $t('labels.backend.users.titles.create')
                                    : $t('labels.backend.users.titles.edit')
                            }}
                        </h3>

                        <b-form-group
                            :label="$t('validation.attributes.name')"
                            label-class="font-weight-bold"
                            label-for="name"
                            horizontal
                            :label-cols="3"
                            :invalid-feedback="feedback('name')"
                        >
                            <b-form-input
                                id="name"
                                name="name"
                                required
                                :placeholder="$t('validation.attributes.name')"
                                v-model="model.name"
                                :state="state('name')"
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            :label="$t('validation.attributes.email')"
                            label-class="font-weight-bold"
                            label-for="email"
                            horizontal
                            :label-cols="3"
                            :invalid-feedback="feedback('email')"
                        >
                            <b-form-input
                                id="email"
                                name="email"
                                type="email"
                                required
                                :placeholder="$t('validation.attributes.email')"
                                v-model="model.email"
                                :state="state('email')"
                            ></b-form-input>
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
                            :label="$t('validation.attributes.password')"
                            label-class="font-weight-bold"
                            label-for="password"
                            horizontal
                            :label-cols="3"
                            :invalid-feedback="feedback('password')"
                        >
                            <b-form-input
                                id="password"
                                name="password"
                                type="password"
                                :placeholder="
                                    $t('validation.attributes.password')
                                "
                                v-model="model.password"
                                :state="state('password')"
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            :label="
                                $t(
                                    'validation.attributes.password_confirmation'
                                )
                            "
                            label-for="password_confirmation"
                            label-class="font-weight-bold"
                            horizontal
                            :label-cols="3"
                            :invalid-feedback="
                                feedback('password_confirmation')
                            "
                        >
                            <b-form-input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                :placeholder="
                                    $t(
                                        'validation.attributes.password_confirmation'
                                    )
                                "
                                v-model="model.password_confirmation"
                                :state="state('password_confirmation')"
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            :label="$t('validation.attributes.roles')"
                            label-class="font-weight-bold"
                            label-for="roles"
                            horizontal
                            :label-cols="3"
                        >
                            <b-form-checkbox-group
                                stacked
                                v-model="model.roles"
                                name="roles[]"
                            >
                                <b-form-checkbox
                                    v-for="role in roles"
                                    :key="role.id"
                                    v-b-tooltip.left
                                    :title="role.description"
                                    :value="role.id"
                                >
                                    {{ role.display_name }}
                                </b-form-checkbox>
                            </b-form-checkbox-group>
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

                        <b-row slot="footer">
                            <b-col>
                                <b-btn
                                    :to="{ name: 'users' }"
                                    exact
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
                                        isNew ||
                                        this.$app.user.can('edit users')
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
import axios from 'axios'
import form from '../mixins/form'

export default {
    name: 'UserForm',
    mixins: [form],
    data() {
        return {
            roles: [],
            modelName: 'user',
            resourceRoute: 'users',
            listPath: '/Access/users',
            branches: [],
            model: {
                name: null,
                email: null,
                active: true,
                password: null,
                confirm_password: null,
                roles: [],
                branch: null,
            },
        }
    },
    async created() {
        this.fetchData()
        let { data } = await axios.get(this.$app.route(`users.get_roles`))
        this.roles = data
        ;({ data } = await axios.get(this.$app.route(`branches.search`)))
        this.branches = data.data.map((item) => {
            return { id: item.id, name: item.name }
        })
    },
    methods: {
        onModelChanged() {
            if (this.model.roles) {
                this.model.roles = this.model.roles.map((item) => {
                    return item.id
                })
            }
        },
    },
}
</script>
