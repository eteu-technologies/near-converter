<template>
    <b-card id="converter" header="Convert">
        <b-form-group label="From:" :description="readableFrom">
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
        <b-form-group label="To:" :description="readableTo">
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

    get readableFrom() {
        const value = this.values.from ?? 0;
        return `Converting from ${value} ${this.selection.from}`;
    }

    get readableTo() {
        const value = this.values.to ?? 0;
        return `Converted to ${value} ${this.selection.to}`;
    }

    @Watch('values.from')
    fromChanged(value: string) {
        this.convert('from', value);
    }

    @Watch('values.to')
    toChanged(newVal: string) {
        this.convert('to', newVal);
    }

    @Watch('selection.from')
    selectionFromChanged() {
        this.convert('from', this.values.from);
    }

    @Watch('selection.to')
    selectionToChanged() {
        this.convert('to', this.values.to);
    }

    select(type: string, unit: string) {
        if (type === 'from') {
            this.selection.from = unit;
        } else {
            this.selection.to = unit;
        }
    }

    convert(source: string, value: string) {
        const destination = source === 'from' ? 'to' : 'from';
        if (this.selection.from === this.selection.to) {
            this.values[destination] = this.values.raw[source] = this.values.raw[destination] = value;
            return;
        }
        this.values.raw[source] = parseFloat(value) || 0.0;

        // Convert from value to NEAR
        const [converted, precision] = convertNear({
            value: this.values.raw[source],
            from: this.selection[source],
            to: this.selection[destination]
        });
        this.values.raw[destination] = converted;

        // Don't trigger watchers
        this.withoutWatchers(() => {
            // Convert raw value to human readable string
            this.values[destination] = readable(converted, precision);
        });
    }
}
</script>

<style scoped>
#converter {
    min-width: 450px;
    max-width: 450px
}
</style>
