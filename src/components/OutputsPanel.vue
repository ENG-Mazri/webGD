<template>
    <n-collapse class='panel-collapse' > <!-- Outputs default-expanded-names="1"-->
        <template #arrow>
            <n-icon>
                <outputIcon/>
            </n-icon>
        </template>
        <n-collapse-item title="Chart settings" name="1">
            <template #arrow>
                <n-icon>
                    <statsIcon/>
                </n-icon>
            </template>
            <OutputSettingsVue :outputOptions="outputSet"/>
        </n-collapse-item>
        <n-divider />
        <n-collapse-item title="Data table settings" name="2">
            <template #arrow>
                <n-icon>
                    <tableIcon/>
                </n-icon>
            </template>
        </n-collapse-item>
        <n-divider />
        <n-collapse-item title="3D visual settings" name="3">
            <template #arrow>
                <n-icon>
                    <viewerIcon/>
                </n-icon>
            </template>
            <n-select id='generator' :options="generationList" default-value="Generation 1" placeholder=''/>
        </n-collapse-item>
    </n-collapse>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ReorderFourSharp as tableIcon, CubeOutline as viewerIcon, OptionsOutline as optionsIcon , EnterOutline as inputIcon, Flash as testIcon, LogoTableau as resultIcon, BarChartSharp as statsIcon, ConstructOutline as functionsIcon, TrophyOutline as objectivesIcon, SettingsOutline as settingsIcon, HelpCircleOutline as helpIcon, FlaskOutline as strategyIcon, LogOutOutline as outputIcon, TrashBinOutline as clearIcon} from '@vicons/ionicons5';
import InputVue from './Input.vue';
import OutputSettingsVue from './OutputSettings.vue';
import BoxInputVue from './inputs/BoxInputs.vue';
import BuildingMassInputVue from './inputs/BuildingMassInputs.vue';
import {useDesign} from '../store/design';
import {TestAlgorithm} from '../logic/testAlgorithm';
import * as d3 from "d3";
import { useMessage } from 'naive-ui'
// import {event} from '../events/index'
import { Viewer } from '../logic/Viewer'
import BoxObjectives from './objectives/BoxObjectives.vue'
import BuildingMassObjectives from './objectives/BuildingMassObjectives.vue'
import {Strategy} from '../enums/Strategy'
import {Generator} from '../enums/Generator'
import {GenerationManager} from '../logic/GenerationManager'
import {BuildingMassGenerator} from '../logic/generators/BuildingMassGenerator'
import {IDB} from '../IDB'


export default defineComponent({
    components: {
        optionsIcon, inputIcon, InputVue,
        testIcon, resultIcon, statsIcon, strategyIcon,
        functionsIcon, objectivesIcon, settingsIcon, 
        helpIcon, BoxInputVue, BuildingMassInputVue,
        BoxObjectives, BuildingMassObjectives, outputIcon, OutputSettingsVue,
        clearIcon, viewerIcon, tableIcon
    },
    props: ['hasStudy'],
    data(){
        return {
            strategy: "Randomize",
            generations: 1 ,
            populations: 1 ,
            store: '' as any,
            showModal: false,
            genFunction: 'Building mass',
            showOutputs: false,
            x_axis: null,
            y_axis: null,
            size: null,
            color: null,
            outputSet: [],
            selectedVarData: {},
            name:0,
            isProcessing: false,
            genProgress: 0,
            generationList: [ {label:'Generation 1', value: 'Generation 1' }, {label:'Generation 2', value: 'Generation 2' } ]
        }
    },
    setup () {
        window.$message = useMessage();
    },
    watch: {},
    created (){},
    async mounted() {

    },
    methods: {}
})
</script>