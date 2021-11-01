<template>
    <AppFooter>
        <span>
            <strong>
                <span>Copyright &copy; {{ new Date().getFullYear() }}</span>
                <a href="/" target="_blank">{{ name }}</a>
            </strong>
            . {{ $t('labels.all_rights_reserved') }}
        </span>
        <span class="ml-auto">
            <template v-if="editorName !== ''">
                <template v-if="editorSiteUrl !== ''">
                    <font-awesome-icon icon="code"></font-awesome-icon>
                    {{ $t('labels.with') }}
                    <font-awesome-icon icon="heart"></font-awesome-icon>
                    {{ $t('labels.by') }}
                    <a :href="editorSiteUrl" target="_blank">
                        <strong>{{ editorName }}</strong>
                    </a>
                </template>
                <template v-else>
                    <font-awesome-icon icon="code"></font-awesome-icon>
                    {{ $t('labels.with') }}
                    <font-awesome-icon icon="heart"></font-awesome-icon>
                    {{ $t('labels.by') }}
                    <strong>{{ editorName }}</strong>
                </template>
            </template>
        </span>
    </AppFooter>
</template>

<script>
import AppFooter from '../../vendor/coreui/components/Footer/Footer'
export default {
    name: 'Footer',
    components: {
        AppFooter,
    },
    props: {
        name: {
            type: String,
            default: '',
        },
        editorName: {
            type: String,
            default: '',
        },
        editorSiteUrl: {
            type: String,
            default: '',
        },
    },
}
</script>
