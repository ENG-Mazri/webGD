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
      <div class="outputPanel_gallery_main" id="gallery_container">
      </div>
    </n-scrollbar>
    </div>
  <D3Panel/>
  <p id="app_stamp">Design space explorer &copy; - 2023</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
    // window.addEventListener("generation_completed", (e) => {
    //     this.buildViewer();
    //   },
    //   false
    // );
    // this.buildViewer();


  },
  methods:{
    buildViewer() {
      let resultsData = JSON.parse(localStorage.getItem('gd_result') as any);

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
        threeContainer.appendChild(canvas);
        const viewer = new Viewer(canvas,resultsData[i]);
      }
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
  /* background-color: #efefef; */
  box-shadow: 0px 0px 25px 10px rgba(170, 170, 170, 0.2);
  border-radius: 10px;
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
  padding: 5px
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
  background-color: white;
  width: 100% !important;
  height: 100% !important;
  /* padding: 0px 10x !important; */
  /* border-bottom: 2px dashed #9cabb4; */
  border: 2px dashed #9cabb4;
  border-radius: 10px;


}
</style>
