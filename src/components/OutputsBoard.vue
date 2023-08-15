<template>
  <div class="outputsBoard" ref="$wrapper" @showResultEvent="visualizeResult">
    <n-card class="outputsPanel_main" justify-content="space-evenly">
      <n-tabs ref="tabs" @update:value="handleUpdateValue" type="line" animated justify-content="space-around" :disabled="hasTabs" :default-value="currentTab" tab-style="color: #a2588f; font-size: 16px !important;">
        <n-tab-pane name="Scatterplot chart" tab="Scatterplot chart">
          <div id="outputsPanel_main">
            <svg id="d3Svg"></svg>
          </div>
        </n-tab-pane>
        <n-tab-pane name="Data table" tab="Data table" justify-content="space-evenly">
          <!-- <n-loading-bar-provider
            :to="loadingBarTargetRef"
            container-style="position: absolute;"
            > -->
            <n-data-table
              v-if="data.length !== 0"
              ref="loadingBarTargetRef"
              :columns="columns"
              :data="data"
              max-height=500
            />
            <!-- <loading-bar-trigger />
          </n-loading-bar-provider> -->
        </n-tab-pane>
        <n-tab-pane display-directive="show:lazy" name="3D visual" tab="3D visual" style="height: 35rem">
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
      <img v-if="data.length == 0" src="../../public/dse_grey.svg" id="noData_logo"/>
    </n-card>
  </div> 
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import * as d3 from "d3";
import {useDesign} from '../store/design';
import { LogOutOutline as outputIcon} from '@vicons/ionicons5';
import {GenFinished, BuildViewer, DestroyViewer, Refresh, ClearData, GlbUpdated} from '../events/index';
import { Viewer } from '../logic/Viewer';
import { BoxGeometry, Mesh, MeshPhongMaterial, SrcAlphaSaturateFactor, Vector2 } from 'three';
import {BuildingMassGenerator} from '../logic/generators/BuildingMassGenerator';
import {GenerationManager} from '../logic/GenerationManager';
//@ts-ignore
// import * as GeneratorWorker from '../logic/generators/MassGeneratorWorker';
import {IDB} from '../IDB'
import {schemePurples} from "d3-scale-chromatic";
import { useLoadingBar } from 'naive-ui';
import { DSEViewer } from '../entities'


export default defineComponent({
  components:{
    outputIcon
  },
  name: 'OutputsBoard',
  props: ['msg', 'hasStudy'],
  setup(){
    // const GlbLoadingBar = useLoadingBar();
    
    // return{ GlbLoadingBar, loadingBarTargetRef: ref<undefined | HTMLElement>(undefined)}
  },
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
      hasViewer: false,
      viewer: null as any,
      canvas: null as any,
      currentTab: 'Scatterplot chart'

    }
   
  },
  watch:{
    store(){
      console.log("D3 PANEL WATCHING STORE")
    },
    msg(){
      console.log("D3 Panel got message from Input panel: ",this.msg)
    }
  },
  mounted() {
    // console.log("[GLB loading bar]: ", this.GlbLoadingBar);
    const gd_resultsByEvaluator = JSON.parse(localStorage.getItem('gd_resultsByEvaluator') as any);
    if(gd_resultsByEvaluator) this.computeData();

    this.refreshOutputsBoard();

    let hasStudy = JSON.parse(localStorage.getItem('gd_hasStudy') as any);
    
    BuildViewer.on( ev =>{
      this.$nextTick(()=> {
        let glb = ev ? ev : 'glb_1';
        const threeContainer = document.getElementById('gallery_container') as HTMLElement;
        while (threeContainer.firstChild) {
          threeContainer.removeChild(threeContainer.lastChild as ChildNode);
        }
        
        const canvas = document.createElement("canvas");
        canvas.classList.add("result_canvas");
        canvas.id = "three_canvas";
        threeContainer.appendChild(canvas);

        // const viewer = new Viewer(canvas, []);
        let interval = setInterval( async ()=>{
            let blob = await IDB.getDataByKeyAsync( glb );
            if(blob){
                clearInterval(interval);
                // console.log('[Viewer:Blob] ', blob)
                await DSEViewer.init(canvas, [], blob)

                // console.log('Renderer: ' ,DSEViewer.renderer)
            }
        }, 100)
      })
    })

    DestroyViewer.on( ev =>{
      // this.viewer.renderer.forceContextLoss();
    })

    GenFinished.on( ev => {
      this.computeData()

      switch (this.currentTab) {
        case 'Scatterplot chart':
            // DestroyViewer.emit()
            this.visualizeResult()
          break;

        case 'Data table':
          this.$nextTick(()=>{
            // DestroyViewer.emit()
            // this.computeData()
          })
          break;
        
        case '3D visual':
          this.$nextTick(()=>{
            // this.buildViewer()
            BuildViewer.emit()
          })
          break;
        default:
          break;
      }
    })

    Refresh.on( ev => {
      this.refreshOutputsBoard();
    })

    ClearData.on( ev => {
      localStorage.removeItem('gd_resultsByEvaluator');
      localStorage.removeItem('gd_varsData');
      localStorage.removeItem('gd_currentInputs');
      localStorage.removeItem('gd_goals');
      localStorage.setItem('has_study', 'false');
      this.data = [];
      this.columns = [];
      this.refreshOutputsBoard();
    })

    GlbUpdated.on( ev => {
      console.log('EVENT GLB UPDATED: ', ev )
      this.buildViewer(ev);
    })
  
  },
  methods: {
    visualizeResult(){
      // const w = 700;
      // const h = 500;
      let margin = {top: 10, right: 10, bottom: 10, left: 10},
          w = 700 - margin.left - margin.right,
          h = 500 - margin.top - margin.bottom;

      this.$nextTick(()=>{
        const _svg = document.getElementById('d3Svg') as HTMLElement;
        const svg = d3.select("#d3Svg")//.attr("width", w).attr("height", h);
                      .attr("width", w + margin.left + margin.right)
                      .attr("height", h + margin.top + margin.bottom)
                      // .attr("transform",
                      //       "translate(" + margin.left + "," + margin.top + ")");
                      // .append("g")

        if (_svg && _svg.lastChild)
          while (_svg.lastChild)
              _svg.removeChild(_svg.lastChild);

        const g = svg.append("g");

        // const GD_results = JSON.parse(localStorage.getItem('gd_result') as any);
        // if( !GD_results || GD_results.length == 0){
        //     window?.$message.error('No data to visualize')
        //     return;
        // }
        // const GD_d3 = JSON.parse(localStorage.getItem('gd_d3') as any);
        
        //TODO: new way - create update data method after generation finished
        
        const objectives = [
          {
            evaluatorName: "Exterior area",
            goal: "max"
          },
          {
            evaluatorName: "Podium volume",
            goal: "min"
          },
          {
            evaluatorName: "Tower volume",
            goal: "undefined"
          },
          {
            evaluatorName: "Total building area",
            goal: "undefined"
          },
          {
            evaluatorName: "Total facade area",
            goal: "undefined"
          },
        ];

        const gd_resultsByEvaluator = JSON.parse(localStorage.getItem('gd_resultsByEvaluator') as any);
        let GD_d3 = JSON.parse(localStorage.getItem('gd_d3'));

        if(!gd_resultsByEvaluator) return;
        if (!GD_d3){

          const gd_d3 = {
            x_axis: Object.keys(gd_resultsByEvaluator)[0],
            y_axis: Object.keys(gd_resultsByEvaluator)[1],
            size: Object.keys(gd_resultsByEvaluator)[2],
            color: Object.keys(gd_resultsByEvaluator)[3]
          };
          localStorage.setItem('gd_d3', JSON.stringify(gd_d3));
        }

        
        const padding = 50;
        const maxX = d3.max( [ ...gd_resultsByEvaluator[GD_d3['x_axis']] ], (d,i) => d);
        const maxY = d3.max( [ ...gd_resultsByEvaluator[GD_d3['y_axis']] ], (d,i) => d);
        const maxSize = d3.max( [...gd_resultsByEvaluator[GD_d3['size']] ], (d,i) => d);
        const maxColor = d3.max( [...gd_resultsByEvaluator[GD_d3['color']] ], (d,i) => d);
        
        const xScale = d3.scaleLinear()
                          .domain([0, maxX as number])
                          .range([padding, w - padding]);

        const yScale = d3.scaleLinear()
                          .domain([0, maxY as number])
                          .range([h- padding, padding]);

        const sizeScale = d3.scaleLinear()
                          .domain([0, maxSize as number])
                          .range([0, 10]);

        const colorScale = d3.scaleLinear()
                          .domain([0, maxColor as number])
                          .range([0, 1]);

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);

        let x = svg.append("g")
            .attr("transform", `translate(0, ${(h-padding)})`)
            .style("fill", "#ffffff")
            .call(xAxis);

        let y = svg.append("g")
            .attr("transform", `translate(${(padding)}, 0)`)
            .style("fill", "#ffffff")
            .call(yAxis); 

        // console.log('[X scale]: ',xAxis);
        // console.log('[Y scale]: ',yAxis);


        // const GD_data = JSON.parse(localStorage.getItem('gd_study') as any);
        const GD_data = JSON.parse(localStorage.getItem('gd_varsData') as any);
       
          const clip = svg.append("defs").append("SVG:clipPath")
              .attr("id", "clip")
              .append("SVG:rect")
              .attr("width", w )
              .attr("height", h - padding )
              .attr("x", 13)
              .attr("y", 0);
        
        
          const scatter = svg.append('g')
              .attr("clip-path", "url(#clip)")

          // Add circles
          scatter
            .selectAll("circle")
            .data([...GD_data])
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d.outputs[GD_d3['x_axis']]) )
            .attr("cy", (d) => yScale(d.outputs[GD_d3['y_axis']]) )
            .attr("r",  (d) => sizeScale(d.outputs[GD_d3['size']]) )
            .attr('fill', (d) => d3.interpolateRainbow(colorScale(d.outputs[GD_d3['color']])))
            // .style("fill", "#61a3a9")
            .attr("class", "chart_circle")
            .style("opacity", 0.5)
            .append("title")
            // .attr('class', 'svg_tooltip')
            .text((d) => `Generation: ${d.generation}\nVariant: ${d.varNum}\nSite offset: ${d.inputs.site_offset}\nTotal floors: ${d.inputs.total_floors}\nTower floor height: ${d.inputs.tower_floor_height}\nPodium floor height: ${d.inputs.podium_floor_height}`)


          // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
          let zoom = d3.zoom()
              .scaleExtent([1, 5])  // This control how much you can unzoom (x0.5) and zoom (x20)
              .extent([[0, 0], [w, h]])
              .on("zoom", (event) => {

                // recover the new scale
                let newX = event.transform.rescaleX(xScale);
                let newY = event.transform.rescaleY(yScale);

                // update axes with these new boundaries
                x.call(d3.axisBottom(newX))
                y.call(d3.axisLeft(newY))
                
                // update circle position
                scatter
                  .selectAll("circle")
                  .attr('cx', (d) => newX( (d as any).outputs[GD_d3['x_axis']] ))
                  .attr('cy', (d) => newY( (d as any).outputs[GD_d3['y_axis']] ));

              }) as any;

          // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
          svg.append("rect")
              .attr("width", w - 20)
              .attr("height", h - 20)
              .style("fill", "none")
              .style("pointer-events", "all")
              .attr('transform', 'translate(' + margin.left + ',' + margin.top+ ')')
              .call( zoom );

          scatter.raise()


        //** Testing ather D3 charts  **/
        // Parse the Data
      //   d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", (data) => {

      //   // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
      //   let dimensions = (d3 as any).keys(data[0]).filter( (d) => { return d != "Species" })

      //   // For each dimension, I build a linear scale. I store all in a y object
      //   // let y = {}
      //   // for ( let i in dimensions) {
      //   //   let name = dimensions[i]
      //   //   y[name] = d3.scaleLinear()
      //   //     .domain( d3.extent(data, (d) => { return +d[name] }) as any)
      //   //     .range([h, 0])
      //   // }

      //   // // Build the X scale -> it find the best position for each Y axis
      //   // let x = d3.scalePoint()
      //   //   .range([0, w])
      //   //   .padding(1)
      //   //   .domain(dimensions);

      //   // // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
      //   // function path(d) {
      //   //     return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
      //   // }

      //   // // Draw the lines
      //   // svg
      //   //   .selectAll("myPath")
      //   //   .data(data)
      //   //   .enter().append("path")
      //   //   .attr("d",  path)
      //   //   .style("fill", "none")
      //   //   .style("stroke", "#69b3a2")
      //   //   .style("opacity", 0.5)

      //   // // Draw the axis:
      //   // svg.selectAll("myAxis")
      //   //   // For each dimension of the dataset I add a 'g' element:
      //   //   .data(dimensions).enter()
      //   //   .append("g")
      //   //   // I translate this element to its right position on the x axis
      //   //   .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      //   //   // And I build the axis with the call function
      //   //   .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
      //   //   // Add axis title
      //   //   .append("text")
      //   //     .style("text-anchor", "middle")
      //   //     .attr("y", -9)
      //   //     .text( ((d) => { return d; } ) as any)
      //   //     .style("fill", "black")
      //   }
      })



      
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
    tabChange(e){

      console.log("Tab click")
      // * SVG output
      const three_canvas = document.getElementById('three_canvas') as HTMLElement;
      // this.$nextTick(()=>{
        
      //   const threeContainer = document.getElementById('gallery_container') as HTMLElement;
      //   console.log("Tab click", threeContainer)
      //   if(threeContainer) {//&& this.hasStudy
      //     this.buildViewer()
      //   }
      // })

      //* SVG output
      // const svg = document.getElementById('d3Svg') as HTMLElement;
      // if(svg && this.hasStudy) this.visualizeResult()

    },
    buildViewer(glb: string = 'glb_1') {
      this.hasViewer = true;

      // let resultsData = JSON.parse(localStorage.getItem('gd_study') as any);

      // const gens = resultsData.length;
      this.$nextTick(()=>{
        const threeContainer = document.getElementById('gallery_container') as HTMLElement;
        while (threeContainer.firstChild) {
          threeContainer.removeChild(threeContainer.lastChild as ChildNode);
        }
        
        let canvas = document.createElement("canvas");
        canvas.classList.add("result_canvas");
        canvas.id = "three_canvas";
        threeContainer.appendChild(canvas);

        let viewer = new Viewer(canvas, []);
        let interval = setInterval( async ()=>{
            let blob = await IDB.getDataByKeyAsync( glb );
            if(blob){
                clearInterval(interval);
                // console.log('[Viewer:Blob] ', blob)
                await viewer.init(canvas, [], blob)

                // console.log('Renderer: ' ,viewer.renderer)
            }
        }, 100)

      })

      // console.log("[Generations]: ", gens);
      //* Clear all children if any

      // const data = {inputs: {width: 20, height: 30, length: 80}};
      // const canvas = document.getElementById("three-canvas") as HTMLElement;
      // const viewer = new Viewer(canvas, data);
      // for ( let i=0; i < 1; i++) {


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

    },
    computeData(){
      const GD_results = JSON.parse(localStorage.getItem('gd_result'));
      const GD_study = JSON.parse(localStorage.getItem('gd_study'));
      if(this.data.length > 0 || this.columns.length > 0 ) return

      const mock_table_data = [
        {
          "Generation": 1,
          "Variant": 0,
          "Exterior area": 10,
          "Podium volume": 110,
          "Tower volume": 100,
          "Total building area": 10,
          "Total facade area": 10
        },
        {
          "Generation": 1,
          "Variant": 1,
          "Exterior area": 15,
          "Podium volume": 150,
          "Tower volume": 150,
          "Total building area": 15,
          "Total facade area": 15
        },
        {
          "Generation": 1,
          "Variant": 2,
          "Exterior area": 20,
          "Podium volume": 120,
          "Tower volume": 200,
          "Total building area": 20,
          "Total facade area": 20
        },
        {
          "Generation": 1,
          "Variant": 3,
          "Exterior area": 25,
          "Podium volume": 125,
          "Tower volume": 250,
          "Total building area": 25,
          "Total facade area": 25
        },
        {
          "Generation": 1,
          "Variant": 4,
          "Exterior area": 30,
          "Podium volume": 130,
          "Tower volume": 300,
          "Total building area": 30,
          "Total facade area": 30
        },
        {
          "Generation": 1,
          "Variant": 5,
          "Exterior area": 35,
          "Podium volume": 135,
          "Tower volume": 350,
          "Total building area":35,
          "Total facade area": 35
        },
        {
          "Generation": 1,
          "Variant": 6,
          "Exterior area": 40,
          "Podium volume": 140,
          "Tower volume": 400,
          "Total building area": 40,
          "Total facade area": 40
        }
      ]
      this.$nextTick(()=>{

        const GD_data = JSON.parse(localStorage.getItem('gd_varsData') as any);
        if (!GD_data) return; 
        // const mock_columns = mock_table_data[0]
        // const keys = Object.keys(mock_columns);
  
        // for( let i = 0; i < keys.length; i++ )
        //   this.columns.push({title: keys[i], key: keys[i]})
  
        // this.data = mock_table_data
        this.columns = [
          {title: 'Generation №', key: 'generation'},
          {title: 'Variant №', key: 'variant'},  
          {title: 'Exterior area', key: 'exteriorArea'},
          {title: 'Podium volume', key: 'podiumVolume'},
          {title: 'Tower volume', key: 'towerVolume'},
          {title: 'Total building area', key: 'totalBuildingArea'},
          {title: 'Facade area', key: 'facadeArea'},
  
        ]
        
        // const keys = Object.keys(GD_data[0].outputs);
  
        // for( let i = 0; i < keys.length; i++ )
        //   this.columns.push({title: keys[i], key: keys[i]})
  
        
        for( let i = 0; i < GD_data.length; i++ ) {
          let outs = Object.keys(GD_data[i].outputs);
          let data = {};
  
          for( let j = 0; j < outs.length; j++ ){
            data[outs[j]] = GD_data[i].outputs[outs[j]];
          }
          data['generation'] = GD_data[i].generation;
          data['variant'] = GD_data[i].varNum;
  
          this.data.push(data);
        }
      })


      // if( GD_results && this.hasStudy ){
      //   const keys = Object.keys(GD_results);
      //   for( let i = 0; i < keys.length; i++ )
      //     this.columns.push({title: keys[i], key: keys[i]})

      //   for( let i = 0; i < GD_study.length; i++ ) {
      //     let outs = Object.keys(GD_study[i].outputs);
      //     let data = {};

      //     for( let j = 0; j < outs.length; j++ ){
      //       data[keys[j]] = GD_study[i].outputs[keys[j]];
      //     }
      //     // data['sorter'] = (row1, row2) => row1[data['key']] - row2[data['key']]
      //     this.data.push(data);
      //   }
      //   // console.log(this.data);

      //   // this.buildViewer();
      // }
    },
    handleUpdateValue(value: any){
      switch (value) {
        case 'Scatterplot chart':
            DestroyViewer.emit()
            this.visualizeResult()
            this.currentTab = value;
          break;

        case 'Data table':
          this.$nextTick(()=>{
            DestroyViewer.emit()
            // this.computeData()
          })
          this.currentTab = value;
          break;
        
        case '3D visual':
          this.$nextTick(()=>{
            // this.buildViewer()
            BuildViewer.emit()
          })
          this.currentTab = value;
          break;

        default:
          break;
      }
    },
    updateChart(){
      // const newX = d3.event.transform.rescaleX(x);
      // const newY = d3.event.transform.rescaleY(y);

      // // update axes with these new boundaries
      // xAxis.call(d3.axisBottom(newX))
      // yAxis.call(d3.axisLeft(newY))

      // // update circle position
      // scatter
      //   .selectAll("circle")
      //   .attr('cx', function(d) {return newX(d.Sepal_Length)})
      //   .attr('cy', function(d) {return newY(d.Petal_Length)});
    },
    refreshOutputsBoard(){
      switch (this.currentTab) {
        case 'Scatterplot chart':
            DestroyViewer.emit()
            this.visualizeResult()
          break;

        case 'Data table':
          this.$nextTick(()=>{
            DestroyViewer.emit()
            // this.computeData()
          })
          break;
        
        case '3D visual':
          this.$nextTick(()=>{
            // this.buildViewer()
            BuildViewer.emit()
          })
          break;

        default:
          break;
      }
    }
  }
});
</script>

<style >

#noData_logo{
  position: absolute;
  bottom: 220px;
  right: 27%;
  width: 500px;
}
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
  margin: 10px; 
  /*30px;background-color: #efefef; */

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
  height: 100% !important;
}

.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.n-tabs{
  --n-bar-color:#153048 !important;
  font-size: 16px !important;
  font-weight: bold !important;
  font-family: 'Chakra Petch', sans-serif !important;
}

.n-tabs-pane-wrapper{
  /* height: 700px !important; */
}

.n-tabs-tab__label{
  color: #153048 !important
}

.n-card{
  border: 0px solid !important;
}

.results3D{
  position: relative;
  /* background-color: aquamarine !important; */
  width: 97%;
  height: 100%;  /* <<<-------------------  this controls the height of the canvas */
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