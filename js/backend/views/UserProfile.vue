<template>
    <div class="animated fadeIn">
        <form @submit.prevent="onSubmit">
            <b-row class="justify-content-center">
                <b-col xl="6">
                    <b-card>
                        <h4 slot="header">
                            {{ $t('labels.backend.users.titles.profile') }}
                        </h4>

                        <b-form-group
                            :label="$t('validation.attributes.name')"
                            label-for="name"
                            :horizontal="true"
                            :label-cols="4"
                        >
                            <b-form-input
                                :placeholder="$t('validation.attributes.name')"
                                disabled
                                :value="$app.user.name"
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            :label="$t('validation.attributes.email')"
                            label-for="email"
                            :horizontal="true"
                            :label-cols="4"
                        >
                            <b-form-input
                                :placeholder="$t('validation.attributes.email')"
                                disabled
                                :value="$app.user.email"
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            :label="$t('validation.attributes.password')"
                            label-for="password"
                            :horizontal="true"
                            :label-cols="4"
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
                            :horizontal="true"
                            :label-cols="4"
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

                        <b-row slot="footer">
                            <b-col>
                                <b-btn
                                    @click="$router.go(-1)"
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
                                >
                                    {{ $t('buttons.edit') }}
                                </b-btn>
                            </b-col>
                        </b-row>
                    </b-card>
                    <atom-spinner
                        :animation-duration="1000"
                        :size="200"
                        :color="'#97191D'"
                        :loading="loading"
                        :full="full_loader"
                    ></atom-spinner>
                </b-col>
            </b-row>
        </form>
    </div>
</template>

<script>
import form from '../mixins/form'

export default {
    name: 'UserProfile',
    mixins: [form],
    data() {
        return {
            roles: [],
            modelName: 'user',
            resourceRoute: 'users',
            model: {
                id: this.$app.user.id,
                password: null,
                confirm_password: null,
            },
            fetch: false,
            url: this.$app.route(`users.update_profile`),
        }
    },
    computed: {
        isNew() {
            return false
        },
    },
    methods: {},
}
</script>
