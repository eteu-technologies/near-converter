<template>
    <b-container>
        <b-row>
            <div class="vh-100 vw-100 col d-flex align-items-center justify-content-center">
                <converter></converter>
            </div>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Converter from '@/components/Converter.vue';
import Vue from 'vue';

@Component({
    components: {
        Converter
    },
})
export default class App extends Vue {}
</script>

<style lang="scss">

</style>
