const fs = require('fs');
import { terser } from 'rollup-plugin-terser';
import define from 'rollup-plugin-define';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const _tenant = require('./build_config/tenants.config');
const buildConfigFile = fs.readFileSync('./build_config/buildLog.json');

const _date = new Date();
let FileContent = JSON.parse(buildConfigFile);

let bundles = [
    {
        input: 'src/index.js',
        output: [
            {
                dir: 'common/scripts',
                format: 'iife',
                compact: true,
                plugins: [
                    terser(),
                    define({
                        replacements: {
                            __buildDate__: () => JSON.stringify(new Date()),
                            __tenantDetails__: () => JSON.stringify({
                                _tenantId: "f4f0811b_658c_45e7_9432_2f307b93c235",
                                ga_id: 101174568
                            }),
                        }
                    })
                ]
            }
        ],
        plugins: [nodeResolve(), commonjs()]
    },
    {
        input: 'src/app.js',
        output: [
            {
                dir: 'common/scripts',
                format: 'iife',
                inlineDynamicImports: true,
                compact: true,
                plugins: [terser()]
            }
        ],
        plugins: [nodeResolve(), commonjs()]
    }
];



const tenantsToBuild = [
    "f4f0811b_658c_45e7_9432_2f307b93c235",
    "fc8bd0d7_e5ab_4abc_b6c9_aa5174ca9961",
    "a4ecfc16_435d_4fcb_8941_4b6f404ffb3a",
    "ea22b2a9_34f4_498c_ae29_374ec855d2ad",
    "41a9ba6e_c91f_4821_96d5_9d41b5d5cde2",
    "a7f485a8_7d7a_4548_9fb0_b5cf0c0a1144",
    "b504895e_bb56_4a09_b716_b8d35a4b907e",
    "125b96f5_a394_4583_b74f_7af811997cbc",
    "b566e1ff_4b48_4da8_be32_433a27078ed9",
    "ee195c0a_b80f_4ea8_94f6_29c3519f2412",
    "421c79d5_c9e9_463e_9dce_10a447f56739",
    "41a50569_bcb3_48d2_b1c6_ab058beecf88",
    "d822ad30_b9ad_4b32_a0a7_ae7331f61a3d",
    "1806c8ec_5410_4924_b904_8d35fd0a8df8",
    "a79813f2_516e_4afb_8cd7_7ae9502ff801",
    "3e3ecaf4_e2c4_4b87_9a46_7ef92babbb30",
    "34e3ef43_9dbd_47eb_b615_1e2970f596a7",
    "8112bc0d_68ee_45cc_a86d_1ab9f47e35d1",
    "a0ed148c_b796_40b6_a49d_b2dca68bbff5",
    "92e3a192_77e8_4f66_837c_34234bea7ce7",
    "0dcb358a_9f41_4460_bf56_f337adc920b7",
    "4e4918f0_4492_4a04_981b_227d7dfb4c0d",
    "067ed086_54cc_4d60_8f65_65e473006cc8",
    "34e0cc3d_8b91_4a64_a939_69ff0e327e2f",
    "877b5c34_5845_4dbd_8771_2676a8db34e9",
    "da0cab23_d7fd_45a6_897c_4c9b4c90d24b",
    "f9f1d5a2_7e49_4818_b352_5c1986c88d87",
    "6f931f29_fac5_4b26_8125_5d9d5eaa4915",
    "92d26c94_ee25_4aef_acd0_e2cd4422fdf2",
    "1785cea9_0d7f_43af_ac29_78fc995d3c8c",
    "25813d86_3da5_46b0_b08b_08ba3b2f1b5e",
    "87b0a642_a582_40a9_bad2_4886f444e562",
    "c5e89d70_5367_49a7_9c58_8825a3e8df34",
    "859c75f0_d932_4d75_82e4_33f31700ac22",
    "593c6b69_5477_43ed_bae3_c2caff2aeac7",
    "83465899_92c1_4b22_8536_a89afc7c9aac",
    "b96a11d3_6a11_407c_a35c_c0af4303ceba",
    "742ea74c_d35e_424b_af9e_d9501000caa8",
    "49886990_6cbf_422c_bf5d_8c91350dc525",
    "7237b71b_b4bd_4084_8b6e_d32a32dfc266",
    "3e4f2ac6_21e3_43d6_a3eb_831f326dd99a",
    "58c76f02_0d82_4bab_beeb_995d45fd532b",
    "1cdcb6b6_2b65_4908_bd02_1da6c75fd014",
    "39d4ecc6_a0e0_46d8_870d_3368e9a2a347",
    "e0e1d2cb_0474_4bef_875f_cfdb8f2298a6",
    "f9be026a_2331_496e_838f_4461f57588fc",
    "cffd30fd_c454_4b3a_9adc_1d0b2928d73a"
].map(module => {

    if (!FileContent[_tenant(module)._tenantId]) {
        FileContent[_tenant(module)._tenantId] = {}
    }

    let FileObj = FileContent[_tenant(module)._tenantId];
    !FileObj.version ? FileObj.version = 0 : FileObj.version;
    FileObj.version = (Number(parseFloat(FileObj.version).toFixed(1)) + 0.1).toFixed(1);
    FileObj.lastUpdated = `${_date.toDateString()} : ${_date.toTimeString().split(' ')[0]}`;
    const lastVersion = FileObj.version;

    fs.writeFileSync('./build_config/buildLog.json', JSON.stringify(FileContent));

    let input;
    if(module == "ee195c0a_b80f_4ea8_94f6_29c3519f2412") {
        input = "ee195c0ab80f4ea894f6_29c3519f2412";
    } else {
        input = (_tenant(module)._tenantId).split("_").join("");
    }

    return {
        input: {
            [input]: 'src/index.js'
        },
        output: [
            {
                dir: 'common/handlers',
                format: 'iife',
                compact: true,
                plugins: [
                    terser(),
                    define({
                        replacements: {
                            __buildDate__: () => JSON.stringify(new Date()),
                            __buildVersion__: () => lastVersion,
                            __tenantDetails__: () => JSON.stringify(_tenant(module)),
                        }
                    })
                ]
            }
        ],
        plugins: [nodeResolve(), commonjs()]
    }
});

tenantsToBuild.forEach(item => bundles.push(item));

const SDKmodules = [
    // { name: 'AppRuleListener', path: 'src/AppRuleListener.js' },
    { name: 'AppRuleListener', path: 'src/AppRuleModule/AppRuleListener.js' },
    { name: 'RuleGroupListener', path: 'src/AppRuleModule/RuleGroupListener.js' },
    { name: 'liveVisitors', path: 'src/liveVisitors.js' },
    { name: 'deviceRegister', path: 'src/deviceRegister.js' },
    { name: 'inAppNotification', path: 'src/inAppNotification.js' },
    { name: 'inAppNotificationCss', path: 'src/inAppNotificationCss.js' },
    { name: 'createPassportId', path: 'src/createPassportId.js' },
    { name: 'webeventtrack', path: 'src/webeventtrack.js' },
    { name: 'webfieldtrack', path: 'src/webfieldtrack.js' },
    { name: 'resumeJourney', path: 'src/resumeJourney.js' },
    { name: 'carouselNotification', path: 'src/carouselNotification.js' },
    { name: 'progressiveForm', path: 'src/progressiveForm.js' },
    { name: 'FormListener', path: 'src/Forms/FormListener.js' } 
].map(module => {

    let outputPath = '[name].js';

    switch(module.name) {
        case "AppRuleListener":
        case "RuleGroupListener":
            outputPath = "AppRuleModule/[name].js"
            break;

        case "FormListener":
            outputPath = "Forms/FormListener.js"
            break;
    }


    return {
        input: {
            [module.name]: module.path
        },
        output: {
            dir: 'common/scripts',
            entryFileNames: outputPath,
            format: 'iife',
            inlineDynamicImports: true,
            plugins: [terser()]
        },
        plugins: [nodeResolve(), commonjs()]
    }
});
SDKmodules.forEach(item => bundles.push(item));

const Clientmodules = [
    { name: 'conditional.config', path: 'src/clientSpecificFiles/conditional.config.module.js' },
].map(module => {
    let outputPath = '[name].module.js';

    return {
        input: {
            [module.name]: module.path
        },
        output: {
            dir: 'common/scripts/clientSpecificFiles',
            entryFileNames: outputPath,
            format: 'iife',
            inlineDynamicImports: true,
            plugins: [terser()]
        },
        plugins: [nodeResolve(), commonjs()]
    }
});
Clientmodules.forEach(item => bundles.push(item));

export default bundles;