<template>
  <InputPanel/>
  <div class="canvas">
      <canvas id="three-canvas"></canvas>
  </div>
    <div class="outputPanel_gallery">
    <n-scrollbar style="max-height: 650px">
      <h3> Output 3D gallery </h3>
      <n-space vertical>
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
import {useDesign} from '../store/design'


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
    window.addEventListener(
      "build",
      (e) => {
        console.log("Fired event...")
      },
      false
    );

    //TODO: THREE RENDER
    
    const scene = new THREE.Scene();

    //Object to store the size of the viewport
    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // make the camera look down
    camera.position.set(40, 15, 45);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    //Creates the lights of the scene
    const lightColor = 0xffffff;

    const ambientLight = new THREE.AmbientLight(lightColor, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(lightColor, 0.8);
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(-5, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    const threeCanvas = document.getElementById("three-canvas") as HTMLElement;
    const renderer = new THREE.WebGLRenderer({
        canvas: threeCanvas,
        alpha: true,
        antialias: true,
        logarithmicDepthBuffer:true
    });

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    const grid = new THREE.GridHelper(50, 30);
    // scene.add(grid);

    const controls = new OrbitControls(camera, threeCanvas);

    //* shape
    const geometry = new THREE.BoxGeometry( 12, 19, 33 ); 
    const material = new THREE.MeshPhongMaterial( {color: 0xffb3b3, transparent: true, opacity: 0.7} ); 
    const cube = new THREE.Mesh( geometry, material ); 
    scene.add( cube );

    //* rendering
    // const animate = () => {
    //     controls.update();
    //     renderer.render(scene, camera);
    //     requestAnimationFrame(animate);
    // };
    // animate();

    // window.addEventListener("resize", () => {
    //     size.width = window.innerWidth;
    //     size.height = window.innerHeight;
    //     camera.aspect = size.width / size.height;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(size.width, size.height);
    // });
        

  },
  methods:{
   
  }
});
</script>

<style >
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600&display=swap');
.canvas{
  display: none
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

</style>
