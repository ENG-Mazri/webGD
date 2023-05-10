<template>
  <InputPanel/>
  <!-- <div class="canvas">
      <canvas id="three-canvas"></canvas>
  </div> -->
    <div class="outputPanel_gallery">
    <n-scrollbar style="max-height: 650px">
      <div class="panel_header">
        <h3> Output 3D gallery </h3>
      </div>
      <n-space vertical class="outputPanel_gallery_main">
        <div class="canvas" >
          <canvas id="three-canvas"></canvas>
        </div>
        <n-skeleton height="200px" width="100%" />
        <n-skeleton height="200px" width="100%" />
        <n-skeleton height="200px" width="100%" />
        <n-skeleton height="200px" width="100%" />
        <n-skeleton height="200px" width="100%" />
        <n-skeleton height="200px" width="100%" />
      </n-space>    
    </n-scrollbar>
    </div>
  <D3Panel/>
  <p id="app_stamp">Generative design application &copy; - 2023</p>
    
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as d3 from "d3";
import {TestAlgorithm} from '../logic/testAlgorithm';
import {InputParameters} from '../types/inputsParameters';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import InputPanel from './InputPanel.vue';
import D3Panel from './D3Panel.vue';
import {useDesign} from '../store/design';
import { Viewer } from '../logic/Viewer'


export default defineComponent({
  name: 'Main',
  components: {
    InputPanel, D3Panel
  },
  props: {
    msg: String,
  },
  data() {
    return {
      store: '' as any
    }
  },
  mounted() {
    this.store = useDesign();
    // this.$on('showResultEvent', ()=>{ console.log('HELLOOOOOOOOOOO')})
    window.addEventListener("build", (e) => {
        this.buildViewer()
        console.log("Fired event...")
      },
      false
    );


    

  },
  methods:{
    buildViewer(){
      const data = {}
      const threeCanvas = document.getElementById("three-canvas") as HTMLElement;
      const viewer = new Viewer(threeCanvas, data);
    }
   
  }
});
</script>

<style >
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600&display=swap');
.canvas{
  /* display: none */
  height: 300px;
}
/* h3{
  margin: 40px 0 0;
} */
.bar:hover{
  fill: yellow;
}

#scatter:hover{
  fill: red;
  cursor: pointer
}

.outputPanel_gallery{
  position: absolute;
  left: 1070px;
  top: 35px;
  width: 400px;
  min-height:100px;
  max-height: 650px;
  margin: 3px;
  padding: 5px;
  display: flex;
  flex-direction: column; 
  text-align: left;
  /* overflow:scroll; */
  box-shadow: 0px 0px 25px 10px rgba(170, 170, 170, 0.2);
}

/* .outputPanel_gallery > * {
  margin: 5px 10px;
} */

h3{
  font-family: 'Chakra Petch', sans-serif;
  font-size: 20px;
  margin: 5px 10px;
}

.panel_header{
  position:sticky;
  top: 0px;
  background-color: white;
  /* margin: 30px 0px; */

}

.outputPanel_gallery_main{
  margin: 30px 0px;
}

#app_stamp{
  position: absolute;
  bottom: 0px;
  left: 15px;
  font-size: 12px;
  font-family: 'Chakra Petch', sans-serif;

}

canvas{
  position: relative;
  background-color: rgba(127, 255, 212, 0.225);
  width: 100% !important;
  height: 100% !important;

}
</style>
