<template>

    <n-button @click="init">
        Draw site
        <template #icon>
            <n-icon>
                <PencilIcon/>
            </n-icon>
        </template>
    </n-button>
    <n-modal v-model:show="showModal">
        <n-card
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
            <!-- <canvas id="drawPad-canvas"></canvas> -->
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
            showModal: false
        }
    },
    mounted() {
        // console.log("Function: ", this.function);


    },
    watch: {},
    methods: {
        init(){
            this.showModal = true
            this.$nextTick(()=>{
                const threeContainer = document.getElementById('drawPad') as HTMLElement;

                //* Clear all children
                while (threeContainer.firstChild) {
                    threeContainer.removeChild(threeContainer.lastChild as ChildNode);
                }

                let threeCanvas = document.createElement("canvas");
                threeCanvas.classList.add("drawPad-canvas");
                threeContainer.appendChild(threeCanvas);

                const labelClassName = 'dimension_label';
                const previewClassName = 'dimension_preview';
                const htmlPreview = document.createElement('div');
                htmlPreview.className = previewClassName;
                htmlPreview.textContent = '0 m';
                const previewElement = new CSS2DObject(htmlPreview);

                console.log("Preview dim: ", previewElement)

                const scene = new THREE.Scene();

                //Object to store the size of the viewport

                // let threeCanvas = document.querySelector('#drawPad-canvas') as HTMLElement;
                // // let width = box.offsetWidth;
                // // let height = box.offsetHeight;
                // const threeCanvas = document.getElementById("drawPad-canvas");
                console.log(threeCanvas )
                const size = {
                    width: threeCanvas.offsetWidth,
                    height: threeCanvas.offsetHeight,
                };

                const fov = 45;
                const aspect = 2;  // the canvas default
                const near = 0.1;
                const far = 1000;

                const camera = new THREE.OrthographicCamera( size.width / - 2, size.width / 2, size.height / 2, size.height / - 2, 1, 1000 );
                camera.position.set(0, 5, 0);
                camera.up.set(0, 1, 0);
                camera.lookAt(0, 0, 0);
                camera.zoom = 30;
                camera.updateProjectionMatrix();
                scene.add( camera );

                //Creates the lights of the scene
                const lightColor = 0xffffff;

                const ambientLight = new THREE.AmbientLight(lightColor, 0.4);
                scene.add(ambientLight);

                // const directionalLight = new THREE.DirectionalLight(lightColor, 0.5);
                // directionalLight.position.set(11, 43, 96);
                // // directionalLight.target.position.set(-5, 0, 0);
                // scene.add(directionalLight);
                // scene.add(directionalLight.target);

                const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
                light1.position.set(30, 25, -10);
                light1.shadow.mapSize.width = 1024;
                light1.shadow.mapSize.height = 1024;

                const d = 10;
                light1.shadow.camera.left = -d;
                light1.shadow.camera.right = d;
                light1.shadow.camera.top = d;
                light1.shadow.camera.bottom = -d;
                light1.shadow.camera.far = 1000;

                const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
                light2.color.setHSL(11, 43, 96);
                light2.position.set(-10, 0, 30);

                scene.add(light1);
                scene.add(light2);

                //Sets up the renderer, fetching the canvas of the HTML
                const renderer = new THREE.WebGLRenderer({
                    canvas: threeCanvas,
                    alpha: true,
                    antialias: true,
                    logarithmicDepthBuffer:true
                });

                renderer.setSize(size.width, size.height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.outputColorSpace = THREE.SRGBColorSpace;
                renderer.shadowMap.enabled = true;

                let labelRenderer = new CSS2DRenderer();
                labelRenderer.setSize( size.width, size.height );
                labelRenderer.domElement.style.position = 'absolute';
                labelRenderer.domElement.style.top = '0px';
                labelRenderer.domElement.style.zIndex = '-10';
                (labelRenderer as any).className = labelClassName;
                document.body.appendChild( labelRenderer.domElement );
                console.log( renderer.domElement.style )


                // Creates grids and axes in the scene
                const grid = new THREE.GridHelper(200, 200);
                scene.add(grid);

                // const axes = new THREE.AxesHelper(1);
                // axes.material.depthTest = false;
                // axes.renderOrder = 1;
                // scene.add(axes);

                // Creates the orbit controls (to navigate the scene)
                const controls = new OrbitControls(camera, threeCanvas);
                // controls.enableRotate = false;
                controls.target.set(0, 3, 0)
                // controls.target.set(0, 3, 0)

                //* Animation loop
                const animate = () => {
                    controls.update();
                    renderer.render(scene, camera);
                    labelRenderer.render( scene, camera );
                    // composer.render()
                    // console.log("Camera pos: ", camera.position)
                    // console.log("Target pos: ", controls.target)

                    requestAnimationFrame(animate);
                };
                animate();
                //* Adjust the viewport to the size of the browser
                window.addEventListener("resize", () => {
                    // size.width = window.innerWidth;
                    // size.height = window.innerHeight;
                    // camera.aspect = size.width / size.height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(size.width, size.height);
                    labelRenderer.setSize( size.width, size.height );
                    // composer.setSize( size.width, size.height );
                });

                // let firstPoint;
                // let lastPoint;
                // let polygoneClodsed = false;
                // const contour = [];
                // const lineMat = new LineMaterial({color: 0xa2588f,
                //                                 linewidth: 0.01,
                //                                 //   dashed: true,
                //                                 //   dashScale: 2,
                //                                 //   alphaToCoverage: false
                //                                 //   dashSize: 0.01,
                //                                 //   dashOffset: 0.01,
                //                                 //   gapSize: 0.01
                //                                 });

                // const geometry = new THREE.BoxGeometry( 200, 0, 200 ); 
                // const material = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 0.2} ); 
                // const cube = new THREE.Mesh( geometry, material ); 
                // scene.add( cube );

                // const raycaster = new THREE.Raycaster();
                // // raycaster.firstHitOnly = true;
                // const mouse = new THREE.Vector2();
            })


           


            // function cast(e) {
            //     const bounds = threeCanvas.getBoundingClientRect();

            //     const x1 = e.clientX - bounds.left;
            //     const x2 = bounds.right - bounds.left;
            //     mouse.x = (x1 / x2) * 2 - 1;
            
            //     const y1 = e.clientY - bounds.top;
            //     const y2 = bounds.bottom - bounds.top;
            //     mouse.y = -(y1 / y2) * 2 + 1;
            
            //     raycaster.setFromCamera(mouse, camera);
            //     const x = raycaster.intersectObject(cube)[0];
            
            //     // Casts a ray
            //     return x
            // }
            // let currShpere;
            // let currLine;

            

            // window.addEventListener('mousemove', (e)=>{
            //     const found = cast(e);
            //     // console.log(found)
            //     if (found && !polygoneClodsed) {
            //         if(currShpere){
            //             currShpere.position.copy(found.point);  
            //             // htmlPreview.textContent = `${e.clientX} mm`
            //             // previewElement.position.copy(found.point)           
            //         }else {

            //             const sphereMesh = new THREE.Mesh(
            //             new THREE.SphereGeometry(0.2, 30, 30),
            //             new THREE.MeshBasicMaterial({color: 0x9cabb4})
            //             );
            //             sphereMesh.position.copy(found.point);

            //             // if (!firstPoint) firstPoint = found.point;
            //             // lastPoint = found.point;
            //             // contour.push(found.point);
            //             currShpere = sphereMesh;
                        
            //             sphereMesh.updateMatrix()
            //             scene.add(sphereMesh);
            //             previewElement.position.copy(found.point)
            //             scene.add(previewElement)

            //         }
            //         //* draw line 
            //         if( contour.length >= 1 ){
            //             if(currLine){
            //                 let geometry = new THREE.BufferGeometry().setFromPoints([lastPoint, found.point]);    
            //                 currLine.geometry.setPositions( geometry.attributes.position.array );
            //                 let dist = lastPoint.distanceTo(found.point);
            //                 htmlPreview.textContent = `${Number.parseFloat(dist).toFixed(2)} m`;
            //                 const midpoint = new THREE.Vector3();
            //                 midpoint.addVectors( lastPoint, found.point ).divideScalar( 2 );
            //                 previewElement.position.copy(midpoint);
                            

            //             } else {
            //                 const geometry = new THREE.BufferGeometry().setFromPoints([lastPoint, found.point]);
            //                 const geom = new LineGeometry();
            //                 geom.setPositions( Array.from(geometry.attributes.position.array) );
            //                 const line = new Line2(geom, lineMat);
            //                 line.computeLineDistances()
            //                 // line.name = 'dyn'
            //                 console.log("Line: ", lastPoint, found.point)
            //                 currLine = line;
            //                 scene.add(line);
            //             }
            //         }
            //     }

            // })


            // function pick(e) {
            //     const found = cast(e);
            //     // console.log(found)
            //     if (found && !polygoneClodsed) {
            //         const sphereMesh = new THREE.Mesh(
            //         new THREE.SphereGeometry(0.2, 30, 30),
            //         new THREE.MeshBasicMaterial({color: 0xa2588f})
            //         );
            //         sphereMesh.position.copy(found.point);
            //         sphereMesh.updateMatrix()

            //         if (!firstPoint) firstPoint = found.point;
                    
            //         scene.add(sphereMesh);
                    
            //         //* draw line 
            //         if( contour.length >= 1 ){
            //             console.log("Dist: ", found.point.distanceTo(firstPoint))
            //             if (firstPoint && found.point.distanceTo(firstPoint) < 0.5) { 
            //                     found.point.copy(firstPoint)
            //                     const geometry = new THREE.BufferGeometry().setFromPoints([lastPoint, firstPoint]);
            //                     const geom = new LineGeometry();
            //                     geom.setPositions( geometry.attributes.position.array );
            //                     // const line = new THREE.Line(geometry, lineMat);
            //                     const _line = new Line2(geom, lineMat);
            //                     _line.computeLineDistances()
            //                     scene.add(_line);
            //                     polygoneClodsed = true;
            //                     htmlPreview.textContent = ''
            //                     console.log("Contour: ", contour)
            //                 } else {
                                
            //                     const geometry = new THREE.BufferGeometry().setFromPoints([lastPoint, found.point]);
            //                     const geom = new LineGeometry();
            //                     geom.setPositions( geometry.attributes.position.array );
            //                     const _line = new Line2(geom, lineMat);
            //                     _line.computeLineDistances()
            //                     scene.add(_line);
            //                 }
            //         }
            //         contour.push(new THREE.Vector2(found.point.x, found.point.z));      

            //         lastPoint = found.point;

            //     }
            // }

            // threeCanvas.onclick = pick;

        }
    }
})
</script>

<style>
</style>