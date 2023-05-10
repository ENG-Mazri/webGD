import { Scene, Camera, WebGLRenderer } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Viewer {

    private scene: Screen;
    private canvas: HTMLElement;
    private renderer: WebGLRenderer;
    private camera: Camera;

    constructor( canvas: HTMLElement, data: any ) {
        this.init(canvas, data)
    }

    init(canvas: HTMLElement, data: any) {
        const scene = new THREE.Scene();

        const size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        const fov = 45;
        const aspect = 2; 
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        camera.position.set(40, 15, 45);
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

        // const threeCanvas = document.getElementById("three-canvas") as HTMLElement;
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer:true
        });

        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputEncoding = THREE.sRGBEncoding;
        const grid = new THREE.GridHelper(50, 30);
        // scene.add(grid);

        const controls = new OrbitControls(camera, canvas);

        //* shape
        const inputs = data.inputs;
        const geometry = new THREE.BoxGeometry( inputs.width, inputs.length, inputs.height ); 
        const material = new THREE.MeshPhongMaterial( {color: 0xffb3b3, transparent: true, opacity: 0.7} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        scene.add( cube );

        //* rendering
        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener("resize", () => {
            size.width = window.innerWidth;
            size.height = window.innerHeight;
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
            renderer.setSize(size.width, size.height);
        });
    }

    // animate( controls: any, renderer: any ) {
    //     controls.update();
    //     renderer.render(scene, camera);
    //     requestAnimationFrame(this.animate());
    // }
}