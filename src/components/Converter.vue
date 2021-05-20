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

<script lang="ts">
import Vue from 'vue';
import { units, convertNear } from '@/utils/near';
// import BN from 'bn.js';

interface ConverterState {
    values: ConverterValues;
    selection: ConverterSelection;
}

interface ConverterValues {
    from: string | null;
    to: string | null;
    raw: {
        from: number | string | null;
        to: number | string | null;
    };
}

interface ConverterSelection {
    from: string;
    to: string;
}

export default Vue.extend({
    name: 'Converter',
    data: (): ConverterState => {
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
    computed: {
        units: () => {
            return units;
        }
    },
    watch: {
        'values.from': function(newVal: string) {
            if (this.selection.from === this.selection.to) {
                this.values.to = this.values.raw.from = this.values.raw.to = newVal;
                return;
            }
            this.values.raw.from = parseFloat(newVal) || 0.0;

            // Convert from value to NEAR
            const [converted, precision] = convertNear({
                value: this.values.raw.from,
                from: this.selection.from,
                to: this.selection.to
            });

            this.values.raw.to = converted;

            // do not look at this code pls
            const hasDecimal = (converted % 1) !== 0;
            if (hasDecimal) {
                this.values.to = converted.toFixed(precision);
            } else {
                this.values.to = BigInt(converted).toString();
            }
        },
        'values.to': function(newVal: string | null, oldVal: string | null) {
            console.debug('changed from %s to %s', oldVal, newVal);
        }
    },
    created() {
        // console.log(u);
    },
    methods: {
        select(type: string, unit: string) {
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
