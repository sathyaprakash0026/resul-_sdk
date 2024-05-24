const fs = require('fs');
import { terser } from 'rollup-plugin-terser';
import define from 'rollup-plugin-define';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const buildConfigFile = fs.readFileSync('./build_config/swBuildLog.json');

const _date = new Date();
let FileContent = JSON.parse(buildConfigFile);

function buildSW() {
    !FileContent.version ? FileContent.version = 0 : FileContent.version;
    FileContent.version = (Number(parseFloat(FileContent.version).toFixed(1)) + 0.1).toFixed(1);
    FileContent.lastUpdated = `${_date.toDateString()} : ${_date.toTimeString().split(' ')[0]}`;

    fs.writeFileSync('./build_config/swBuildLog.json', JSON.stringify(FileContent));

    return {
        input: './firebase-messaging-sw-input.js',
        output: [
            {
                file: 'common/scripts/push-sw.js',
                format: 'iife',
                compact: true,
                plugins: [
                    terser(),
                    define({
                        replacements: {
                            __buildDate__: () => JSON.stringify(FileContent.lastUpdated),
                            __buildVersion__: () => FileContent.version,
                        }
                    })
                ]
            }
        ],
        plugins: [nodeResolve(), commonjs()]
    }
}

export default buildSW();
