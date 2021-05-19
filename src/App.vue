<template>
    <b-container>
        <b-row>
            <div class="vh-100 vw-100 col d-flex align-items-center justify-content-center">
                <converter></converter>
            </div>
        </b-row>
    </b-container>
</template>

<script>
import Converter from '@/components/Converter';

export default {
    name: 'App',
    components: {
        Converter
    },
    data: () => {
        return {};
    }
};
</script>

<style lang="scss">

</style>
