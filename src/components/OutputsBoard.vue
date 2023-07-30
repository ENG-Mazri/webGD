<template>
  <div class="outputsBoard" ref="$wrapper" @showResultEvent="visualizeResult">
    <n-card class="outputsPanel_main" justify-content="space-evenly">
      <n-tabs @click="tabChange" type="line" animated justify-content="space-around" :disabled="hasTabs" default-value="3D space" tab-style="color: #a2588f; font-size: 16px !important;">
        <n-tab-pane name="Scatterplot chart" tab="Scatterplot chart">
          <div id="outputsPanel_main">
            <svg id="d3Svg"></svg>
          </div>
        </n-tab-pane>
        <n-tab-pane name="Data table" tab="Data table" justify-content="space-evenly">
          <n-data-table
            ref="dataTableInst"
            :columns="columns"
            :data="data"
            max-height=500
          />
        </n-tab-pane>
        <n-tab-pane name="3D space" tab="3D visual" style="height: 520px">
          <!-- <n-scrollbar style="max-height: 550px"> -->
          <div class="results3D" id="gallery_container">
          </div>
          <!-- </n-scrollbar> -->
          <!-- <n-pagination 
            v-model:page="viewerCurrPage"
            size="small"
           :page-count="viewerTotalpages" /> -->
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div> 
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import * as d3 from "d3";
import {useDesign} from '../store/design';
import { LogOutOutline as outputIcon} from '@vicons/ionicons5';
import {show_chart_event} from '../events/index'
import { Viewer } from '../logic/Viewer';
import { BoxGeometry, Mesh, MeshPhongMaterial, Vector2 } from 'three';
import {BuildingMassGenerator} from '../logic/generators/BuildingMassGenerator';
import {GenerationManager} from '../logic/GenerationManager';
//@ts-ignore
// import * as GeneratorWorker from '../logic/generators/MassGeneratorWorker';

export default defineComponent({
  components:{
    outputIcon
  },
  name: 'OutputsBoard',
  props: ['msg', 'hasStudy'],
  data() {
    return {
      show: false,
      store: useDesign().design,
      active: 0,
      hasTabs: true,
      columns: [],
      data: [],
      selectedVarData: {},
      viewerTotalpages: 2,
      viewerCurrPage: 2,
      hasViewer: false

    }
   
  },
  watch:{
    store(){
      console.log("D3 PANEL WATCHING STORE")
    },
    msg(){
      console.log("D3 Panel got message from Input panel: ",this.msg)
    },
    // hasStudy(){
    //   if(this.hasStudy){
    //     this.visualizeResult();
    //     this.buildTable();
    //     this.buildViewer();
    //   }
    // }
  },
  mounted() {
    console.log("[Study available]: ", this.hasStudy);
    // const genWorker = new GeneratorWorker();
    // const genWorker = new Worker('../MassGeneratorWorker.ts')
    // genWorker.postMessage({type: 'process'})

    let hasStudy = JSON.parse(localStorage.getItem('gd_hasStudy') as any);


    if(hasStudy) {
      this.visualizeResult();
      this.buildTable();
      this.buildViewer();
      console.log("D3 panel mounted has study")
    }

    this.buildViewer();

      // const GD_d3 = JSON.parse(localStorage.getItem('gd_d3') as any);
      // if ( GD_d3 && Object.keys(GD_d3).length > 0 ) {
      //   window.dispatchEvent(show_chart_event)
      //   console.log("Dispatch show chart")

      // }
  },
  methods: {
    visualizeResult(){
      const w = 500;
      const h = 500;

      const svg = d3.select("#d3Svg").attr("width", w).attr("height", h);
      const _svg = document.getElementById('d3Svg') as HTMLElement;

      if (_svg && _svg.lastChild)
          while (_svg.lastChild)
              _svg.removeChild(_svg.lastChild);

      const g = svg.append("g");

      const GD_results = JSON.parse(localStorage.getItem('gd_result') as any);
      if( !GD_results || GD_results.length == 0){
          window?.$message.error('No data to visualize')
          return;
      }
      const GD_d3 = JSON.parse(localStorage.getItem('gd_d3') as any);

  
      const padding = 60;
      const maxX = d3.max( [ ...GD_results[GD_d3['x_axis']] ], (d,i) => d);
      const maxY = d3.max( [ ...GD_results[GD_d3['y_axis']] ], (d,i) => d);
      const maxSize = d3.max( [...GD_results[GD_d3['size']] ], (d,i) => d);

      const xScale = d3.scaleLinear()
                        .domain([0, maxX as number])
                        .range([padding, w - padding]);

      const yScale = d3.scaleLinear()
                        .domain([0, maxY as number])
                        .range([h - padding, padding]);

      const sizeScale = d3.scaleLinear()
                        .domain([0, maxSize as number])
                        .range([0, 10]);

      const GD_data = JSON.parse(localStorage.getItem('gd_study') as any);


      svg.selectAll("circle")
          .data([...GD_data])
          .enter()
          .append("circle")
          .attr("cx", (d) => xScale(d.outputs[GD_d3['x_axis']]))
          .attr("cy",(d) => yScale(d.outputs[GD_d3['y_axis']]))
          .attr("r", (d) => sizeScale(d.outputs[GD_d3['size']]))
          .attr("id", "scatter")
          .attr('fill', 'rgba(162, 88, 143, 0.3)')
          .on("click", (d) => {
            console.log("CLICKED", d.target.__data__);              
            this.showVarData(d.target.__data__);
          })
          .append("title")
          .attr('class', 'svg_tooltip')
          .text((d) => `Width: ${d.inputs.width}\nLength: ${d.inputs.length}\nHeight: ${d.inputs.height}`)

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append("g")
          .attr("transform", `translate(0, ${(h - padding)})`)
          .call(xAxis);

      svg.append("g")
          .attr("transform", `translate(${(padding)}, 0)`)
          .call(yAxis); 

    },
    varViewer() {
      // let resultsData = JSON.parse(localStorage.getItem('gd_study') as any);
      // const threeContainer = document.getElementById('result3D_var') as HTMLElement;

      // //* Clear all children
      // while (threeContainer && threeContainer.firstChild) {
      //     threeContainer.removeChild(threeContainer.lastChild as ChildNode);
      // }
      
      // let canvas = document.createElement("canvas");
      // canvas.classList.add("result_canvas_var");
      // threeContainer.appendChild(canvas);
      // // const viewer = new Viewer(canvas, this.selectedVarData);
    },
    showVarData(data: any) {
        this.selectedVarData = data;
        const infoContainer = document.getElementById('resultInfo_var') as HTMLElement;
        while (infoContainer.firstChild) {
            infoContainer.removeChild(infoContainer.lastChild as ChildNode);
        }
        
        const i_id = document.createElement("p");           
        i_id.innerHTML = `ID: ${data.id}`;
        infoContainer.appendChild(i_id);

        const i_gen = document.createElement("p");           
        i_gen.innerHTML = `Generation: ${data.genPop.split("_")[0]}`;
        infoContainer.appendChild(i_gen);

        const i_pop = document.createElement("p");           
        i_pop.innerHTML = `Population: ${data.genPop.split("_")[1]}`;
        infoContainer.appendChild(i_pop);

        const i_st = document.createElement("p");           
        i_st.innerHTML = `Strategy: ${data.strategy}`;
        infoContainer.appendChild(i_st);

        for(let input in data.inputs){
            let i = document.createElement("p");           
            i.innerHTML = `${input}: ${data.inputs[input]}`;
            infoContainer.appendChild(i);
        }

        for(let output in data.outputs){
            let j = document.createElement("p");           
            j.innerHTML = `${output}: ${data.outputs[output]}`;
            infoContainer.appendChild(j);
        }

        
        this.varViewer();
    },
    tabChange(){
      // console.log("Tab click")

      // * SVG output
      const threeContainer = document.getElementById('gallery_container') as HTMLElement;

      if(threeContainer && !this.hasViewer) {//&& this.hasStudy
        this.buildViewer()
      }
      //* SVG output
      const svg = document.getElementById('d3Svg') as HTMLElement;
      if(svg && this.hasStudy) this.visualizeResult()

    },
    buildViewer() {
      this.hasViewer = true;

      // let resultsData = JSON.parse(localStorage.getItem('gd_study') as any);

      // const gens = resultsData.length;
      const threeContainer = document.getElementById('gallery_container') as HTMLElement;

      // console.log("[Generations]: ", gens);
      //* Clear all children if any
      while (threeContainer.firstChild) {
        threeContainer.removeChild(threeContainer.lastChild as ChildNode);
      }
      
      // const data = {inputs: {width: 20, height: 30, length: 80}};
      // const canvas = document.getElementById("three-canvas") as HTMLElement;
      // const viewer = new Viewer(canvas, data);
      // for ( let i=0; i < 1; i++) {
      let canvas = document.createElement("canvas");
      canvas.classList.add("result_canvas");
      canvas.id = "three_canvas"
      threeContainer.appendChild(canvas);

      //*Building Mass Generator testings
      const mock_contour = [
        new Vector2(0, 0),
        new Vector2(0,88),
        new Vector2(60,88),
        new Vector2(70,95),
        new Vector2(70,0),
        new Vector2(0, 0)
      ];
      
      const mock_inputs = {
                          site_offset: {type: 'constant', value: 0},
                          contour: mock_contour,
                          total_floors: {type: 'variable', value: {min: 19, max: 29 }},
                          tower_floor_height: {type: 'constant', value: 3},
                          podium_floor_height: {type: 'constant', value: 4}
                        }

      // const bldMassGen = new BuildingMassGenerator();
      // // const model_mesh = bldMassGen.generateVariant(mock_inputs);

      // const genManager = new GenerationManager(bldMassGen, 'randomize', [], 1)
      // genManager.populate(mock_inputs);
      // console.log('[Mass mesh]', genManager.model)
      // //* Run viewer instance 
      // new Viewer(canvas, [genManager.model])


      // }
    },
    buildTable(){
      const GD_results = JSON.parse(localStorage.getItem('gd_result'));
      const GD_study = JSON.parse(localStorage.getItem('gd_study'));


      if( GD_results && this.hasStudy ){
        const keys = Object.keys(GD_results);
        for( let i = 0; i < keys.length; i++ )
          this.columns.push({title: keys[i], key: keys[i]})

        for( let i = 0; i < GD_study.length; i++ ) {
          let outs = Object.keys(GD_study[i].outputs);
          let data = {};

          for( let j = 0; j < outs.length; j++ ){
            data[keys[j]] = GD_study[i].outputs[keys[j]];
          }
          // data['sorter'] = (row1, row2) => row1[data['key']] - row2[data['key']]
          this.data.push(data);
        }
        // console.log(this.data);

        // this.buildViewer();
      }
    }
  }
});
</script>

<style >
.outputsBoard{
  position: absolute;
  right: 30px;
  top: 35px;
  width: 70%;
  height: 90%;
  margin: 3px;
  padding: 5px;
  display: flex;
  flex-direction: column; 
  box-shadow: 0px 0px 25px 10px rgba(170, 170, 170, 0.2);
  border-radius: 10px;
  
}

.bar:hover{
  fill: yellow;
}

#d3Svg{
  margin: 10px 100px;
  /* background-color: #efefef; */

}

.outputsPanel_footer{
  /*background-color: #efefef;*/
  /* height: 25%;
  text-align: left;
  border-top: 2px dashed #9cabb4; */

}

.outputsPanel_footer > * {
  /* margin: 5px 10px; */
}

.outputsPanel_main{
  height: 75% !important;
}

.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.n-tabs{
  --n-bar-color:#a2588f !important;
  font-size: 16px !important;
  font-weight: bold !important;
  font-family: 'Chakra Petch', sans-serif !important;
}

.n-tabs-pane-wrapper{
  /* height: 700px !important; */
}

.n-card{
  border: 0px solid !important;
}

.results3D{
  position: relative;
  /* background-color: aquamarine !important; */
  width: 97%;
  height: 100%;
  margin: 3px;
  padding: 5px;
  /* display: flex;
  flex-wrap: wrap;
  justify-content:space-between; */
  /* box-shadow: 0px 0px 25px 10px rgba(170, 170, 170, 0.2); */
  /* border-radius: 10px; */
}

.result_canvas{
  position: relative !important;
  background-color: white!important;
  width: 100% !important;
  height: 100% !important;
  margin: 5px 0px !important;
  /* border: 1px solid #9cabb4 !important; */
  /* border-radius: 10px !important;
  box-shadow: 0px 0px 10px 3px rgba(170, 170, 170, 0.2); */
}

canvas{
  position: relative !important;
  background-color: white!important;
  width: 100% !important;
  height: 100% !important;
  margin: 5px 0px !important;
  /* border: 1px solid #9cabb4 !important; */
  /* border-radius: 10px !important; */
}
.n-pagination{
  color: #a2588f !important;
  position: relative;
  margin: 7px 7px
  /* right: 50%;
  transform: translateX(-50%); */
}
.n-pagination > *{
  color: #a2588f !important;
}
.n-pagination-item--active{
  border-color:  #a2588f !important;
}
</style>