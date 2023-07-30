import { Mesh, Color, MeshLambertMaterial, DoubleSide, Matrix4, BufferGeometry, BufferAttribute } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

class GeometryModel extends Mesh {
    public mesh: Mesh;
    private modelID: string;


    constructor( modelID: string, meshes: Mesh[] ) {
    super(...arguments);
        this.modelID = modelID;
        this.mesh = this;
    }

    private processMeshes(){

    }

    public getModelID(){
        return this.modelID;
    }

}