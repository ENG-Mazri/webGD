<template>
  <div class="d3Panel" ref="$wrapper" @showResultEvent="visualizeResult">
    <!-- <div class="d3Panel_footer">
      <h3> Output chart data</h3>
      <h5 id="xAxis_tag">X - axis: </h5>
      <h5 id="yAxis_tag">Y - axis: </h5>
      <h5 id="size_tag">Size: </h5>
      <h5 id="color_tag">Color: </h5>
    </div> -->
    <n-card style="margin-bottom: 16px" class="d3Panel_main" justify-content="space-evenly">
      <n-tabs @click="tabChange" type="line" animated justify-content="space-around" :disabled="hasTabs" tab-style="color: #a2588f; font-size: 16px !important;">
        <n-tab-pane name="Scatterplot chart" tab="Scatterplot chart">
          <div class="d3Panel_main" id="d3Panel_main">
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
        <n-tab-pane name="3D results" tab="3D results">
          <n-scrollbar style="max-height: 550px">
          <div class="results3D" id="gallery_container">
              <!-- <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div> -->
          </div>
          </n-scrollbar>
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


export default defineComponent({
  components:{
    outputIcon
  },
  name: 'D3Panel',
  props: {
    msg: String,
  },
  data() {
    return {
      show: false,
      store: useDesign().design,
      active: 0,
      hasTabs: true,
      columns: [],
      data: [],
      selectedVarData: {}
    }
   
  },
  watch:{
    store(){
      console.log("D3 PANEL WATCHING STORE")
    }
  },
  mounted() {
    const GD_results = JSON.parse(localStorage.getItem('gd_result'));
    const GD_study = JSON.parse(localStorage.getItem('gd_study'));

    if( GD_results ){
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
      // const GD_d3 = JSON.parse(localStorage.getItem('gd_d3') as any);
      // if ( GD_d3 && Object.keys(GD_d3).length > 0 ) {
      //   window.dispatchEvent(show_chart_event)
      //   console.log("Dispatch show chart")

      // }

  },
  methods: {
    visualizeResult(){
    },
    tabChange(){
      console.log("Tab click")

      const threeContainer = document.getElementById('gallery_container') as HTMLElement;

      // if(threeContainer) {
      //   this.buildViewer()
      // }
   
      const svg = document.getElementById('d3Svg') as HTMLElement;

      if(svg) {
        const GD_d3 = JSON.parse(localStorage.getItem('gd_d3') as any);
        if ( GD_d3 && Object.keys(GD_d3).length > 0 ) {
          window.dispatchEvent(show_chart_event)
          console.log("Dispatch show chart")

        }
      }

    },
    buildViewer() {
      let resultsData = JSON.parse(localStorage.getItem('gd_study') as any);

      const gens = resultsData.length;
      const threeContainer = document.getElementById('gallery_container') as HTMLElement;

      //* Clear all children
      while (threeContainer.firstChild) {
        threeContainer.removeChild(threeContainer.lastChild as ChildNode);
      }
      
      // const data = {inputs: {width: 20, height: 30, length: 80}};
      // const canvas = document.getElementById("three-canvas") as HTMLElement;
      // const viewer = new Viewer(canvas, data);
      for ( let i=0; i < gens; i++) {
        let canvas = document.createElement("canvas");
        canvas.classList.add("result_canvas");
        threeContainer.appendChild(canvas);
        const viewer = new Viewer(canvas,resultsData[i]);
      }
    }
  }
});
</script>

<style >
.d3Panel{
  position: absolute;
  left: 300px;
  top: 35px;
  width: 700px;
  height: 650px;
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
  /*background-color: #efefef;*/

}

.d3Panel_footer{
  /*background-color: #efefef;*/
  height: 25%;
  text-align: left;
  border-top: 2px dashed #9cabb4;

}

.d3Panel_footer > * {
  margin: 5px 10px;
}

.d3Panel_main{
  height: 75%;
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
  height: 700px !important;
}

.n-card{
  border: 0px solid !important;
}

.results3D{
  position: relative;
  /* background-color: aquamarine; */
  width: 97%;
  height: 100%;
  margin: 3px;
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content:space-evenly;
  /* box-shadow: 0px 0px 25px 10px rgba(170, 170, 170, 0.2); */
  /* border-radius: 10px; */
}

/* .result_canvas{
  position: relative !important;
  background-color: white!important;
  width: 30% !important;
  height: 120px !important;
  margin: 5px 0px !important;
  border: 1px solid #9cabb4 !important;
  border-radius: 10px !important;
} */

canvas{
  position: relative !important;
  background-color: white!important;
  width: 100% !important;
  height: 100% !important;
  margin: 5px 0px !important;
  /* border: 1px solid #9cabb4 !important; */
  /* border-radius: 10px !important; */
}
</style>