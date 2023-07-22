import { Scene, Camera, WebGLRenderer } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';

export class DrawPad{

    private scene: Screen;
    private canvas: HTMLElement;
    private renderer: WebGLRenderer;
    private camera: Camera;
    raycaster =  new THREE.Raycaster();
    mouse = new THREE.Vector2();
    contour = [];
    // camera: null as THREE.OrthographicCamera,
    padMesh = null as THREE.Mesh;
    // scene: new THREE.Scene(),
    currShpere = null as THREE.Mesh;
    currLine = null as Line2;
    firstPoint = null as THREE.Vector3;
    lastPoint = null as THREE.Vector3;
    polygoneClodsed = false;
    // renderer: null as THREE.WebGLRenderer,
    size: {width:0, height: 0};
    // labelRenderer: new CSS2DRenderer(),
    // previewElement: null as CSS2DObject,
    // htmlPreview: null as HTMLElement,
    lineMat = null as LineMaterial;

    constructor( canvas: HTMLElement ) {
        
        this.init(canvas)
    }

    init( threeCanvas: HTMLElement ) {
        const labelClassName = 'dimension_label';
        const previewClassName = 'dimension_preview';
        const htmlPreview = document.createElement('div');
        htmlPreview.className = previewClassName;
        htmlPreview.textContent = '0 m';
        // htmlPreview.style.zIndex = '8881';
        const previewElement = new CSS2DObject(htmlPreview);

        // threeCanvas.parentElement.style.zIndex = '2005';
        // threeCanvas.style.zIndex = '2005';

        
        const drawCard = document.getElementById('draw-card');
        
        const scene = new THREE.Scene();
        
        //Object to store the size of the viewport
        
        // let threeCanvas = document.querySelector('#three-canvas');
        // let width = box.offsetWidth;
        // let height = box.offsetHeight;
        // const threeCanvas = document.getElementById("three-canvas");
        console.log(threeCanvas )
        const size = {
          width: threeCanvas.offsetWidth,
          height: threeCanvas.offsetHeight,
        };
        
        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // // make the camera look down
        // // camera.position.set(11, 33, 96);
        // camera.position.set(0, 20, 0);
        // camera.up.set(0, 1, 0);
        // camera.lookAt(0, 0, 0);
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
        // console.log("DRAW PAD: ", threeCanvas)
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
        labelRenderer.domElement.style.top = `${drawCard.getBoundingClientRect().top}`;
        labelRenderer.domElement.style.left = `${drawCard.getBoundingClientRect().left}`;

        // labelRenderer.domElement.style.backgroundColor = '#ffcccc';
        labelRenderer.domElement.style.zIndex = '1999';
        (labelRenderer as any).className = labelClassName;

        document.body.appendChild( labelRenderer.domElement );
        
        // Creates grids and axes in the scene
        const grid = new THREE.GridHelper(200, 200);
        scene.add(grid);
        
        // Creates the orbit controls (to navigate the scene)
        const controls = new OrbitControls(camera, threeCanvas);
        // controls.enableRotate = false;
        controls.target.set(0, 3, 0)
        // controls.target.set(0, 3, 0)

        this.lineMat = new LineMaterial({color: 0xa2588f, linewidth: 0.01})
        
        //* Animation loop
        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            labelRenderer.render( scene, camera );
            requestAnimationFrame(animate);
        };
        animate();
        //* Adjust the viewport to the size of the browser
        window.addEventListener("resize", () => {
            camera.updateProjectionMatrix();
            renderer.setSize(size.width, size.height);
            labelRenderer.setSize( size.width, size.height );
        });

        const geometry = new THREE.BoxGeometry( 200, 0, 200 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 0.2} ); 
        this.padMesh = new THREE.Mesh( geometry, material ); 
        scene.add( this.padMesh );

        let currShpere;
        let currLine;
        let firstPoint;
        let lastPoint;
        let polygoneClodsed = false;
        const contour = [];

        threeCanvas.addEventListener('click', (e)=>{
            this.pick(e, scene, htmlPreview, threeCanvas, camera);
        })
        threeCanvas.addEventListener('mousemove', (e)=>{
            this.onMouseMove( e, scene, htmlPreview, previewElement, threeCanvas, camera, labelRenderer );
        })

    }
    private cast(e: any, threeCanvas: HTMLElement, camera: THREE.OrthographicCamera) {
        const bounds = threeCanvas.getBoundingClientRect();

        const x1 = e.clientX - bounds.left;
        const x2 = bounds.right - bounds.left;
        this.mouse.x = (x1 / x2) * 2 - 1;
    
        const y1 = e.clientY - bounds.top;
        const y2 = bounds.bottom - bounds.top;
        this.mouse.y = -(y1 / y2) * 2 + 1;
    
        this.raycaster.setFromCamera(this.mouse, camera);
        return this.raycaster.intersectObject(this.padMesh)[0];
    }
    private onMouseMove( e: any, scene: THREE.Scene, htmlPreview: HTMLElement, previewElement: CSS2DObject, threeCanvas: HTMLElement, camera: THREE.OrthographicCamera, labelRenderer: any ){
        const found = this.cast(e, threeCanvas, camera);
        // console.log(found)
        labelRenderer.domElement.style.top = e.clientY - 10;
        labelRenderer.domElement.style.left = e.clientX - 10;

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
                    // console.log("Mouse 3: ", this.mouse)
                    // console.log("Mouse: ", e.clientX, e.clientY)

                    previewElement.position.copy(midpoint);
                    // htmlPreview.style.left = `${this.mouse.x}`;
                    // htmlPreview.style.top = `${this.mouse.y}`;

                    // previewElement.position.set( this.mouse.x, this.mouse.y)
                    

                } else {
                    const geometry = new THREE.BufferGeometry().setFromPoints([this.lastPoint, found.point]);
                    const geom = new LineGeometry();
                    geom.setPositions( Array.from(geometry.attributes.position.array) );
                    const line = new Line2(geom, this.lineMat);
                    line.computeLineDistances();
                    this.currLine = line;
                    scene.add(line);
                    // console.log("DRAW PAD - mouse move", this.currLine, this.lineMat)

                }
            }
        }
    }
    private pick(e: any, scene: THREE.Scene, htmlPreview: HTMLElement, threeCanvas: HTMLElement, camera: THREE.OrthographicCamera ){
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
    }


}