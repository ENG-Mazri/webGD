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
    private controls: any;
    private controls2: any;
    private composer: any;
    private isActive: boolean = true;
    public glbLoadingProgress: number = 0;

    public kill: boolean = false;

    constructor( canvas?: HTMLElement, meshes?: Mesh[], options:any = {} ) {
        this.options = options;
        // this.init(canvas, meshes)
    }

    async init(canvas: HTMLElement, meshes: Mesh[], blob: any) {
        this.isActive = true;
        this.scene = new Scene();

        for (let i = this.scene.children.length - 1; i >= 0; i--) {
            if(this.scene.children[i].type === "Mesh")
                this.scene.remove(this.scene.children[i]);
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
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        this.camera.position.set(-220, 228, -124);
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(0, 0, 0);


        //* LIGHT SETTINGS
        const lightColor = 0xffffff;

        const ambientLight = new THREE.AmbientLight(lightColor, 0.7);
        this.scene.add(ambientLight);

        const sunlight = new THREE.DirectionalLight();
        sunlight.intensity = 0.3;
        sunlight.position.set(1000, 200, 1000);
        this.scene.add(sunlight);
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
        this.scene.add(light2);


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

        this.composer = new EffectComposer( this.renderer, renderTarget );
        this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.composer.setSize(size.width, size.height);

        const renderPass = new RenderPass( this.scene, this.camera );
        this.composer.addPass( renderPass );

        const saoPass = new SAOPass( this.scene, this.camera, false, true );
        this.composer.addPass( saoPass );
        // const fxaaPass = new ShaderPass( FXAAShader );
        // fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.container.offsetWidth * (Math.min(window.devicePixelRatio, 2)) );
        // fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.container.offsetHeight * (Math.min(window.devicePixelRatio, 2)) );
        // composer.addPass(fxaaPass)
        saoPass.params.output = SAOPass.OUTPUT.Default;
        saoPass.params.saoBias = 0.8
        saoPass.params.saoIntensity = 0.0008
        saoPass.params.saoScale = 0.9 // decrease this to have more shadows but performance will go down
        saoPass.params.saoKernelRadius = 10
        saoPass.params.saoMinResolution = 0

        const gPass = new ShaderPass( GammaCorrectionShader );
        this.composer.addPass(gPass);

        //* CONTROLS SETINGS
        this.controls = new OrbitControls( this.camera, canvas);
        this.controls2 = new TrackballControls( this.camera, canvas);
        // controls.target.set(0,0,0)
        this.controls.target.set(25, 54, 57);
        this.controls.enableZoom = false;
        
        // controls.minDistance = -Infinity;
        // controls.minZoom = -Infinity;

        // console.log('[VIewer: controls] ', controls)
        this.controls.maxDistance = 1500;
        // controls.enablePan = true

        this.controls2.noPan = true;
        this.controls2.noRotate = true;
        this.controls2.noZoom = false;
        this.controls2.zoomSpeed = 1.5;

        //* HELPERS
        // const grid = new THREE.GridHelper(200, 200);
        // grid.position.setY(-1)
        // this.scene.add(grid);

        // const axes = new THREE.AxesHelper(2);
        // // axes.material.depthTest = false;
        // axes.renderOrder = 1;
        // this.scene.add(axes);


        //* GLTF LOADER
        const loader = new GLTFLoader();
        let url = URL.createObjectURL(blob as Blob)
        loader.load(
            url,
            ( gltf ) => {
                // console.log('[Viewer:Blob] ', gltf);
                
                this.scene.add( gltf.scene );

                this.scene.traverse((child: any) =>{
                    // console.log(child)

                    if (child.name == 'site_mesh') {
                        child.receiveShadow = true;
                        child.castShadow = true;
                        // child.material.transparent = true;
                        // child.material.opacity = 0.1;
                        // child.material.color = new THREE.Color(0xa6a6a6)

                        child.material.onBeforeCompile = shader =>{
                            // shader.uniforms.diffuse.value =  new THREE.Vector3(1,1,0);
                            // shader.vertexShader.replace(
                            //     '#include <color_vertex>',
                            //     `
                            //     #include <color_vertex>

                            //     vColor = vec4( 5.0 );
                            //     #elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
                            //         vColor = vec3( 5.0 );
                            //     #endif
                            //     #ifdef USE_COLOR
                            //         vColor *= color;
                            //     #endif
                            //     #ifdef USE_INSTANCING_COLOR
                            //         vColor.xyz *= instanceColor.xyz;
                            //     #endif
                            //     `
                            //     )
                            // console.log('[Shader ]', shader)
                        };

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
                this.glbLoadingProgress = xhr.loaded / xhr.total * 100;
                // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );       
            },
            ( error ) => {
                console.log( 'An error happened', error );
            }
        );

        let self = this;
        
        
        //*RENDERING
        //TODO: try tweaking render pass settings
        // const animate = () => {
        //     const target = controls.target;
        //     controls.update();
        //     controls2.target.copy(target);
        //     controls2.update()
        //     // self.renderer.render(this.scene, camera);
        //     composer.render()
        //     requestAnimationFrame(animate);
        //     // console.log("Cam: ", camera.position);
        //     // console.log("Target: ", controls.target)
            
        // };
        // this.resize(size, this.camera, this.renderer, this.composer);
        this.animate();


        window.addEventListener("resize", this.resize(size, this.camera, this.renderer, this.composer) as  any);

        DestroyViewer.on( ev => {
            if(this.isActive) {
                // console.log('DESROY renderer: ', this.isActive)
                window.removeEventListener("resize", this.resize(size, this.camera, this.renderer, this.composer) as  any)
                this.isActive = false;
            }
        })
    }

    public animate( hasPass: boolean = false ) {
        this.controls.update();
        const target = this.controls.target;

        this.controls2.target.copy(target);
        this.controls2.update()
        // self.renderer.render(this.scene, camera);
        // this.composer.render();
        if ( hasPass ) this.composer.render();
        else this.renderer.render(this.scene, this.camera);

        // console.log("[Render calls]: ", this.renderer.info.render.calls);

        requestAnimationFrame(() => this.animate(hasPass));
    }

    private resize( size: any, camera: any, renderer: any, composer: any ){
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        renderer.setSize(size.width, size.height);
        composer.setSize( size.width, size.height );

        console.log("[Render calls]: ", renderer.info.render.calls)
    }

    public dispose(){
        for (let i = this.scene.children.length - 1; i >= 0; i--) {
            if(this.scene.children[i].type === "Mesh")
                this.scene.remove(this.scene.children[i]);
        }



    }
}