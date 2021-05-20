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
import { Watch } from 'vue-property-decorator';
import { WithoutWatchers } from '@/mixins/watcher';
import Component, { mixins } from 'vue-class-component';
import { units, convertNear, readable } from '@/utils/near';

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

@Component
export default class Converter extends mixins(WithoutWatchers) {

    values: ConverterValues = {
        from: null,
        to: null,
        raw: {
            from: null,
            to: null,
        }
    }

    selection: ConverterSelection = {
        from: 'NEAR',
        to: 'yoctoNEAR'
    }

    get units() {
        return units;
    }

    @Watch('values.from')
    fromChanged(newVal: string) {
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

        // Don't trigger 'values.to' watcher
        this.withoutWatchers(() => {
            // Convert raw value to human readable string
            this.values.to = readable(converted, precision);
        });
    }

    @Watch('values.to')
    toChanged(newVal: string) {
        if (this.selection.to === this.selection.from) {
            this.values.from = this.values.raw.to = this.values.raw.from = newVal;
            return;
        }
        this.values.raw.to = parseFloat(newVal) || 0.0;

        // Convert from value to NEAR
        const [converted, precision] = convertNear({
            value: this.values.raw.to,
            from: this.selection.to,
            to: this.selection.from
        });
        this.values.raw.from = converted;

        // Don't trigger 'values.to' watcher
        this.withoutWatchers(() => {
            // Convert raw value to human readable string
            this.values.from = readable(converted, precision);
        });
    }

    select(type: string, unit: string) {
        if (type === 'from') {
            this.selection.from = unit;
        } else {
            this.selection.to = unit;
        }
    }
}
</script>

<style scoped>
#converter {
    min-width: 450px;
    max-width: 450px
}
</style>
