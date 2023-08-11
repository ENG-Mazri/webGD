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
import {GenFinished, BuildViewer, DestroyViewer} from '../events/index';

export class Viewer {

    private scene: Scene;
    private canvas: HTMLElement;
    public renderer: WebGLRenderer;
    private camera: Camera;
    private options: any;
    private isActive: boolean = true;

    public kill: boolean = false;

    constructor( canvas: HTMLElement, meshes: Mesh[], options:any = {} ) {
        this.options = options;
        // this.init(canvas, meshes)
    }

    async init(canvas: HTMLElement, meshes: Mesh[], blob: any) {
        this.isActive = true;
        const scene = new Scene();

        for (let i = scene.children.length - 1; i >= 0; i--) {
            if(scene.children[i].type === "Mesh")
                scene.remove(scene.children[i]);
        }

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
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer:true
          });
        
        // let renderer = this.renderer;

        // (canvas as any).getContext("webgl");

        this.renderer.setSize(size.width, size.height);
        this.renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        const renderTarget = new THREE.WebGLRenderTarget(
                size.width,
                size.height,
                {samples: 3}
            )

        const composer = new EffectComposer( this.renderer, renderTarget );
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
        
        // controls.minDistance = -Infinity;
        // controls.minZoom = -Infinity;

        // console.log('[VIewer: controls] ', controls)
        controls.maxDistance = 1500;
        // controls.enablePan = true

        controls2.noPan = true;
        controls2.noRotate = true;
        controls2.noZoom = false;
        controls2.zoomSpeed = 1.5;

        //* HELPERS
        // const grid = new THREE.GridHelper(200, 200);
        // grid.position.setY(-1)
        // scene.add(grid);

        // const axes = new THREE.AxesHelper(2);
        // // axes.material.depthTest = false;
        // axes.renderOrder = 1;
        // scene.add(axes);


        //* GLTF LOADER
        const loader = new GLTFLoader();
        let url = URL.createObjectURL(blob as Blob)
        loader.load(
            url,
            ( gltf ) => {
                // console.log('[Viewer:Blob] ', gltf);
                scene.add( gltf.scene );
                // console.log('[Viewer:Scene] ', scene);

                scene.traverse((child: any) =>{
                    // console.log(child)

                    if (child.name == 'site_mesh') {
                        child.receiveShadow = true;
                        child.castShadow = true;
                        // child.material.transparent = true;
                        // child.material.opacity = 0.1;
                        // child.material.color = new THREE.Color(0xa6a6a6)

                    }
                    
                    else if (child.name == 'slab_mesh' || child.name == 'space_mesh') {
                        // child.receiveShadow = true;
                        // console.log('[Viewer: mesh] ', child)
                        // child.material.transparent = true;
                        // child.material.opacity = 0.1;
                        // child.material.color = new THREE.Color(0xa6a6a6)

                        child.castShadow = true;
                    }
                    // else if (child.name == 'slab_mesh' || child.name == 'space_mesh') {
                    //     // child.receiveShadow = true;
                    //     // console.log('[Viewer: mesh] ', child)
                    //     child.material.transparent = true;
                    //     child.material.opacity = 0.3;
                    //     child.material.color = new THREE.Color(0xff0000)

                    //     child.castShadow = true;
                    // }
                });
            },
            ( xhr ) => {        
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );       
            },
            ( error ) => {
                console.log( 'An error happened', error );
            }
        );

        let self = this;
        
        
        //*RENDERING
        //TODO: try tweaking render pass settings
        const animate = () => {
            const target = controls.target;
            controls.update();
            controls2.target.copy(target);
            controls2.update()
            self.renderer.render(scene, camera);
            // composer.render()
            requestAnimationFrame(animate);
            // console.log("Cam: ", camera.position);
            // console.log("Target: ", controls.target)
            
        };
        animate();


        window.addEventListener("resize", this.resize(size, camera, this.renderer) as  any);

        DestroyViewer.on( ev => {
            if(this.isActive) {
                console.log('DESROY renderer: ', this.isActive)
                window.removeEventListener("resize", this.resize(size, camera, this.renderer) as  any)
                this.isActive = false;
            }
        })
    }

    // animate( controls: any, renderer: any ) {
    //     controls.update();
    //     renderer.render(scene, camera);
    //     requestAnimationFrame(this.animate());
    // }

    private resize( size:any, camera: any, renderer: any ){
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        renderer.setSize(size.width, size.height);
        // composer.setSize( size.width, size.height );

        console.log("[Render calls]: ", renderer.info.render.calls)
    }
}