<template>
    <b-card id="converter" header="NEAR Unit Converter">
        <b-form-group label="From:" :description="readableFrom">
            <b-input-group>
                <b-form-input type="number" id="from-input" v-model="values.from"></b-form-input>
                <template #prepend v-if="canCopy">
                    <b-button v-b-tooltip.click.left title="Copied to clipboard!" @click="copy('from')" variant="secondary"><i class="fas fa-clipboard"></i></b-button>
                </template>
                <template #append>
                    <b-dropdown :text="selection.from" variant="primary">
                        <template v-for="unit in units">
                            <b-dropdown-item @click="select('from', unit)" v-if="unit !== selection.from" :key="unit">{{ unit }}</b-dropdown-item>
                        </template>
                    </b-dropdown>
                </template>
            </b-input-group>
        </b-form-group>
        <b-form-group label="To:" :description="readableTo">
            <b-input-group>
                <b-form-input type="number" id="to-input" v-model="values.to"></b-form-input>
                <template #prepend v-if="canCopy">
                    <b-button v-b-tooltip.click.left title="Copied to clipboard!" @click="copy('to')" variant="secondary"><i class="fas fa-clipboard"></i></b-button>
                </template>
                <template #append>
                    <b-dropdown :text="selection.to" variant="primary">
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
import {BvEvent} from 'bootstrap-vue';

interface ConverterValuesRaw {
    [index: string]: number | string | null
    from: number | string | null;
    to: number | string | null;
}

interface ConverterValues {
    [index: string]: string | null
    from: string | null;
    to: string | null;
}

interface ConverterSelection {
    [index: string]: string
    from: string;
    to: string;
}

@Component
export default class Converter extends mixins(WithoutWatchers) {

    values: ConverterValues = {
        from: null,
        to: null,
    }

    raw: ConverterValuesRaw = {
        from: null,
        to: null
    }

    selection: ConverterSelection = {
        from: 'NEAR',
        to: 'yoctoNEAR'
    }

    get units() {
        return units;
    }

    get canCopy() {
        return !!navigator.clipboard;
    }

    get readableFrom() {
        const value = this.values.from ?? 0;
        return `Converting from ${value} ${this.selection.from}`;
    }

    get readableTo() {
        const value = this.values.to ?? 0;
        return `Converted to ${value} ${this.selection.to}`;
    }

    created() {
        this.$root.$on('bv::tooltip::shown', (e: BvEvent) => {
            setTimeout(() => {
                this.$root.$emit('bv::hide::tooltip', e.componentId);
            }, 2000);
        });
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
        if (this.values.from) {
            this.convert('from', this.values.from);
        }
    }

    @Watch('selection.to')
    selectionToChanged() {
        if (this.values.to) {
            this.convert('to', this.values.to);
        }
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
            this.values[destination] = this.raw[source] = this.raw[destination] = value;
            return;
        }
        const parsedValue = parseFloat(value) || 0.0;
        this.raw[source] = parsedValue;

        const [converted, precision] = convertNear({
            value: parsedValue,
            from: this.selection[source],
            to: this.selection[destination]
        });
        this.raw[destination] = converted;

        // Don't trigger watchers
        this.withoutWatchers(() => {
            // Convert raw value to human readable string
            this.values[destination] = readable(converted, precision);
        });
    }

    async copy(target: string) {
        const value = this.values[target];
        if (!value || !this.canCopy) {
            return;
        }
        try {
            await navigator.clipboard.writeText(value);
        } catch (e) {
            console.log(e);
        }
    }
}
</script>
