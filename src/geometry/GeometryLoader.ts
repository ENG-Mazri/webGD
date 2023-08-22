import { BufferGeometry, Color, Mesh, ShaderMaterial } from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import vShader from '../assets/shaders/meshVertex.glsl.js';
import fShader from '../assets/shaders/meshFragment.glsl.js';

type Geom = {
    buffer: BufferGeometry | BufferGeometry[] | any[],
    color: any,
    opacity: number
}

export class GeometryLoader{

    private loader: GLTFLoader;

    private siteGeometry = new Map();
    private slabGeometry = new Map();
    private spaceGeometry = new Map();
    private otherGeometry = new Map();



    public meshes = new Map<string, Geom>();

    constructor(){
        this.loader = new GLTFLoader();
        this.meshes.clear();

        this.meshes.set('site_mesh', {} as Geom);
        this.meshes.set('slab_mesh', {} as Geom);
        this.meshes.set('space_mesh', {} as Geom);

        // this.meshes.get('site_mesh').buffer = []
        // this.meshes.get('slab_mesh').buffer = []
        // this.meshes.get('space_mesh').buffer = []
        
        
    }

    public load( blob: any, onFinished: (meshes: any) => void ){
        const SITE_GEOMS  = [];
        const SLAB_GEOMS  = [];
        const SPACE_GEOMS = [];
        const OTHER_GEOMS = [];



        let url = URL.createObjectURL(blob as Blob);

        this.loader.load(
            url,
            ( gltf ) => {
                console.log('[Viewer:Blob] ', gltf);
                
                gltf.scene.traverse((child: any) =>{
                   

                    if (child.name == 'site_mesh') {
                        SITE_GEOMS.push( child.geometry );


                        
                            this.meshes.get('site_mesh')['color'] = child.material.color as Color;
                            this.meshes.get('site_mesh').opacity = child.material.opacity;


                    }
                    else if (child.name == 'slab_mesh' ) {

                        SLAB_GEOMS.push( child.geometry );
                        


                            this.meshes.get('slab_mesh')['color'] = child.material.color as Color;
                            this.meshes.get('slab_mesh').opacity = child.material.opacity;

                    }
                    else if ( child.name == 'space_mesh' ) {

                        SPACE_GEOMS.push( child.geometry );

                            this.meshes.get('space_mesh')['color'] = child.material.color as Color;
                            this.meshes.get('space_mesh').opacity = child.material.opacity;

                    } else {
                        OTHER_GEOMS.push( child.geometry );
                        
                    }
                });



                this.meshes.get('site_mesh').buffer = mergeGeometries(SITE_GEOMS);
                this.meshes.get('slab_mesh').buffer = mergeGeometries(SLAB_GEOMS);
                this.meshes.get('space_mesh').buffer = mergeGeometries(SPACE_GEOMS);
                onFinished(this.meshes);
            },
            ( xhr ) => { 
                // this.glbLoadingProgress = xhr.loaded / xhr.total * 100;
                // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );       
            },
            ( error ) => {
                console.log( 'An error happened', error );
            }
        );
    }

    public getMeshes(){

    }
}