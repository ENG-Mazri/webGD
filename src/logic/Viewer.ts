import { Scene, Camera, WebGLRenderer, Mesh } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {IDB} from '../IDB'


export class Viewer {

    private scene: Scene;
    private canvas: HTMLElement;
    private renderer: WebGLRenderer;
    private camera: Camera;
    private options: any

    constructor( canvas: HTMLElement, meshes: Mesh[], options:any = {} ) {
        this.options = options;
        // this.init(canvas, meshes)
    }

    async init(canvas: HTMLElement, meshes: Mesh[], blob: any) {
        const scene = new Scene();

        const size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        //* CAMERA SETTINGS
        const fov = 45;
        const aspect = 2; 
        const near = 0.1;
        const far = 3000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        camera.position.set(-220, 228, -124);
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);


        //* LIGHT SETTINGS
        const lightColor = 0xffffff;

        const ambientLight = new THREE.AmbientLight(lightColor, 0.7);
        scene.add(ambientLight);

        const sunlight = new THREE.DirectionalLight();
        sunlight.intensity = 0.3;
        sunlight.position.set(1000, 200, 1000);
        scene.add(sunlight);
        sunlight.castShadow = true;
        sunlight.shadow.camera.top = 200;
        sunlight.shadow.camera.bottom = - 200;
        sunlight.shadow.camera.left = - 200;
        sunlight.shadow.camera.right = 200;
        sunlight.shadow.camera.near = 0.1;
        sunlight.shadow.camera.far = 2000;

        const light2 = new THREE.DirectionalLight(lightColor, 0.3);
        light2.color.setHSL(11, 43, 96);
        light2.position.set(-40, 80, 30);
        scene.add(light2);


        //* RENDER SETTINGS
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer:true
          });
        
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        const renderTarget = new THREE.WebGLRenderTarget(
                size.width,
                size.height,
                {samples: 3}
            )

        const composer = new EffectComposer( renderer, renderTarget );
        composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        composer.setSize(size.width, size.height);

        const renderPass = new RenderPass( scene, camera );
        composer.addPass( renderPass );

        const saoPass = new SAOPass( scene, camera, false, true );
        composer.addPass( saoPass );
        // const fxaaPass = new ShaderPass( FXAAShader );
        // fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.container.offsetWidth * (Math.min(window.devicePixelRatio, 2)) );
        // fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.container.offsetHeight * (Math.min(window.devicePixelRatio, 2)) );
        // composer.addPass(fxaaPass)
        saoPass.params.output = SAOPass.OUTPUT.Default
        saoPass.params.saoBias = 0.5
        saoPass.params.saoIntensity = 0.0008
        saoPass.params.saoScale = .5
        saoPass.params.saoKernelRadius = 10
        saoPass.params.saoMinResolution = 0

        const gPass = new ShaderPass( GammaCorrectionShader );
        composer.addPass(gPass);
        
        // const grid = new THREE.GridHelper(50, 30);
        // scene.add(grid);

        //* CONTROLS SETINGS
        const controls = new OrbitControls(camera, canvas);
        const controls2 = new TrackballControls(camera, canvas);
        // controls.target.set(0,0,0)
        controls.target.set(25, 54, 57);
        controls.enableZoom = false;
        // controls.enablePan = true

        controls2.noPan = true;
        controls2.noRotate = true;
        controls2.noZoom = false;
        controls2.zoomSpeed = 1.5;


        //* GLTF LOADER
        const loader = new GLTFLoader();
        let url = URL.createObjectURL(blob as Blob)
        loader.load(
            url,
            ( gltf ) => {
                // console.log('[Viewer:Blob] ', gltf);
                scene.add( gltf.scene );
                // console.log('[Viewer:Scene] ', scene);

                scene.traverse((child: THREE.Object3D) =>{
                    // console.log(child)

                    if (child.name == 'site_mesh') {
                        child.receiveShadow = true;
                        child.castShadow = true;
                    }
                    
                    else if (child.name == 'slab_mesh' || child.name == 'space_mesh') {
                        // child.receiveShadow = true;
                        child.castShadow = true;
                    }
                });
            },
            ( xhr ) => {        
                // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );       
            },
            ( error ) => {
                console.log( 'An error happened', error );
            }
        );
        
        
        //*RENDERING
        //TODO: try tweaking render pass settings
        const animate = () => {
            const target = controls.target;
            controls.update();
            controls2.target.copy(target);
            controls2.update()
            // renderer.render(scene, camera);
            composer.render()
            requestAnimationFrame(animate);
            // console.log("Cam: ", camera.position);
            // console.log("Target: ", controls.target)
            
        };
        animate();

        window.addEventListener("resize", () => {
            size.width = window.innerWidth;
            size.height = window.innerHeight;
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
            // renderer.setSize(size.width, size.height);
            composer.setSize( size.width, size.height );
            console.log("[Render calls]: ", renderer.info.render.calls)
            
        });
    }

    // animate( controls: any, renderer: any ) {
    //     controls.update();
    //     renderer.render(scene, camera);
    //     requestAnimationFrame(this.animate());
    // }
}