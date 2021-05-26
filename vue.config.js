const path = require('path');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
    pages: {
        index: {
            entry: 'src/main.ts',
            title: 'NEAR Unit Converter',
        },
    },
    configureWebpack: {
        plugins: [
            new WasmPackPlugin({
                crateDirectory: path.resolve(__dirname, 'wasm'),
                outDir: path.resolve(__dirname, 'wasm/pkg')
            })
        ]
    }
};
