<template>
    <div class='panel'>
        <n-collapse class='panel-collapse' default-expanded-names="1"> <!-- Function -->
            <n-collapse-item class="parent_panels" title="Inputs" name="1" style="margin: 0px 2px;" default-expanded-names="3"><!-- Inputs -->
                <template #arrow>
                    <n-icon>
                        <inputIcon/>
                    </n-icon>
                </template>
                <n-collapse class='panel-collapse'> <!-- Generators -->
                    <template #arrow>
                        <n-icon>
                            <functionsIcon/>
                        </n-icon>
                    </template>
    
                    <n-collapse-item title="Generators" name="1">
                        <n-select id='generator' v-model:value="genFunction" :options="generationFunctions" default-value="Building mass" placeholder='Input types'/>
                        <n-button text color="#9cabb4" @click="showModal = true">
                            <template #icon>
                                <n-icon>
                                <helpIcon />
                                </n-icon>
                            </template>
                            Function's information
                        </n-button>
                        <n-modal v-model:show="showModal">
                            <n-card
                                style="width: 600px"
                                title="Informations"
                                :bordered="false"
                                size="huge"
                                role="dialog"
                                aria-modal="true"
                            >
                                <template #header-extra>
                                    Function's usage
                                </template>
                            </n-card>
                        </n-modal>
                    </n-collapse-item>
                </n-collapse>
                <n-collapse class='panel-collapse'> <!-- Strategy -->
                <template #arrow>
                        <n-icon>
                            <strategyIcon/>
                        </n-icon>
                    </template>
                    <n-collapse-item title="Strategy" name="1">
                        <n-select id='input_type' :options="strategies" v-model:value="strategy" placeholder='Input types'/>
                    </n-collapse-item>
                </n-collapse>
                <n-collapse class='panel-collapse' name="3"> <!-- Variables -->
                    <template #arrow>
                        <n-icon>
                            <variableIcon/>
                        </n-icon>
                    </template>
                    <n-collapse-item title="Variables" name="1">
                        <!-- <InputVue :function="genFunction"/> -->
                        <BoxInputVue v-if="genFunction == 'Box'" :function="strategy"/>
                        <BuildingMassInputVue v-if="genFunction == 'Building mass'" :function="strategy"/>
                    </n-collapse-item>
                </n-collapse>
                <n-collapse v-if="strategy == 'Optimize'" class='panel-collapse'><!-- Objectives -->
                <template #arrow>
                        <n-icon>
                            <goalIcon/>
                        </n-icon>
                    </template>
                    <n-collapse-item title="Objectives" name="1">
                        <BoxObjectives v-if="genFunction == 'Box'" :function="strategy"/>
                        <BuildingMassObjectives v-if="genFunction == 'Building mass'" :function="strategy"/>
                    </n-collapse-item>
                </n-collapse>
                <n-collapse class='panel-collapse'> <!-- Design Options -->
                <template #arrow>
                        <n-icon>
                            <optionsIcon/>
                        </n-icon>
                    </template>
                    <n-collapse-item title="Design options" name="1">
                        <n-input-number clearable :precision="0" min="1" max="50"  v-model:value="populations" placeholder='Populations' >
                            <template #prefix>
                                Populations
                            </template>    
                        </n-input-number>
                        <n-input-number :disabled="strategy !== 'Optimize'" clearable :precision="0" min="1" max="10"  v-model:value="generations" placeholder='Generations' >
                            <template #prefix>
                                Generations
                            </template>    
                        </n-input-number>
                        <!-- <n-input-number clearable :precision="0" placeholder='Seed'/> -->
                    </n-collapse-item>
                </n-collapse>
            </n-collapse-item>
            <n-collapse-item v-if="hasStudy" class="parent_panels" title="Outputs" name="2" style="margin: 0px 2px;"><!-- Outputs -->
                <template #arrow>
                    <n-icon>
                        <outputIcon/>
                    </n-icon>
                </template>
                <OutputsPanel/>
            </n-collapse-item>
            <n-collapse-item class="parent_panels" title="Project settings" name="3" style="margin: 0px 2px;"><!-- Project settings -->
                <template #arrow>
                    <n-icon>
                        <settingsIcon/>
                    </n-icon>
                </template>
                <div class='project_settings'>
                    <n-button text>Export result .xlsx</n-button>
                    <n-button text>Export result .zip</n-button>
                    <n-button text>Export result images</n-button>
                </div>
            </n-collapse-item>
        </n-collapse>
        <!-- <n-collapse class='panel-collapse settings'>
            <template #arrow>
                <n-icon>
                    <helpIcon/>
                </n-icon>
            </template>
            <n-collapse-item title="Informations" name="1" >
                <div class='informations'>
                    <n-button text>Export result .xlsx</n-button>
                </div>
            </n-collapse-item>
        </n-collapse> -->
        <div class='outputPanel'> <!-- Toolbar -->
            <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                    <n-button  @click='runTest' type="warning" quaternary>
                        <n-icon >
                            <testIcon/>
                        </n-icon>
                    </n-button>
                </template>
                Generate
            </n-tooltip>
            <!-- <n-tooltip trigger="hover" placement="bottom">
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
                Update chart
            </n-tooltip>       -->
            <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                    <n-button  @click="clearData" quaternary>
                        <n-icon >
                            <clearIcon/>
                        </n-icon>
                    </n-button>
                </template>
                Clear results
            </n-tooltip>      
        </div>
    </div>

    <n-modal v-model:show="isProcessing"><!-- Progress modal -->
        <n-card
            style="width: 600px"
            title="Design Space Explorer"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
        <template v-if="genProgress == 100" #header-extra>
            <n-text type="primary">
                Generation completed!
            </n-text>
        </template>
        <n-space vertical align="center">
            <n-space justify="space-around" size="large">
                <n-progress type="circle" color="#a2588f" :percentage="genProgress" />
                <n-divider vertical />
                <n-space vertical>
                    <n-text>
                        Generator: {{ genFunction }}
                    </n-text>
                    <n-text>
                        Strategy: {{ strategy }}
                    </n-text>
                    <n-text>
                        Populations: {{ populations }}
                    </n-text>
                    <n-text>
                        Generations: {{ generations }}
                    </n-text>
                </n-space>
            </n-space>
            <n-button v-if="genProgress == 100" color="#00cc99" @click="closeModal">
                Close
            </n-button>
        </n-space>
        </n-card>
    </n-modal>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {OptionsOutline as optionsIcon ,
        EnterOutline as inputIcon,
        Flash as testIcon,
        LogoTableau as resultIcon,
        BarChartSharp as statsIcon,
        ConstructOutline as functionsIcon,
        TrophyOutline as objectivesIcon,
        SettingsOutline as settingsIcon,
        HelpCircleOutline as helpIcon,
        FlaskOutline as strategyIcon,
        LogOutOutline as outputIcon,
        TrashBinOutline as clearIcon,
        ExtensionPuzzleOutline as variableIcon,
        Locate as locateIcon,
        GolfOutline as goalIcon
       } from '@vicons/ionicons5';
import InputVue from './Input.vue';
import OutputSettingsVue from './OutputSettings.vue';
import BoxInputVue from './inputs/BoxInputs.vue';
import BuildingMassInputVue from './inputs/BuildingMassInputs.vue';
import {useDesign} from '../store/design';
import * as d3 from "d3";
import { useMessage } from 'naive-ui'
import {GDEvents} from '../events/index'
import { Viewer } from '../logic/Viewer'
import BoxObjectives from './objectives/BoxObjectives.vue'
import BuildingMassObjectives from './objectives/BuildingMassObjectives.vue'
import {Strategy} from '../enums/Strategy'
import {Generator} from '../enums/Generator'
import {GenerationManager} from '../logic/GenerationManager'
import {BuildingMassGenerator} from '../logic/generators/BuildingMassGenerator'
import {IDB} from '../IDB'
import OutputsPanel from './OutputsPanel.vue'

export default defineComponent({
    components: {
        optionsIcon, inputIcon, InputVue,
        testIcon, resultIcon, statsIcon, strategyIcon,
        functionsIcon, objectivesIcon, settingsIcon, 
        helpIcon, BoxInputVue, BuildingMassInputVue,
        BoxObjectives, BuildingMassObjectives, outputIcon, OutputSettingsVue,
        clearIcon, OutputsPanel, variableIcon, goalIcon, locateIcon
    },
    props: ['hasStudy'],
    data(){
        return {
            generationFunctions: [
                {
                    label: 'Box',
                    value: 'Box'
                    
                },
                {
                    label: 'Building mass',
                    value: 'Building mass'
                },
                {
                    label: 'Floor plan layout',
                    value: 'Floor plan layout',
                    disable: false
                }
            ],
            strategies: [
                {
                    label: 'Randomize',
                    value: 'Randomize'
                },
                {
                    label: 'Optimize',
                    value: 'Optimize'
                },
                // {
                //     label: 'Cross product',
                //     value: 'Cross product'
                // }
            ],
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
            genProgress: 0
        }
    },
    setup () {
        window.$message = useMessage();
    },
    watch: {
        // showOutputs(){
        //     if(this.showOutputs) this.name = 1;
        //     else this.name = 0
        // }
    },
    created (){},
    async mounted() {
        this.store = useDesign();
        const GD_d3 = JSON.parse(localStorage.getItem('gd_d3') as any);
        const GD_results = JSON.parse(localStorage.getItem('gd_result') as any);

        if ( GD_d3 && GD_d3['x_axis'] ) {
            // && Object.keys(GD_d3).length > 0
            // this.visualizeResult();
            
            for (let res in GD_results) {
                this.outputSet.push({label: res, value: res});
            }
            this.showOutputs = true;
        }
        const genManager = new GenerationManager(   BuildingMassGenerator,
                                                    this.strategy,
                                                    [],
                                                    this.populations);
        console.log('[Gen Manager]: ', genManager)
        this.$nextTick( async ()=>{

            const canvas = document.getElementById('three_canvas');
            let v = new Viewer(canvas, []);
    
            const blob = await IDB.getDataByKeyAsync('glb');
            // console.log('[Viewer:Blob onMount] ', blob)
            
            if(blob){
                console.log('[Viewer:Blob onMount] ', blob, canvas)
                await v.init(canvas, [], blob)
            }
        })



        // window.addEventListener("show_chart", (e) => {
        //     console.log("Listen show chart")

        //     if ( GD_d3 && Object.keys(GD_d3).length > 0 ) {
        //         this.visualizeResult();
        //     }
        // }, false);

        if(this.hasStudy) {
            this.name = 1;
            this.showOutputs = true
        }

    },
    methods: {
        onCreate () {
            return {
                isCheck: false,
                num: 1,
                string: 'A String'
            }
        },
        test(){
            let resultsData = JSON.parse(localStorage.getItem('gd_result') as any);

            const gens = resultsData.length;
            const threeContainer = document.getElementById('gallery_container') as HTMLElement;
            
            //* Clear all children
            while (threeContainer.firstChild) {
                threeContainer.removeChild(threeContainer.lastChild as ChildNode);
            }
            
            for ( let i=0; i < gens; i++) {
                let canvas = document.createElement("canvas");
                threeContainer.appendChild(canvas);
                const viewer = new Viewer(canvas,resultsData[i]);
            }
            console.log(this.store.design)
        },
        async runTest() {
            //TODO:  try getting inputs from child component 
            const inputs = this.store.design[this.strategy].inputs;
            
            console.log('[Panel: run test]', this.store.design);
            //* SET INPUTS IN LOCAL STORAGE
            // localStorage.setItem( 'gd_currentInputs', JSON.stringify( this.store.design[this.strategy].inputs ) );
            // const inputs = {
            //     strategy: this.strategy,
            //     generator: this.genFunction,
            //     generations: this.generations,
            //     populations: this.populations,
            // }
            // console.log('[Inputs]: ', inputs)
            // console.log('[Store]: ', this.store.design)
            this.isProcessing = true;

            if(!document.getElementById('three_canvas')){

                const threeContainer = document.getElementById('gallery_container') as HTMLElement;
                while (threeContainer.firstChild) {
                threeContainer.removeChild(threeContainer.lastChild as ChildNode);
                }
                let canvas = document.createElement("canvas");
                canvas.classList.add("result_canvas");
                canvas.id = "three_canvas"
                threeContainer.appendChild(canvas);
            }

            const worker = new Worker(new URL('../workers/GeneratorWorker.js', import.meta.url));


            worker.postMessage({ type: 'onProcess',
                                 populations: this.populations,
                                 inputs: JSON.stringify(inputs)
                                });

            worker.onmessage = async (event) => {
                if(event.data.type == 'onProgress') this.genProgress = Math.round( event.data.progress * 100 / this.populations  );

                if(event.data.type == 'onFinished'){
                    this.$emit(GDEvents.Generation_completed)
                    const canvas = document.getElementById('three_canvas');
                    let v = new Viewer(canvas, []);

                    this.genProgress = 100;
                    // let blob: any;
                    let glbStatus = 0;
                    let interval = setInterval( async ()=>{
                        const blob = await IDB.getDataByKeyAsync('glb');
                        if(blob){
                            clearInterval(interval);
                            // console.log('[Viewer:Blob] ', blob)
                            await v.init(canvas, [], blob)

                        }
                    }, 500)
                } 
            };


            //TODO: just for now, the contour is hardcoded

            // try {
            //     switch(this.genFunction){
            //         case Generator.BoxGenerator:
            //             this.store.design[Strategy.Randomize]['populations'] = this.populations;
            //             const generate = new TestAlgorithm(this.store.design[Strategy.Randomize])
            //             const results = generate.process();
            //             const study = generate.getStudyData();
            //             localStorage.setItem('gd_result', JSON.stringify(results));
            //             localStorage.setItem('gd_study', JSON.stringify(study));
            //             this.showOutputs = true;
            //             this.outputSet.length = 0;
            //             for (let res in results) {
            //                 this.outputSet.push({label: res, value: res})
            //                 console.log({label: res, value: res})
            //             }
            //             break; 

            //     }
            
            //     window?.$message.success('Test completed successfully!');
            //     this.$emit('generate_finished')
            // } catch (error) {
            //     window?.$message.error('Test failed: make sure you provide inputs correctly')
            //     console.warn(error)
            // }

        },
        visualizeResult() {
            // const w = 500;
            // const h = 500;
            // // const svgContainer = document.getElementById('d3Panel_main') as HTMLElement;
            // // const svgElement = document.createElement('svg');
            // // svgElement.id = "d3Svg";
            // // svgContainer.appendChild(svgElement)

            // const svg = d3.select("#d3Svg").attr("width", w).attr("height", h);
            // const _svg = document.getElementById('d3Svg') as HTMLElement;
            
            // if (_svg.lastChild)
            //     while (_svg.lastChild)
            //         _svg.removeChild(_svg.lastChild);

            // const g = svg.append("g");
     
            // const GD_results = JSON.parse(localStorage.getItem('gd_result') as any);
            // if( !GD_results || GD_results.length == 0){
            //     window?.$message.error('No data to visualize')
            //     return;
            // }
            // const GD_d3 = JSON.parse(localStorage.getItem('gd_d3') as any);

        
            // const padding = 60;
            // const maxX = d3.max( [ ...GD_results[GD_d3['x_axis']] ], (d,i) => d);
            // const maxY = d3.max( [ ...GD_results[GD_d3['y_axis']] ], (d,i) => d);
            // const maxSize = d3.max( [...GD_results[GD_d3['size']] ], (d,i) => d);

            // const xScale = d3.scaleLinear()
            //                  .domain([0, maxX as number])
            //                  .range([padding, w - padding]);

            // const yScale = d3.scaleLinear()
            //                  .domain([0, maxY as number])
            //                  .range([h - padding, padding]);

            // const sizeScale = d3.scaleLinear()
            //                  .domain([0, maxSize as number])
            //                  .range([0, 10]);

            // console.log("D3 result- scale...", maxSize);
            // const GD_data = JSON.parse(localStorage.getItem('gd_study') as any);


            // svg.selectAll("circle")
            //    .data([...GD_data])
            //    .enter()
            //    .append("circle")
            //    .attr("cx", (d) => xScale(d.outputs[GD_d3['x_axis']]))
            //    .attr("cy",(d) => yScale(d.outputs[GD_d3['y_axis']]))
            //    .attr("r", (d) => sizeScale(d.outputs[GD_d3['size']]))
            //    .attr("id", "scatter")
            //    .attr('fill', 'rgba(162, 88, 143, 0.3)')
            //    .on("click", (d) => {
            //      console.log("CLICKED", d.target.__data__);              
            //      this.showVarData(d.target.__data__);
            //     })
            //    .append("title")
            //    .attr('class', 'svg_tooltip')
            //    .text((d) => `Width: ${d.inputs.width}\nLength: ${d.inputs.length}\nHeight: ${d.inputs.height}`)

            // // svg.selectAll("text")
            // //    .data([...GD_test])
            // //    .enter()
            // //    .append("text")
            // //    .text((d) =>  `(${d.inputs.width}, ${d.inputs.length})`)
            // //    .attr("x", (d) => xScale(d.surface_area + 20))
            // //    .attr("y", (d) => yScale(d.volume))
            // const xAxis = d3.axisBottom(xScale);
            // const yAxis = d3.axisLeft(yScale);

            // svg.append("g")
            //    .attr("transform", `translate(0, ${(h - padding)})`)
            //    .call(xAxis);

            // svg.append("g")
            //    .attr("transform", `translate(${(padding)}, 0)`)
            //    .call(yAxis); 

            // //TODO: output data inserting
            // document.getElementById('xAxis_tag').innerHTML = 'X-axis: ';
            // document.getElementById('yAxis_tag').innerHTML = 'Y-axis: ';
            // document.getElementById('size_tag').innerHTML = 'Size: ';
            // document.getElementById('color_tag').innerHTML = 'Color: ';
            // document.getElementById('xAxis_tag').innerHTML += GD_d3['x_axis'];
            // document.getElementById('yAxis_tag').innerHTML += GD_d3['y_axis'];
            // document.getElementById('size_tag').innerHTML += GD_d3['size'];
            // document.getElementById('color_tag').innerHTML += '';

            // //TODO: add the two result variables + in the algorithm
            

        },
        varViewer() {
            // let resultsData = JSON.parse(localStorage.getItem('gd_study') as any);
            // const threeContainer = document.getElementById('result3D_var') as HTMLElement;

            // //* Clear all children
            // while (threeContainer.firstChild) {
            //     threeContainer.removeChild(threeContainer.lastChild as ChildNode);
            // }
            
            // let canvas = document.createElement("canvas");
            // canvas.classList.add("result_canvas");
            // threeContainer.appendChild(canvas);
            // const viewer = new Viewer(canvas, this.selectedVarData);
        },
        showVarData(data: any) {
            // this.selectedVarData = data;
            // const infoContainer = document.getElementById('resultInfo_var') as HTMLElement;
            // while (infoContainer.firstChild) {
            //     infoContainer.removeChild(infoContainer.lastChild as ChildNode);
            // }
            
            // const i_id = document.createElement("p");           
            // i_id.innerHTML = `ID: ${data.id}`;
            // infoContainer.appendChild(i_id);

            // const i_gen = document.createElement("p");           
            // i_gen.innerHTML = `Generation: ${data.genPop.split("_")[0]}`;
            // infoContainer.appendChild(i_gen);

            // const i_pop = document.createElement("p");           
            // i_pop.innerHTML = `Population: ${data.genPop.split("_")[1]}`;
            // infoContainer.appendChild(i_pop);

            // const i_st = document.createElement("p");           
            // i_st.innerHTML = `Strategy: ${data.strategy}`;
            // infoContainer.appendChild(i_st);

            // for(let input in data.inputs){
            //     let i = document.createElement("p");           
            //     i.innerHTML = `${input}: ${data.inputs[input]}`;
            //     infoContainer.appendChild(i);
            // }

            // for(let output in data.outputs){
            //     let j = document.createElement("p");           
            //     j.innerHTML = `${output}: ${data.outputs[output]}`;
            //     infoContainer.appendChild(j);
            // }

            
            // this.varViewer();
        },
        async clearData(){
            // this.$emit('test_eventy', this.strategies);
            localStorage.setItem('has_study', 'false');
            await IDB.clearStorageAsync();
            const threeContainer = document.getElementById('gallery_container') as HTMLElement;

            //* Clear all children if any
            while (threeContainer.firstChild) {
                threeContainer.removeChild(threeContainer.lastChild as ChildNode);
            }

        },
        closeModal(){
            this.isProcessing = false;
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
    width: 20%; /*17*/
    background-color: #efefef;
    margin: 3px;
    padding: 5px;
    box-shadow: 0px 0px 21px -1px rgba(168, 168, 168, 0.42);
    z-index: 100;
    border-radius: 10px;
}

.outputPanel{
    display: flex;
    justify-content: space-evenly; 
}

.n-collapse-item-arrow{
    color: #a2588f !important;
}

.n-collapse-item__header-main{
    color: #15304b !important;
    font-size: 16px !important;
    font-weight: bold !important;
    font-family: 'Chakra Petch', sans-serif !important;

}

.n-collapse-item__content-inner{
    color: #a2588f !important;
    font-family: 'Chakra Petch', sans-serif !important;
    padding: 0% !important;
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

.settings{
    text-align: left !important;
    justify-content:left !important;
    /* margin: 0px 10px !important; */
}

.project_settings{
    /* text-align: left !important; */
    justify-content:left !important;
    display: flex;
    flex-direction: column;
    /* margin-left: 0px; */
    /* flex-wrap: wrap; */
}

.svg_tooltip{
    background-color: #a2588f !important;
}

#scatter:hover{
  fill: rgb(162, 88, 143);
  cursor: pointer
}

.n-divider--vertical{
    height:100% !important;
    width: 1px !important
}
.n-collapse-item{
    margin: 0px 7px !important;

}

.parent_panels{
    font-size: 20px !important;
    color:black !important;
}
</style>