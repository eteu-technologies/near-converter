<template>
    <b-card id="converter" header="Convert">
        <pre>{{ values }} {{ selection }}</pre>
        <b-form-group label="From:" :description="`Converting from ${values.from}`">
            <b-input-group>
                <b-form-input type="number" v-model="values.from"></b-form-input>
                <template #append>
                    <b-dropdown :text="selection.from">
                        <template v-for="unit in units">
                            <b-dropdown-item @click="select('from', unit)" v-if="unit !== selection.from" :key="unit">{{ unit }}</b-dropdown-item>
                        </template>
                    </b-dropdown>
                </template>
            </b-input-group>
        </b-form-group>
        <b-form-group label="To:" :description="`Converted to ${values.to}`">
            <b-input-group>
                <b-form-input type="number" v-model="values.to"></b-form-input>
                <template #append>
                    <b-dropdown :text="selection.to">
                        <template v-for="unit in units">
                            <b-dropdown-item @click="select('to', unit)" v-if="unit !== selection.to" :key="unit">{{ unit }}</b-dropdown-item>
                        </template>
                    </b-dropdown>
                </template>
            </b-input-group>
        </b-form-group>
    </b-card>
</template>

<script>
import Vue from 'vue';
import { units, convertNear } from '@/utils/near';
// import BN from 'bn.js';

export default Vue.extend({
    name: 'Converter',
    data: () => {
        return {
            values: {
                from: null,
                to: null,
                raw: {
                    from: null,
                    to: null,
                }
            },
            selection: {
                from: 'NEAR',
                to: 'yoctoNEAR'
            }
        };
    },
    filters: {
        toFixed(value) {
            return value.toFixed(24);
        }
    },
    computed: {
        units: () => {
            return units;
        }
    },
    watch: {
        'values.from': function(newVal) {
            this.values.raw.from = newVal;

            // Convert from value to NEAR
            const [converted, precision] = convertNear({
                value: newVal,
                from: this.selection.from,
                to: this.selection.to
            });

            this.values.raw.to = converted;

            // do not look at this code pls
            const fixed = converted.toFixed(precision);
            const [firstHalf, secondHalf] = fixed.split('.', 2);
            if (firstHalf.includes('e')) {
                this.values.to = converted.toLocaleString('fullwide', { useGrouping: false });
            } else if (!!secondHalf && Array.from(secondHalf).every(c => c === '0')) {
                this.values.to = fixed.substring(0, fixed.indexOf('.'));
            } else {
                this.values.to = fixed;
            }
        },
        'values.to': function(newVal, oldVal) {
            console.log('changed to', newVal, oldVal);
        }
    },
    created() {
        // console.log(u);
    },
    methods: {
        select(type, unit) {
            if (type === 'from') {
                this.selection.from = unit;
            } else {
                this.selection.to = unit;
            }
        }
    }
});
</script>

<style scoped>
#converter {
    min-width: 450px;
    max-width: 450px
}
</style>
