<template>

    <n-button @click="init2">
        Draw site
        <template #icon>
            <n-icon>
                <PencilIcon/>
            </n-icon>
        </template>
    </n-button>
    <n-modal v-model:show="showModal">
        <n-card
            id="draw-card"
            style="width: 70vw"
            title="Building mass generator"
            :bordered="true"
            size="huge"
            role="dialog"
            aria-modal="true"
            :mask-closable="false"
        >
        <template #header-extra>
            Site boundaries
        </template>
        <div class="drawPad" id="drawPad">
            <canvas id="drawPad-canvas"></canvas>
        </div>
        </n-card>
    </n-modal>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {useDesign} from '../../store/design';
import { Pencil as PencilIcon } from '@vicons/ionicons5';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { DrawPad } from '../../logic/DrawPad'

export default defineComponent({
    name: 'DrawPadVue',
    components:{ PencilIcon },
    props: {
        function: String
    },
    setup () {
        return {}
    },
    data() {
        return {
            showModal: false,
            // threeCanvas: null as HTMLElement,
            raycaster: new THREE.Raycaster(),
            mouse: new THREE.Vector2(),
            contour: [],
            // camera: null as THREE.OrthographicCamera,
            padMesh: null as THREE.Mesh,
            // scene: new THREE.Scene(),
            currShpere: null as THREE.Mesh,
            currLine: null as Line2,
            firstPoint: null as THREE.Vector3,
            lastPoint: null as THREE.Vector3,
            polygoneClodsed: false,
            // renderer: null as THREE.WebGLRenderer,
            size: {width:0, height: 0},
            // labelRenderer: new CSS2DRenderer(),
            // previewElement: null as CSS2DObject,
            // htmlPreview: null as HTMLElement,
            lineMat: null as LineMaterial,
            // controls: null as OrbitControls,
        }
    },
    mounted() {
        // console.log("Function: ", this.function);
        this.contour.length = 0;
        // this.init2()

    },
    watch: {},
    methods: {
        init(){
            // this.showModal = true
            // this.$nextTick(()=>{
            //     const threeContainer = document.getElementById('drawPad') as HTMLElement;

            //     //* Clear all children
            //     while (threeContainer.firstChild) {
            //         threeContainer.removeChild(threeContainer.lastChild as ChildNode);
            //     }

            //     this.threeCanvas = document.createElement("canvas");
            //     this.threeCanvas.classList.add("drawPad-canvas");
            //     threeContainer.appendChild(this.threeCanvas);

            //     const labelClassName = 'dimension_label';
            //     const previewClassName = 'dimension_preview';
            //     this.htmlPreview = document.createElement('div');
            //     this.htmlPreview.className = previewClassName;
            //     this.htmlPreview.textContent = '0 m';
            //     this.previewElement = new CSS2DObject(this.htmlPreview)

            //     // let threeCanvas = document.querySelector('#drawPad-canvas') as HTMLElement;
            //     // // let width = box.offsetWidth;
            //     // // let height = box.offsetHeight;
            //     // const threeCanvas = document.getElementById("drawPad-canvas");
            //     console.log(this.threeCanvas )
            //     this.size = {
            //         width: this.threeCanvas.offsetWidth,
            //         height: this.threeCanvas.offsetHeight,
            //     };

            //     const fov = 45;
            //     const aspect = 2;  // the canvas default
            //     const near = 0.1;
            //     const far = 1000;

            //     this.camera = new THREE.OrthographicCamera( this.size.width / - 2, this.size.width / 2, this.size.height / 2, this.size.height / - 2, 1, 1000 );
            //     this.camera.position.set(0, 5, 0);
            //     this.camera.up.set(0, 1, 0);
            //     this.camera.lookAt(0, 0, 0);
            //     this.camera.zoom = 30;
            //     this.camera.updateProjectionMatrix();
            //     this.scene.add( this.camera );

            //     //Creates the lights of the scene
            //     const lightColor = 0xffffff;

            //     const ambientLight = new THREE.AmbientLight(lightColor, 0.4);
            //     this.scene.add(ambientLight);

            //     const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
            //     light1.position.set(30, 25, -10);
            //     light1.shadow.mapSize.width = 1024;
            //     light1.shadow.mapSize.height = 1024;

            //     const d = 10;
            //     light1.shadow.camera.left = -d;
            //     light1.shadow.camera.right = d;
            //     light1.shadow.camera.top = d;
            //     light1.shadow.camera.bottom = -d;
            //     light1.shadow.camera.far = 1000;

            //     const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
            //     light2.color.setHSL(11, 43, 96);
            //     light2.position.set(-10, 0, 30);

            //     this.scene.add(light1);
            //     this.scene.add(light2);

            //     //Sets up the renderer, fetching the canvas of the HTML
            //     this.renderer = new THREE.WebGLRenderer({
            //         canvas: this.threeCanvas,
            //         alpha: true,
            //         antialias: true,
            //         logarithmicDepthBuffer:true
            //     });

            //     this.renderer.setSize( this.size.width, this.size.height);
            //     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            //     // this.renderer.outputColorSpace = THREE.SRGBColorSpace;
            //     this.renderer.shadowMap.enabled = true;

            //     this.labelRenderer.setSize( this.size.width, this.size.height );
            //     this.labelRenderer.domElement.style.position = 'absolute';
            //     this.labelRenderer.domElement.style.top = '0px';
            //     this.labelRenderer.domElement.style.zIndex = '-10';
            //     (this.labelRenderer as any).className = labelClassName;
            //     document.body.appendChild( this.labelRenderer.domElement );

            //     // Creates grids and axes in the scene
            //     const grid = new THREE.GridHelper(200, 200);
            //     this.scene.add(grid);

            //     // Creates the orbit controls (to navigate the scene)
            //     this.controls = new OrbitControls( this.camera, this.threeCanvas);
            //     // controls.enableRotate = false;
            //     this.controls.target.set(0, 3, 0)
            //     // controls.target.set(0, 3, 0)

            //     //* Animation loop
            //     let ctrl = this.controls;
            //     let rnd = this.renderer;
            //     let lbRnd = this.labelRenderer;
            //     let s = this.scene;
            //     let c = this.camera
            //     const animate = () => {
            //         ctrl.update();
            //         rnd.render(s, c);
            //         lbRnd.render( s, c );
            //         // composer.render()
            //         // console.log("Camera pos: ", camera.position)
            //         // console.log("Target pos: ", controls.target)

            //         requestAnimationFrame(animate);
            //     };
            //     animate();

            //     this.lineMat = new LineMaterial({ color: 0xa2588f, linewidth: 0.01 });

            //     this.padMesh = new THREE.Mesh(  new THREE.BoxGeometry( 200, 0, 200 ),
            //                                     new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 0.2} )); 
            //     this.scene.add( this.padMesh );

            //     this.threeCanvas.onclick = this.pick;

            //     window.addEventListener("resize", () => {
            //         this.camera.updateProjectionMatrix();
            //         this.renderer.setSize(this.size.width, this.size.height);
            //         this.labelRenderer.setSize( this.size.width, this.size.height );
            //     });
    
            //     window.addEventListener('mousemove', this.onMouseMove)
            // })

        },
        cast(e: any, threeCanvas: HTMLElement, camera: THREE.OrthographicCamera) {
            const bounds = threeCanvas.getBoundingClientRect();

            const x1 = e.clientX - bounds.left;
            const x2 = bounds.right - bounds.left;
            this.mouse.x = (x1 / x2) * 2 - 1;
        
            const y1 = e.clientY - bounds.top;
            const y2 = bounds.bottom - bounds.top;
            this.mouse.y = -(y1 / y2) * 2 + 1;
        
            this.raycaster.setFromCamera(this.mouse, camera);
            return this.raycaster.intersectObject(this.padMesh)[0];
        },
        onMouseMove( e: any, scene: THREE.Scene, htmlPreview: HTMLElement, previewElement: CSS2DObject, threeCanvas: HTMLElement, camera: THREE.OrthographicCamera ){
            const found = this.cast(e, threeCanvas, camera);
            // console.log(found)
            if (found && !this.polygoneClodsed) {
                if(this.currShpere){
                    this.currShpere.position.copy(found.point);  
                    // htmlPreview.textContent = `${e.clientX} mm`
                    // previewElement.position.copy(found.point)           
                }else {

                    const sphereMesh = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 30, 30),
                    new THREE.MeshBasicMaterial({color: 0x9cabb4})
                    );
                    sphereMesh.position.copy(found.point);

                    // if (!firstPoint) firstPoint = found.point;
                    // lastPoint = found.point;
                    // contour.push(found.point);
                    this.currShpere = sphereMesh;
                    
                    sphereMesh.updateMatrix()
                    scene.add(sphereMesh);
                    previewElement.position.copy(found.point)
                    scene.add(previewElement)

                }
                //* draw line 
                if( this.contour.length >= 1 ){
                    if(this.currLine){
                        let geometry = new THREE.BufferGeometry().setFromPoints([this.lastPoint, found.point]);    
                        this.currLine.geometry.setPositions( Array.from(geometry.attributes.position.array) );
                        let dist: any = this.lastPoint.distanceTo(found.point);
                        htmlPreview.textContent = `${Number.parseFloat(dist).toFixed(2)} m`;
                        const midpoint = new THREE.Vector3();
                        midpoint.addVectors( this.lastPoint, found.point ).divideScalar( 2 );
                        previewElement.position.copy(midpoint);
                        

                    } else {
                        const geometry = new THREE.BufferGeometry().setFromPoints([this.lastPoint, found.point]);
                        const geom = new LineGeometry();
                        geom.setPositions( Array.from(geometry.attributes.position.array) );
                        const line = new Line2(geom, this.lineMat);
                        line.computeLineDistances()
                        this.currLine = line;
                        scene.add(line);
                    }
                }
            }
        },
        pick(e: any, scene: THREE.Scene, htmlPreview: HTMLElement, threeCanvas: HTMLElement, camera: THREE.OrthographicCamera ){
            let found = this.cast(e, threeCanvas, camera);
            // console.log(found)
            if (found && !this.polygoneClodsed) {
                const sphereMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 30, 30),
                new THREE.MeshBasicMaterial({color: 0xa2588f})
                );
                sphereMesh.position.copy(found.point);
                sphereMesh.updateMatrix()

                if (!this.firstPoint) this.firstPoint = found.point;
                
                scene.add(sphereMesh);
                
                //* draw line 
                if( this.contour.length >= 1 ){
                    console.log("Dist: ", found.point.distanceTo(this.firstPoint))
                    if (this.firstPoint && found.point.distanceTo(this.firstPoint) < 0.5) { 
                            found.point.copy(this.firstPoint)
                            const geometry = new THREE.BufferGeometry().setFromPoints([this.lastPoint, this.firstPoint]);
                            const geom = new LineGeometry();
                            geom.setPositions( Array.from(geometry.attributes.position.array) );
                            // const line = new THREE.Line(geometry, lineMat);
                            const _line = new Line2(geom, this.lineMat);
                            _line.computeLineDistances()
                            scene.add(_line);
                            this.polygoneClodsed = true;
                            htmlPreview.textContent = '';
                        } else {
                            
                            const geometry = new THREE.BufferGeometry().setFromPoints([this.lastPoint, found.point]);
                            const geom = new LineGeometry();
                            geom.setPositions( Array.from(geometry.attributes.position.array) );
                            const _line = new Line2(geom, this.lineMat);
                            _line.computeLineDistances()
                            scene.add(_line);
                        }
                }
                this.contour.push(new THREE.Vector2(found.point.x, found.point.z));      

                this.lastPoint = found.point;

            }
        },
        animate(self: any){
            self.controls.update();
            self.renderer.render(self.scene, self.camera);
            self.labelRenderer.render( self.scene, self.camera );
            requestAnimationFrame(() => self.animate());
        },
        init2(){

            this.showModal = true
            this.$nextTick(()=>{
                const threeCanvas = document.getElementById('drawPad-canvas') as HTMLElement;
                const drawPad = new DrawPad(threeCanvas);

                // threeCanvas.addEventListener('click', (e)=>{
                //     this.pick(e, scene, htmlPreview, threeCanvas, camera);
                // })
                // window.addEventListener('mousemove', (e)=>{
                //     this.onMouseMove( e, scene, htmlPreview, previewElement, threeCanvas, camera );
                // })
            })
        }

    }
})
</script>

<style>
.dimension_label{
    width:20px;
    height: 20px;
    z-index: 3001 !important;

}
.dimension_label:after{
    width:20px;
    height: 20px;
    z-index: 3001 !important;

}
.dimension_preview{
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    font-weight: bold;
    font-size:medium;
    color: #a2588f;
    z-index: 2001 !important;
}
.dimension_preview:after{
    z-index: 2001 !important;
}
/* #drawPad-canvas{
    z-index: 10 !important;
} */
</style>