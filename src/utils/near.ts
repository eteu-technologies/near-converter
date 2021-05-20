// import BN from 'bn.js';

export const units = [
    'NEAR',
    'milliNEAR',
    'yoctoNEAR',
    'TGas',
    'GGas',
    'Gas'
];

// 1 ... = x NEAR
// eslint-disable-next-line no-unused-vars
const toNearFromX: {[key: string]: (_: number) => number} = {
    'NEAR': (f: number) => f, // no-op
    'milliNEAR': (f: number) => f * 0.0001,
    'yoctoNEAR': (f: number) => f * Math.pow(10, -24)
};

const precisionTable: {[key: string]: number} = {
    'NEAR': 0,
    'milliNEAR': 4,
    'yoctoNEAR': 24,
};

// X amount of Y in 1 NEAR
// eslint-disable-next-line no-unused-vars
const toXFromNear: {[key: string]: (_: number) => number} = {
    /* Y: X */
    'NEAR': (f: number) => f,
    'milliNEAR': (f: number) => f * 10000,
    'yoctoNEAR': (f: number) => f * Math.pow(10, 24)
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
