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
                                          'labels.backend.settings.titles.create'
                                      )
                                    : $t('labels.backend.settings.titles.edit')
                            }}</span>
                        </template>
                        <b-row class="justify-content-center">
                            <b-col xl="12">
                                <b-form-group
                                    :label="$t('validation.attributes.key')"
                                    label-for="key"
                                    :horizontal="true"
                                    :label-cols="3"
                                    :invalid-feedback="feedback('key')"
                                >
                                    <b-form-input
                                        id="key"
                                        name="key"
                                        :placeholder="
                                            $t('validation.attributes.key')
                                        "
                                        v-model="model.key"
                                        :state="state('key')"
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group
                                    :label="$t('validation.attributes.value')"
                                    label-for="value"
                                    :horizontal="true"
                                    :label-cols="3"
                                    :invalid-feedback="feedback('value')"
                                >
                                    <b-form-input
                                        id="value"
                                        name="value"
                                        :placeholder="
                                            $t('validation.attributes.value')
                                        "
                                        v-model="model.value"
                                        :state="state('value')"
                                    ></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row slot="footer">
                            <b-col>
                                <b-btn
                                    to="/settings"
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
                                                'create settings'
                                            )) ||
                                        this.$app.user.can('edit settings')
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

export default {
    name: 'SettingForm',
    mixins: [form],
    data() {
        return {
            modelName: 'setting',
            resourceRoute: 'settings',
            listPath: '/settings',
            translatables: [],
            model: {
                key: null,
                value: null,
            },
        }
    },
}
</script>
