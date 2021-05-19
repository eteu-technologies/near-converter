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
const toNearFromX = {
    'NEAR': f => f, // no-op
    'milliNEAR': f => f * 0.0001,
    'yoctoNEAR': f => f * Math.pow(10, -24)
};

const precisionTable = {
    'NEAR': 0,
    'milliNEAR': 4,
    'yoctoNEAR': 24,
};

// X amount of Y in 1 NEAR
const toXFromNear = {
    /* Y: X */
    'NEAR': f => f,
    'milliNEAR': f => f * 10000,
    'yoctoNEAR': f => f * Math.pow(10, 24)
};

export const convertNear = ({ value, from, to }) => {
    if (from === to) {
        return value;
    }

    const normalized = toNearFromX[from](value);
    const converted = toXFromNear[to](normalized);
    const precision = precisionTable[from];

    return [ converted, precision ];
};
