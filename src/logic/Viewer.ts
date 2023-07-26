import { Scene, Camera, WebGLRenderer, Mesh } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

export class Viewer {

    private scene: Screen;
    private canvas: HTMLElement;
    private renderer: WebGLRenderer;
    private camera: Camera;
    private options: any

    constructor( canvas: HTMLElement, mesh: Mesh, options:any = {} ) {
        this.options = options;
        this.init(canvas, mesh)
    }

    init(canvas: HTMLElement, mesh: Mesh) {
        const scene = new THREE.Scene();

        const size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // console.log(size)
        const fov = 45;
        const aspect = 2; 
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        // camera.position.set(40, 15, 45);
        camera.position.set(-87, 51, -65);
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);

        const lightColor = 0xffffff;

        const ambientLight = new THREE.AmbientLight(lightColor, 0.7);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(lightColor, 0.8);
        directionalLight.position.set(0, 10, 0);
        directionalLight.target.position.set(-5, 0, 0);
        scene.add(directionalLight);
        scene.add(directionalLight.target);

        // // const threeCanvas = document.getElementById("three-canvas") as HTMLElement;
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer:true
        });

        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        const renderTarget = new THREE.WebGLRenderTarget(size.width,
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

        const controls = new OrbitControls(camera, canvas);
        // controls.target.set(0,0,0)
        controls.target.set(30, 2.5, 14.8)


        //* shape
        // const inputs = data.inputs;
        // console.log(inputs)0x9ca884 0xa2588f
        // const geometry = new THREE.BoxGeometry( inputs.width, inputs.length, inputs.height ); 
        // const material = new THREE.MeshPhongMaterial( {color: 0x9ca884, transparent: true, opacity: 0.5} ); 
        // const mesh = new THREE.Mesh( geometry, material ); 
        scene.add( mesh );

        // geometry.computeBoundingSphere()

        // const radius = geometry.boundingSphere.radius;
        // const cog = mesh.localToWorld(geometry.boundingSphere.center.clone());
        // camera.position.set( cog.x, cog.y * 3, cog.z + 1.1*radius/Math.tan(fov*Math.PI/360));
        // camera.position.set(24, 13, 30)

        //* rendering
        const animate = () => {
            controls.update();
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
        });
    }

    // animate( controls: any, renderer: any ) {
    //     controls.update();
    //     renderer.render(scene, camera);
    //     requestAnimationFrame(this.animate());
    // }
}