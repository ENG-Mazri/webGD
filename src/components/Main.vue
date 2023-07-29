<template>
  <n-space>
    <InputsPanel @test_eventy="testFunc"
                :hasStudy="hasStudy"
                @generate_finished="hasStudy = true" />
    <OutputsBoard :msg="mockData" :hasStudy="hasStudy"/>
    <!-- <VarResultPanel/> -->

  </n-space>
  <p id="app_stamp">Design space explorer - 2023</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InputsPanel from './InputsPanel.vue';
import OutputsBoard from './OutputsBoard.vue';
import {useDesign} from '../store/design';
import { Viewer } from '../logic/Viewer';
import VarResultPanel from '../components/Rsult3DGallery.vue'
import {IDB} from '../IDB'

export default defineComponent({
  name: 'Main',
  components: {
    InputsPanel, OutputsBoard, VarResultPanel
  },
  props: {
    msg: String,
  },
  data() {
    return {
      store: '' as any,
      mockData: null,
      hasStudy: false
    }
  },
  async mounted() {

    // await IDB.clearStorageAsync();

    this.store = useDesign();
    let resultsData = JSON.parse(localStorage.getItem('gd_study') as any);
    if( !resultsData || resultsData.length > 0) this.hasStudy = true;
    else this.hasStudy = false;

  },
  methods:{
    testFunc(value){
      this.mockData = value;
      console.log("Parent got test event: ", value)
    }
    // buildViewer() {
    //   let resultsData = JSON.parse(localStorage.getItem('gd_result') as any);

    //   const gens = resultsData.length;
    //   const threeContainer = document.getElementById('gallery_container') as HTMLElement;
      
    //   //* Clear all children
    //   while (threeContainer.firstChild) {
    //     threeContainer.removeChild(threeContainer.lastChild as ChildNode);
    //   }
      
    //   // const data = {inputs: {width: 20, height: 30, length: 80}};
    //   // const canvas = document.getElementById("three-canvas") as HTMLElement;
    //   // const viewer = new Viewer(canvas, data);
    //   for ( let i=0; i < gens; i++) {
    //     let canvas = document.createElement("canvas");
    //     threeContainer.appendChild(canvas);
    //     const viewer = new Viewer(canvas,resultsData[i]);
    //   }
    // }
   
  }
});
</script>

<style >
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600&display=swap');

*{
  font-family: 'Chakra Petch', sans-serif !important;
}

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

/* canvas{
  position: relative;
  background-color: white;
  width: 100% !important;
  height: 100% !important;
  border: 2px dashed #9cabb4;
  border-radius: 10px;
} */
</style>
