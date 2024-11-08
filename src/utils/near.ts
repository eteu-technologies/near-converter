// import BN from 'bn.js';

export const units = [
    'NEAR',
    'milliNEAR',
    'yoctoNEAR',
    'TGas', // Currently 1 TGas = 100 million yoctoNEAR. Subject to change in the future.
    // 'GGas',
    // 'Gas'
];

// 1 ... = x NEAR
// eslint-disable-next-line no-unused-vars
const toNearFromX: {[key: string]: (_: number) => number} = {
    'NEAR': (f: number) => f, // no-op
    'milliNEAR': (f: number) => f * 0.001,
    'yoctoNEAR': (f: number) => f * Math.pow(10, -24),
    'TGas': (f: number) => f * Math.pow(10, -5)
};

const precisionTable: {[key: string]: number} = {
    'NEAR': 0,
    'milliNEAR': 3,
    'yoctoNEAR': 24,
    'TGas': 0
};

// X amount of Y in 1 NEAR
// eslint-disable-next-line no-unused-vars
const toXFromNear: {[key: string]: (_: number) => number} = {
    /* Y: X */
    'NEAR': (f: number) => f,
    'milliNEAR': (f: number) => f * 1000,
    'yoctoNEAR': (f: number) => f * Math.pow(10, 24),
    'TGas': (f: number) => f * Math.pow(10, 5)
};

export const convertNear = ({ value, from, to }: { value: number; from: string; to: string }): [ number, number ] => {
    const precision = precisionTable[from];

    if (from === to) {
        return [ value, precision ];
    }

    const normalized = toNearFromX[from](value);
    const converted = toXFromNear[to](normalized);

    return [ converted, precision ];
};

export const scientificToString = (value: number): string => {
    return (''+value).replace(/(-?)(\d*)\.?(\d+)e([+-]\d+)/, function(a, b, c, d, e) {
        return e < 0
            ? b + '0.' + Array(1-e-c.length).join('0') + c + d
            : b + c + d + Array(e-d.length+1).join('0');
    });
};

export const readable = (value: number, precision: number): string => {
    const hasDecimal = (value % 1) !== 0;
    return hasDecimal ? value.toFixed(precision) : scientificToString(value);
};
