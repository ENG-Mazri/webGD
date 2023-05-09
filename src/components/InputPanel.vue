<template>

    <div class='panel'>
        <n-collapse class='panel-collapse'>
            <template #arrow>
                <n-icon>
                    <inputIcon/>
                </n-icon>
            </template>
            <n-collapse-item title="Inputs" name="1">
                <n-dynamic-input v-model:value="customValue" :on-create="onCreate" placeholder="ADD">
                    <template #create-button-default>
                        Add new input
                    </template>
                    <template #default="{ value }">
                        <div style=" align-items: center; width: 100%">
                            <InputVue/>
                        </div>
                    </template>
                </n-dynamic-input>
            </n-collapse-item>
        </n-collapse>
        <n-collapse class='panel-collapse'>
           <template #arrow>
                <n-icon>
                    <functionsIcon/>
                </n-icon>
            </template>

            <n-collapse-item title="Generation functions" name="1">
                <n-select id='input_type' :options="generationFunctions" default-value="Box generation" placeholder='Input types'/>
            </n-collapse-item>
        </n-collapse>
        <n-collapse class='panel-collapse'>
           <template #arrow>
                <n-icon>
                    <objectivesIcon/>
                </n-icon>
            </template>

            <n-collapse-item title="Objectives" name="1">
                <n-select id='input_type' :options="objectives" default-value="Randomize" placeholder='Input types'/>
            </n-collapse-item>
        </n-collapse>
        <n-collapse class='panel-collapse'>
           <template #arrow>
                <n-icon>
                    <optionsIcon/>
                </n-icon>
            </template>

            <n-collapse-item title="Design options" name="1">
                <n-input-number clearable :precision="0" placeholder='Number of generations'/>
                <n-input-number clearable :precision="0" placeholder='Seed'/>
            </n-collapse-item>
        </n-collapse>
        <n-collapse class='panel-collapse settings'>
            <template #arrow>
                <n-icon>
                    <settingsIcon/>
                </n-icon>
            </template>
            <n-collapse-item title="Project settings" name="1" >
                <div class='project_settings'>
                    <n-button text>Export result .xlsx</n-button>
                    <n-button text>Export result .zip</n-button>
                    <n-button text>Export result images</n-button>
                </div>
            </n-collapse-item>
        </n-collapse>
        <div class='outputPanel'>
            <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                    <n-button  @click='runTest' type="warning" quaternary>
                        <n-icon >
                            <testIcon/>
                        </n-icon>
                    </n-button>
                </template>
                Run test
            </n-tooltip>
            <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                    <n-button  @click='test' quaternary>
                        <n-icon >
                            <resultIcon/>
                        </n-icon>
                    </n-button>
                </template>
                Show generation results
            </n-tooltip>
            <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                    <n-button  @click="visualizeResult" quaternary>
                        <n-icon >
                            <statsIcon/>
                        </n-icon>
                    </n-button>
                </template>
                Show chart
            </n-tooltip>      
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { OptionsOutline as optionsIcon , EnterOutline as inputIcon, Flash as testIcon, LogoTableau as resultIcon, BarChartSharp as statsIcon, ConstructOutline as functionsIcon, TrophyOutline as objectivesIcon, SettingsOutline as settingsIcon} from '@vicons/ionicons5';
import InputVue from './Input.vue';
import {useDesign} from '../store/design';
import {TestAlgorithm} from '../logic/testAlgorithm';
import {InputParameters} from '../types/inputsParameters';
import { defineEmits } from 'vue'
import * as d3 from "d3";
import { useMessage } from 'naive-ui'
import {event} from '../events/index'


interface ModelType {
  age: string | null
  password: string | null
  reenteredPassword: string | null
}

export default defineComponent({
    components: {
        optionsIcon, inputIcon, InputVue, testIcon, resultIcon, statsIcon, functionsIcon, objectivesIcon, settingsIcon
    },
    // emits: { showResultEvent(payload: { msg: string }) {return msg}
    // },
    data(){
        return {
            generationFunctions: [
                {
                    label: 'Box generation',
                    value: 'Box generation'
                },
                {
                    label: 'Form finding',
                    value: 'Form finding'
                }
            ],
            objectives: [
                {
                    label: 'Randomize',
                    value: 'Randomize'
                },
                {
                    label: 'Optimize',
                    value: 'Optimize'
                },
                {
                    label: 'Cross product',
                    value: 'Cross product'
                }
            ],
            store: '' as any,
            // svg: 
            // message: '' as any,
        }
    },
    setup () {
        window.$message = useMessage();
    },
    created (){},
    mounted() {
        // const emit = defineEmits(['showResultEvent'])
        this.store = useDesign();
        // this.message = useMessage();
    },
    methods: {
        addInput(){
            console.log('Add input')
        },
        onCreate () {
            // this.store.design[Math.random()] = 'iwuehfiw';
            // console.log("Store.....", this.store.design);
            return {
            isCheck: false,
            num: 1,
            string: 'A String'
            }
        },
        test(){
            // this.$event('showResultEvent', {msg: 'HEOLO POLO'})
            window?.$message.error('Test failed')
            window.dispatchEvent(event);
            console.log('Store....', this.store.design)
        },
        runTest() {

            const inputs: InputParameters = {inputs: this.store.design,
              generations: 10}
            const GD_test = new TestAlgorithm(inputs).process();

            if (GD_test.length == 0) {
                window?.$message.error('Test failed: make sure you provide inputs correctly')
                return;
            }
            window?.$message.success('Test completed successfully!');
            this.store.result = [...GD_test];
            console.log("RUNNING TEST", this.store.design)
            console.log("TEST RESULT", GD_test)

        },
        visualizeResult(){
            const w = 500;
            const h = 500;
            const svg = d3.select("#d3Svg").attr("width", w).attr("height", h);
            const g = svg.append("g");
     
            const GD_test = this.store.result;
            if( GD_test.length == 0) return;
            console.log("D3 result", GD_test)
        
            const padding = 60;
            const maxX = d3.max( [...GD_test], (d,i) => d.surface_area);
            const maxY = d3.max( [...GD_test], (d,i) => d.volume);

            const xScale = d3.scaleLinear()
                             .domain([0, maxX as number])
                             .range([padding, w - padding]);

            const yScale = d3.scaleLinear()
                             .domain([0, maxY as number])
                             .range([h - padding, padding]);

            svg.selectAll("circle")
               .data([...GD_test])
               .enter()
               .append("circle")
               .attr("cx", (d) => xScale(d.surface_area))
               .attr("cy",(d) => yScale(d.volume))
               .attr("r", (d) => 5)
               .attr("id", "scatter")
               .attr('fill', 'rgb(112, 112, 219)')
               .on("click", () => console.log("CLICKED"));

            // // // svg.selectAll("text")
            // // //    .data(dataset)
            // // //    .enter()
            // // //    .append("text")
            // // //    .text((d) =>  `(${d[0]}, ${d[1]})`)
            // // //    .attr("x", (d) => xScale(d[0] + 10))
            // // //    .attr("y", (d) => yScale(d[1]))

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);


            svg.append("g")
               .attr("transform", `translate(0, ${(h - padding)})`)
               .call(xAxis);

            svg.append("g")
               .attr("transform", `translate(${(padding)}, 0)`)
               .call(yAxis); 

        }
    }
})
</script>

<style>

h3{
  margin: 40px 0 0;
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  color: #a2588f;

}

.panel{
    position: absolute;
    left: 5px;
    top: 35px;
    width: 230px;
    background-color: #efefef;
    margin: 3px;
    padding: 5px;
    box-shadow: 0px 0px 21px -1px rgba(168, 168, 168, 0.42);
    z-index: 100
}

.outputPanel{
    display: flex;
    justify-content: space-evenly; 
}

.n-collapse-item-arrow{
    color: #a2588f !important
}

.n-collapse-item__header-main{
    color: #a2588f !important;
    font-size: 16px !important;
    font-weight: bold !important;
    font-family: 'Chakra Petch', sans-serif !important;
}

.n-collapse-item__content-inner{
    color: #a2588f !important;
    font-family: 'Chakra Petch', sans-serif !important;
}

.n-button{
    margin-top: 10px;
}

.n-dynamic-input-item{
    display: block !important
}

.n-dynamic-input-item__action{
    justify-content: center !important;
    margin: 0px !important;
}

.panel-collapse{
    margin: 10px 0px;
}

.settings > *{
    text-align: left !important;
    /* margin: 0px 10px !important; */
}

.project_settings{
    /* text-align: left !important; */
    justify-content:left !important;
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap; */
}

</style>