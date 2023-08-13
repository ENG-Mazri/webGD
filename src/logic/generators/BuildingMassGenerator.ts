import { Model } from "../Model";
import { Generator } from "./Generator";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {Mesh,
        Box3,
        BoxGeometry,
        SphereGeometry,
        MeshBasicMaterial,
        DoubleSide,
        MeshPhongMaterial,
        Vector2,
        BufferAttribute,
        Matrix4,
        Vector3,
        BufferGeometry,
        Line,
        Line3,
        LineBasicMaterial,
        Shape,
        ExtrudeGeometry } from 'three';
import {ShapeUtils} from 'three/src/extras/ShapeUtils.js';

// @ts-ignore
import fontJSON from "three/examples/fonts/droid/droid_sans_bold.typeface.json"
// @ts-ignore
// import MGWorker from './MassGeneratorWorker?worker&inline';
import { v4 as uuidv4 } from 'uuid';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/*// TODO: Mass Generation logic
    - generate floor slabs as box
    - generate floor rooms as another box
    - check the possibility of polygon box profile https://threejs.org/docs/index.html#api/en/geometries/ExtrudeGeometry
    - use worker for computations
    - graphics: white gray shades + ambient occlusion 
    - Generation technics:
        - scale down 
        - rotate 
        - offset

*/

const constants = {
    SLAB_THICKNESS: 0.2,
    SLAB_COLOR: 0xffffff, //a6a6a6,//f2f2f2, //f2f2f2 , //a6a6a6,//737373,
    SPACE_COLOR: 0xb3e6ff,
}

export class BuildingMassGenerator extends Generator {

  extrudeSettings = {
      steps: 1,
      depth: constants.SLAB_THICKNESS,
      bevelEnabled: false,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 0
  };

  private SLAB_GEOMETRIES  = [];
  private SPACE_GEOMETRIES = [];
  private LINE_GEOMETRIES  = [];
  private TEXT_GEOMETRIES  = [];
  private SITE_GEOMETRIES  = [];

  private LINE_MESHES  = [];
  private TEXT_MESHES  = [];
  private generatorName = 'Building mass';
  public objectives = [
    'exteriorArea',
    'podiumVolume',
    'towerVolume',
    'totalBuildingArea',
    'facadeArea'
  ]

  constructor(){
      super()
      // console.log("[MG]",MGWorker)
      // const worker = new Worker('./MassGeneratorWorker.ts');
      // this.generateVariant(inputs)

  }

  private init(){
      // const worker = new MGWorker()
      // console.log("[BLD mass generator]")
      
      // const worker = new Worker('./MassGeneratorWorker.ts');
      // worker.postMessage({name: 'botty', type: 'bot-24'})
  }

  private getInputs(inputs: any){
    const contour = inputs.contour.map((v: any)=> new Vector2(v.x, v.y) );

    const site_offset = inputs.site_offset.type == 'constant' ? inputs.site_offset.value : this.randomIntFromInterval(inputs.site_offset.value[0], inputs.site_offset.value[1]);
    const total_floors = inputs.total_floors.type == 'constant' ? inputs.total_floors.value : this.randomIntFromInterval(inputs.total_floors.value[0], inputs.total_floors.value[1]);
    const tower_floor_height = inputs.tower_floor_height.type == 'constant' ? inputs.tower_floor_height.value : this.randomIntFromInterval(inputs.tower_floor_height.value[0], inputs.tower_floor_height.value[1]);
    const podium_floor_height = inputs.podium_floor_height.type == 'constant' ? inputs.podium_floor_height.value : this.randomIntFromInterval(inputs.podium_floor_height.value[0], inputs.podium_floor_height.value[1]);

    return {site_offset, contour, total_floors, tower_floor_height, podium_floor_height};
  }

  public generateVariant(inputs: any, transX: number = 0, transY: number = 0, index: number, genNum: number = 1){

    
    let INPUTS: any;
    const SLAB_GEOMETRIES  = [];
    const SPACE_GEOMETRIES = [];

    const isNextGen = genNum > 1 ? true : false;


      // const {site_offset, contour, total_floors, tower_floor_height, podium_floor_height} = this.getInputs(inputs);
    INPUTS = this.getInputs(inputs);

    const spaceExtrudeSettings = {
        steps: 1,
        depth: INPUTS.tower_floor_height - constants.SLAB_THICKNESS,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0
    };

    const inputsObj = {
      site_offset: INPUTS.site_offset,
      total_floors: INPUTS.total_floors,
      tower_floor_height: INPUTS.tower_floor_height, 
      podium_floor_height: INPUTS.podium_floor_height,
      contour: INPUTS.contour
    }

    const offsetedContour = this.offsetContour( INPUTS.site_offset, INPUTS.contour );
    const CONTOUR = this.getTranslatedContour(offsetedContour, transX, transY);
    const CONTOUR_ = this.getTranslatedContour(INPUTS.contour, transX, transY); // non offseted contour
    
    const TOTAL_FLOORS_NUMBER = INPUTS.total_floors;
  
    // const PODIUM_FLOORS_NUMBER = isNextGen ? INPUTS.podium_floors_number : this.randomIntFromInterval(1, 4);
    const PODIUM_FLOORS_NUMBER = this.randomIntFromInterval(1, 4);
    const TOWER_FLOORS_NUMBER = TOTAL_FLOORS_NUMBER - PODIUM_FLOORS_NUMBER;

    const mat = new LineBasicMaterial( {color: 0x00b386, linewidth: 2} );
    const contourLines = []; // add this to scene
    const contourLines3 = [];
    let towerContour: Vector2[] = [];

    //* OTHER METRICS
    let towerType: string;
    let podiumBaseWidth: number;
    let podiumBaseLength: number;
    // let towerRotation: number;

    let space_shapes = [];


    for( let i=0; i < CONTOUR.length - 1; i++ ){
      let current = CONTOUR[i];
      let incremented = CONTOUR[i+1];
      const geometry = new BufferGeometry().setFromPoints([current,incremented]);
      const line = new Line(geometry, mat);
      line.rotation.set(Math.PI/2,0, 0);
      line.updateMatrix()
      
      let l3 = new Line3( new Vector3(current.x, 0, current.y),
                          new Vector3(incremented.x, 0, incremented.y));
      contourLines.push(line)
      this.LINE_MESHES.push(line)
      contourLines3.push(l3)
    }
      
      // TODO: SITE BASE
    const origin = new Vector3(0,0,0);
    
    //* Get bbox of contour
    const shape = this.formBaseShape(CONTOUR); // ==> use CONTOUR_ to get offseted shape
    const geom = new ExtrudeGeometry( shape, this.extrudeSettings ); // try using buffergeometry instead
    const shape_mat = new MeshPhongMaterial( { color: 0x00cc99, opacity: 0.4, transparent: true } );
    let site_mesh = new Mesh( geom, shape_mat );
    site_mesh.rotation.set(Math.PI/2,0, 0);
    
    let matrix = site_mesh.matrix.clone()
    const pos = new Vector3().setFromMatrixPosition(matrix)
    matrix.setPosition(pos.x - origin.x, pos.y - origin.y, pos.z - origin.z)
    
    site_mesh.applyMatrix4(matrix);
    site_mesh.updateMatrix();
    site_mesh.updateMatrixWorld();
    site_mesh.receiveShadow = true;
    let g_site: BufferGeometry = geom.clone();
    g_site.rotateX(Math.PI/2)
    g_site.applyMatrix4(matrix)

    //TODO: add varNum attributes to bufferGeometry
    let varNumSize = g_site.getAttribute('position').count;
    g_site.setAttribute( 'varNum', new BufferAttribute(new Float32Array( varNumSize ).fill(index), 1))
    
    // console.log('[Generator: Site] ', g_site);
    this.SITE_GEOMETRIES.push(g_site)

    let bbox = new Box3().setFromObject(site_mesh)

    site_mesh.geometry.computeBoundingBox();
    // scene.add(site_mesh); -----------------> add site_mesh
    // meshes.push(site_mesh)
    
    
    //* COMPUTED INPUTS
    const PODIUM_BASE_WIDTH = bbox.min.distanceTo(bbox.max) / 1.7; // TRY PLAYING WITH 1.7 VALUE
    const PODIUM_BASE_LENGTH = PODIUM_BASE_WIDTH / 2; // HEIGHT PARAMETER IN THE BOX METHOD
    // const PODIUM_WIDTH = isNextGen ? INPUTS.podium_width : this.randomFloatFromInterval( PODIUM_BASE_WIDTH / 2, PODIUM_BASE_WIDTH);
    // const PODIUM_LENGTH = isNextGen ? INPUTS.podium_length : this.randomFloatFromInterval( PODIUM_BASE_LENGTH / 2, PODIUM_BASE_LENGTH);
    const PODIUM_WIDTH = this.randomFloatFromInterval( PODIUM_BASE_WIDTH / 2, PODIUM_BASE_WIDTH);
    const PODIUM_LENGTH = this.randomFloatFromInterval( PODIUM_BASE_LENGTH / 2, PODIUM_BASE_LENGTH);
    const axesLines = this.drawAxes(bbox, false);

    const podiumBaseGeom = new BoxGeometry( PODIUM_BASE_WIDTH, PODIUM_BASE_LENGTH, 0.5 ); 
    const podiumBaseMat = new MeshBasicMaterial( {color: 0xff0000, side: DoubleSide, transparent: true, opacity:0.5} );
    const podiumBase = new Mesh( podiumBaseGeom, podiumBaseMat );
    // podiumBase.translateZ(5)
    podiumBase.updateMatrix()
    let times = 0;
    let intersections = [];
    let rotation = 0; //TODO: metric - maybe as a matrix 
    podiumBase.geometry.computeBoundingBox();
    podiumBase.updateMatrixWorld();

    // meshes.push(podiumBase)
    
    while(intersections.includes(true) || intersections.length == 0) {
    
      let n = Math.random();
      let axis = this.randomIntFromInterval(0, axesLines.length-1)
      let pointAtParam = this.getPointAtParameter(axesLines[axis], n, false);
    
      podiumBase.rotation.set(Math.PI/2, 0, rotation);
      podiumBase.position.copy(pointAtParam)
      podiumBase.updateMatrix()
    
      for ( let j = 0; j < contourLines.length; j++)
        intersections.push(this.checkTwoShapeIntersect(podiumBase, contourLines[j]));
    
    //   console.log('[Intersections]: ', intersections)
    
      if(intersections.includes(true)) {
        intersections = []
        rotation = Math.PI / (Math.random() * 4)
        times++;
        if(times == 1000) break;
      } 
    }

    console.log(`Var_${index} - Found base position and orientation after: ${times} times`)

    let topPodium = 0; // the highest point on the podium

    const pod = this.generatePodium(PODIUM_WIDTH, PODIUM_LENGTH , this.extrudeSettings.depth, podiumBase.matrix , PODIUM_FLOORS_NUMBER, INPUTS.podium_floor_height)
    // console.log(`Top podium is at: ${topPodium}`)
    // console.log('Podium: ', pod)
    
    const contourF = this.offsetContour( 2, pod.top_contour);
    const contourS = this.offsetContour( 2.3, pod.top_contour);
    
    const topPodShapeF = this.formBaseShape(contourF);
    const topPodShapeS = this.formBaseShape(contourS);

    if( isNextGen ){
      if (INPUTS.towerType == "Type_A"){
        this.createTypeA(topPodShapeF,topPodShapeS, spaceExtrudeSettings, pod.height, INPUTS.tower_floor_height, TOWER_FLOORS_NUMBER, podiumBase.matrix, space_shapes);
        towerType = 'Type_A';
      }


      else if (INPUTS.towerType == "Type_B"){
        this.createTypeB(INPUTS.tower_floor_height, pod, spaceExtrudeSettings, podiumBase, space_shapes);
        towerType = 'Type_B';
      }

    } else {

      let rndBool = Math.random() < 0.6;
      if(rndBool){
        this.createTypeB(INPUTS.tower_floor_height, pod, spaceExtrudeSettings, podiumBase, space_shapes)
        towerType = 'Type_B';
      } else {
        this.createTypeA(topPodShapeF,topPodShapeS, spaceExtrudeSettings, pod.height, INPUTS.tower_floor_height, TOWER_FLOORS_NUMBER, podiumBase.matrix, space_shapes);
        towerType = 'Type_A';
      }
    }

    

    //TODO: create a text entity for each generator
    // console.log('[Generator: variant]', index)

    const totalGeometry  = mergeGeometries( [...this.SLAB_GEOMETRIES, ...this.SPACE_GEOMETRIES] );

    const results = this.evaluate( CONTOUR, pod, totalGeometry, space_shapes as any, INPUTS.tower_floor_height, spaceExtrudeSettings.depth, PODIUM_FLOORS_NUMBER);
    
    const text = [  `Variant number: ${index}`,
                    `Exterior area: ${results.exteriorArea} m2`,
                    `Podium volume: ${results.podiumVolume} m3`,
                    `Tower volume: ${results.towerVolume} m3`,
                    `Total building area: ${results.totalBuildingArea} m2`,
                    `Total facade area: ${results.facadeArea} m2`
                  ];

    this.TEXT_MESHES.push( ...this.createText( text, CONTOUR[0].x - 5 , CONTOUR[0].y ) );
  
    const varData = {
      generation: genNum,
      id: uuidv4(),
      varNum: index, 
      strategy: 'Radomize',
      generator: this.generatorName,
      inputs: inputsObj,
      otherMetrics: {
        towerType,
        rotation,
        podium_width: PODIUM_WIDTH, 
        podium_length: PODIUM_LENGTH
      },
      outputs: results
    }


    return varData;
  }

  private createText( text: string[], offsetX = 1, offsetY = 1 ): Mesh[]{
    const loader = new FontLoader();
    const parsedFont = loader.parse(fontJSON)
    
    const txtMaterial = new MeshPhongMaterial( { color: 0x404040 } );

    const text_meshes = [];
    let pos = 0;

    for ( let i=0; i < text.length; i++){
      let text_geom = new TextGeometry( text[i], {
        font: parsedFont,
        size: 1.5,
        height: 0.01,
      });
    
      let txtMesh = new Mesh( text_geom, txtMaterial ) ;
    
      txtMesh.rotation.set(-Math.PI/2, 0, -Math.PI/2);
      // console.log('[Offset x]:', offsetX)
      txtMesh.translateY(offsetX - pos)
      txtMesh.translateX(offsetY)
  
      txtMesh.updateMatrix();
      text_meshes.push( txtMesh );
      pos += 2.5;
    }

    return text_meshes;
  }

  private offsetContour = ( offset: any, contour: Vector2[] ) => {
      let result = [];
    
      offset = new BufferAttribute(new Float32Array([offset, 0, 0]), 3);
    
      for (let i = 0; i < contour.length - 1; i++) {
        let v1 = new Vector2().subVectors(contour[i - 1 < 0 ? contour.length - 1 : i - 1], contour[i]);
        let v2 = new Vector2().subVectors(contour[i + 1 == contour.length ? 0 : i + 1], contour[i]);
        let angle = v2.angle() - v1.angle();
        let halfAngle = angle * 0.5;
    
        let hA = halfAngle;
        let tA = v2.angle() + Math.PI * 0.5;
    
        let shift = Math.tan(hA - Math.PI * 0.5);
        let shiftMatrix = new Matrix4().set(
                1, 0, 0, 0, 
          -shift, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
        );
    
    
        let tempAngle = tA;
        let rotationMatrix = new Matrix4().set(
          Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
          Math.sin(tempAngle),  Math.cos(tempAngle), 0, 0,
                            0,                    0, 1, 0,
                            0,                    0, 0, 1
        );
    
        let translationMatrix = new Matrix4().set(
          1, 0, 0, contour[i].x,
          0, 1, 0, contour[i].y,
          0, 0, 1, 0,
          0, 0, 0, 1,
        );
    
        let cloneOffset = offset.clone();
        cloneOffset.needsUpdate = true
        cloneOffset.applyMatrix4(shiftMatrix)
        cloneOffset.applyMatrix4(rotationMatrix)
        cloneOffset.applyMatrix4(translationMatrix)
    
    
        result.push(new Vector2(cloneOffset.getX(0), cloneOffset.getY(0)));
      }
    
      //added recently
      result.push(result[0])
      return result;
  }

  private formBaseShape( points: Vector2[] ){
      const shape = new Shape();
      shape.moveTo( points[0].x, points[0].y );
    
      for ( let i = 1; i < points.length; i++)
        shape.lineTo( points[i].x, points[i].y );
      
      // shape.lineTo( points[0].x, points[0].y );
    
      return shape;
  }
    
  private nDivider( number: number, parts: number, min: number ){
    
      let randombit = number - min * parts;
      let out = [];
      
      for (let i=0; i < parts; i++) {
        out.push( Math.random() );
      }
      
      let mult = randombit / out.reduce( (a,b)=> {return a+b;});
      
      return out.map( (el) => { return Math.round(el * mult + min); });
  }
    
  private randomIntFromInterval(min: number, max: number){ 
      return Math.floor(Math.random() * (max - min + 1) + min)
  }
    
  private randomFloatFromInterval(min: number, max: number){ 
      return Math.random() * (max - min + 1) + min
  }

  private getPointAtParameter( line: any, param: any, visualize: boolean = true){
      // const p    = new THREE.Vector3((p1.x+p2.x)*param,(p1.y+p2.y)*param,(p1.z+p2.z)*param) 
      const p = new Vector3();
      line.at(param, p);
      // console.log("This is P: ", p)
      // const midGeom = new SphereGeometry( 0.2, 32, 16 ); 
      // const midMat  = new MeshBasicMaterial( { color: 0x0000ff } ); 
      // let midMesh   = new Mesh( midGeom, midMat );
      // midMesh.position.copy(p);
      // if (visualize) scene.add(midMesh);
    
      return p;
  }

  private getTranslatedContour( contour: Vector2[], transX: number = 0, transY: number = 0){
      const transContour = [];
      for( let i = 0; i < contour.length; i++ ){
        let vec = contour[i].clone()
                            .add( new Vector2(transX, transY));
        // vec.x += transX;
        // vec.y += transY;
        transContour.push(vec);
      }
      return transContour;
  }
  
  private getPerimeter(contour: Vector2[]){
      let perimeter = 0;
      for( let i = 0; i < contour.length - 1; i++ )
          perimeter += Math.round(contour[i].distanceTo(contour[i+1]));
      
      return perimeter;
  }
  
  private getRecSurface(contour: Vector2[]){
      return contour[0].distanceTo(contour[1]) * contour[1].distanceTo(contour[2]);
  }
  
  private getRecVolume(area: number, floorHeight: number){
      return area * floorHeight;
  }

  private drawAxes(bbox: Box3, visualize= true) {
      const matAxis = new LineBasicMaterial( {color: 0xff9900, linewidth: 2} );
      const midGeom = new SphereGeometry( 0.2, 32, 16 ); 
    
    
      //* opp pints to bbox max min 
      const p1 = new Vector3(bbox.min.x, bbox.min.y, bbox.max.z);
      const p2 = new Vector3(bbox.max.x, bbox.min.y, bbox.min.z);
    
      let p1Mesh = new Mesh( midGeom, matAxis );
      let p2Mesh = new Mesh( midGeom, matAxis );
    
      p1Mesh.position.copy(p1);
      p2Mesh.position.copy(p2);
    
      // if (visualize) scene.add(p1Mesh);
      // if (visualize) scene.add(p2Mesh);
    
      //* axis min max bbox
      const l1_geom = new BufferGeometry().setFromPoints([bbox.min, bbox.max]);
      const l1 = new Line(l1_geom, matAxis);
      const l1_ = new Line3(bbox.min, bbox.max);
      // const l1 = new Line(l1_, matAxis);
      // if (visualize) scene.add(l1)
    
      //* axis opp min max
      const l2_geom = new BufferGeometry().setFromPoints([p1, p2]);
      const l2 = new Line(l2_geom, matAxis);
      const l2_ = new Line3(p1, p2);
    
      // if (visualize) scene.add(l2)
    
      //* straight axis 1
      const midMinZ = bbox.min.clone().add(p1).divideScalar(2);
      const midMaxZ = bbox.max.clone().add(p2).divideScalar(2);
      const midMinZ_Mesh = new Mesh( midGeom, matAxis );
      const midMaxZ_Mesh = new Mesh( midGeom, matAxis );
      midMinZ_Mesh.position.copy(midMinZ);
      midMaxZ_Mesh.position.copy(midMaxZ);
      // if (visualize) scene.add(midMinZ_Mesh)
      // if (visualize) scene.add(midMaxZ_Mesh)
    
      //* straight axis 2
      const _midMinZ = bbox.min.clone().add(p2).divideScalar(2);
      const _midMaxZ = bbox.max.clone().add(p1).divideScalar(2);
      const _midMinZ_Mesh = new Mesh( midGeom, matAxis );
      const _midMaxZ_Mesh = new Mesh( midGeom, matAxis );
      _midMinZ_Mesh.position.copy(_midMinZ);
      _midMaxZ_Mesh.position.copy(_midMaxZ);
      // if (visualize) scene.add(_midMinZ_Mesh)
      // if (visualize) scene.add(_midMaxZ_Mesh)
    
      //* axis min max bbox
      const _l1_geom = new BufferGeometry().setFromPoints([midMinZ, midMaxZ]);
      const _l1 = new Line(_l1_geom, matAxis);
      const _l1_ = new Line3(midMinZ, midMaxZ);
      // if (visualize) scene.add(_l1)
    
      //* axis opp min max
      const _l2_geom = new BufferGeometry().setFromPoints([_midMinZ, _midMaxZ]);
      const _l2 = new Line(_l2_geom, matAxis);
      const _l2_ = new Line3(_midMinZ, _midMaxZ);
      // if (visualize) scene.add(_l2)
    
      return [l1_, l2_, _l1_, _l2_]
  }
  
  private checkTwoShapeIntersect(object1: any,object2: any){
      //TODO: check vetices whether they're inside site shape or not
      /**
       * This function check if two object3d intersect or not
       * @param {THREE.Object3D} object1
       * @param {THREE.Object3D} object2
       * @returns {Boolean} 
      */ 
    
      // Check for intersection using bounding box intersection test
      let bBox1 = new Box3().setFromObject(object1);
      let bBox2 = new Box3().setFromObject(object2);
    
      const intersection = bBox1.intersectsBox(bBox2);
      // const intersection = mesh1.geometry.boundingBox.intersectsBox(mesh2.geometry.boundingBox);
    
      if (intersection) { // The shape geometries intersect.
          return true
      } else { // The shape geometries do not intersect.
          return false
      }
  }

  private generatePodium(width: number, height: number, depth: number, matrix: Matrix4, nFloor: number, floorHeight: number){
      const geomF = new BoxGeometry( width, height, depth ); 
      const matF = new MeshPhongMaterial( {color: constants.SLAB_COLOR, side: DoubleSide} );
      
      const geomS = new BoxGeometry( width, height, floorHeight ); 
      const matS = new MeshPhongMaterial( {color: constants.SPACE_COLOR, side: DoubleSide, transparent: true, opacity: 0.8} );
      let hF = depth;
      let hS = (floorHeight + hF)/2 + hF;
    
      const floorMeshes = []
      const spaceMeshes = []
      const roofV = []
      const setX = new Set();
      const setY = new Set();
    
      for( let i=0; i < nFloor; i++ ){
        //* Podium floors
        let podium_slab = new Mesh( geomF, matF );
        podium_slab.applyMatrix4(matrix)
        podium_slab.translateZ(-hF)
        podium_slab.updateMatrixWorld()
    
        let sg = podium_slab.geometry.clone().toNonIndexed()
        sg.translate(0,0,-hF)
        sg.applyMatrix4(matrix);
    
        this.SLAB_GEOMETRIES.push( sg ); //TODO: merge then addd to scene
        // MESHES.push(podium_slab);
        // scene.add(podium_slab); 
        hF += depth + floorHeight
    
        //* Podium spaces
        let podium_space = new Mesh( geomS, matS );
        podium_space.applyMatrix4(matrix)
        podium_space.translateZ(-hS)
        podium_space.updateMatrixWorld()
        
        let spg = podium_space.geometry.clone().toNonIndexed()
        spg.translate(0,0,-hS)
        spg.applyMatrix4(matrix);
    
        this.SPACE_GEOMETRIES.push(spg); //TODO: merge then addd to scene
        // MESHES.push(podium_space);
        // scene.add(podium_space); 
        hS += depth + floorHeight
    
        //* Add podium roof
        if( i == nFloor - 1 ){
          let roof = new Mesh( geomF, matF );
          roof.applyMatrix4(matrix)
          roof.translateZ(-hF)
          roof.updateMatrixWorld()
          roof.updateMatrix()
          hF += depth/2
    
          // roof.geometry.computeBoundingBox()
          // let box = new Box3().setFromObject( roof );
          // let bBox = visualizeBBox(box, true)
          for ( let y=0; y<roof.geometry.index.count; y++ ){
            let v3 = new Vector3().fromBufferAttribute(roof.geometry.attributes.position, y);
            roofV.push(v3)
          }
          const m = roofV.map( v=>{
            if (v.x) setX.add(v.x)
            if (v.y) setY.add(v.y)
    
          })
          let rs = roof.geometry.clone().toNonIndexed()
          rs.translate(0,0,-hF)
          rs.applyMatrix4(matrix);
          this.SLAB_GEOMETRIES.push( rs );
          // MESHES.push(roof);
          // scene.add(roof); //TODO: merge then add to scene
        }
      }
      
      //* Roof points
      const topP = []
      const shapeP = []
      const x = Array.from(setX)
      const y = Array.from(setY)
    
      for( let a=0; a < x.length; a++ ){
        for( let b=0; b < y.length; b++ ){
          topP.push(new Vector3(x[a] as number, y[b] as number, -hF ))
          shapeP.push(new Vector2(x[a] as number, y[b] as number))
        }
      }
    
      const sortedCountour = [shapeP[2], shapeP[3], shapeP[1], shapeP[0], shapeP[2]];
    
      return {height: hF, top_positions: topP, top_contour: sortedCountour}
    
  }
  
  private generateTowerSlabs(shape: Shape, stHeight: number, floorHeight: number, nFloor: number, matrix: Matrix4){
      const geometry = new ExtrudeGeometry( shape, this.extrudeSettings );
      const material = new MeshPhongMaterial( { color: constants.SLAB_COLOR } );
      // geometry.scale( scale.x, scale.y, scale.z);
      let dist = stHeight + floorHeight;
      for( let i = 0; i < nFloor; i++){
        let slab_mesh = new Mesh( geometry, material ) ;
        slab_mesh.translateZ(-dist)
        slab_mesh.applyMatrix4(matrix)
        let g = geometry.clone()
        g.translate(0,0,-dist)
        g.applyMatrix4(matrix);
        this.SLAB_GEOMETRIES.push( g ); //TODO: merge then addd to scene
        // MESHES.push(slab_mesh);
        // scene.add(slab_mesh)
        dist += floorHeight
      }
  }
  
  private generateTowerSpaces(shape: Shape, extrudeSettings: any,  stHeight: number, floorHeight: number, nFloor: number, matrix: Matrix4, spaces_contour: any[]){
      const geometry = new ExtrudeGeometry( shape, extrudeSettings );
      const material = new MeshPhongMaterial( { color: constants.SPACE_COLOR, side: DoubleSide, transparent: true, opacity: 0.8} );
      // geometry.scale( scale.x, scale.y, scale.z);
      // const shape_contour = [];
      // shape.curves.forEach( curve => {
      //   shape_contour.push(curve.v1)
      //   shape_contour.push(curve.v2)
      // });
      spaces_contour.push({contour: shape.extractPoints(1).shape, num_floors: nFloor})
      
      let dist = stHeight + extrudeSettings.depth;
      for( let i = 0; i < nFloor; i++){ //nFloor
        let space_mesh = new Mesh( geometry, material ) ;
        space_mesh.translateZ(-dist)
        space_mesh.applyMatrix4(matrix)
        space_mesh.updateMatrix()
        let g = geometry.clone()
        g.translate(0,0,-dist)
        g.applyMatrix4(matrix);
        this.SPACE_GEOMETRIES.push(g); //TODO: merge then addd to scene
        // MESHES.push(space_mesh);
        // scene.add(space_mesh)
        dist += floorHeight + extrudeSettings.depth
      }
  }

  private getShapesforTypeB(_contour: any[], paramA: number, paramB: number){
      const geom = new SphereGeometry( 0.5, 32, 16 ); 
      const mat = new MeshBasicMaterial( { color: 0xff0000 } ); 
  
      const _a = new Line3(_contour[0],_contour[1]);
      const _b = new Line3(_contour[1],_contour[2]);
      const _c = new Line3(_contour[1],_contour[2]);
      const _d = new Line3(_contour[1],_contour[2]);
    
      const pt_a = new Vector3()
      const pt_b = new Vector3()
      const pt_c = new Vector3()
      const pt_d = new Vector3()
    
      _a.at(0.5, pt_a)
      _b.at(paramA, pt_b) // this is the one that controls the 
      _c.at(0.5, pt_c)
      _d.at(1-paramB, pt_d)
    
      const pt_ab = new Vector2(pt_b.x, pt_a.y)
      const pt_b0 = new Vector2(pt_b.x,_contour[0].y)
    
    
      const first_half = [_contour[0], pt_a, pt_ab, pt_b0, _contour[0]]
      const _shape = this.formBaseShape(first_half);
    
      const pt_x = new Vector2(pt_d.x, pt_a.y)
    
      const pt_y = new Vector2(_contour[2].x,pt_x.y)
      const second_half = [_contour[2], pt_d, pt_x, pt_y, _contour[2]]
      const _shape2 = this.formBaseShape(second_half);
  
      const combined = [_contour[0], pt_a, pt_b0, pt_ab, pt_y, _contour[2], pt_d, pt_x, _contour[0]]
      
  
      return [_shape, _shape2]
  }

  private createTypeA(topPodShapeF: Shape, topPodShapeS: Shape, spaceExtrudeSettings: any, podHeight: number, floorHeight: number, TOWER_FLOORS_NUMBER: number, matrix: Matrix4, space_shapes: any[]){
      this.generateTowerSlabs( topPodShapeF, podHeight, floorHeight, TOWER_FLOORS_NUMBER, matrix)
      this.generateTowerSpaces(topPodShapeS, spaceExtrudeSettings, podHeight, this.extrudeSettings.depth, TOWER_FLOORS_NUMBER, matrix, space_shapes)
  }

  private createTypeB(TOWER_FLOOR_HEIGHT: number, podium: any, spaceExtrudeSettings: any, podiumBase: Mesh, space_shapes: any[]){

    //TODO: Generate mass - Tower type B
    const _contourF = this.offsetContour( 2, podium.top_contour);
    const _contourS = this.offsetContour( 2.3, podium.top_contour);
  
    const _shapeF = this.getShapesforTypeB(_contourF, 0.6, 0.9)
    const _shapeS = this.getShapesforTypeB(_contourS, 0.6, 0.9)
  
    const towerFloorsRnd1 = this.randomIntFromInterval(8, 16);
    const towerFloorsRnd2 = this.randomIntFromInterval(8, 16);
  
    this.generateTowerSlabs( _shapeF[0], podium.height, TOWER_FLOOR_HEIGHT,         towerFloorsRnd1, podiumBase.matrix);
    this.generateTowerSpaces( _shapeS[0], spaceExtrudeSettings, podium.height, this.extrudeSettings.depth, towerFloorsRnd1, podiumBase.matrix, space_shapes);
    this.generateTowerSlabs( _shapeF[1], podium.height, TOWER_FLOOR_HEIGHT,         towerFloorsRnd2, podiumBase.matrix);
    this.generateTowerSpaces( _shapeS[1], spaceExtrudeSettings, podium.height, this.extrudeSettings.depth, towerFloorsRnd2, podiumBase.matrix, space_shapes);
  
  }

  private getBufferGeometryVolume(geometry: BufferGeometry) {
    if (!geometry.isBufferGeometry) {
      console.log("'geometry' must be an indexed or non-indexed buffer geometry");
      return 0;
    }
    let isIndexed = geometry.index !== null;
    let position = geometry.attributes.position;
    let sum = 0;
    let p1 = new Vector3(),
        p2 = new Vector3(),
        p3 = new Vector3();
    if (!isIndexed) {
      let faces = position.count / 3;
      for (let i = 0; i < faces; i++) {
        p1.fromBufferAttribute(position, i * 3 + 0);
        p2.fromBufferAttribute(position, i * 3 + 1);
        p3.fromBufferAttribute(position, i * 3 + 2);
        sum += this.signedVolumeOfTriangle(p1, p2, p3);
      }
    }
    else {
      let index = geometry.index;
      let faces = index.count / 3;
      for (let i = 0; i < faces; i++){
        p1.fromBufferAttribute(position, index.array[i * 3 + 0]);
        p2.fromBufferAttribute(position, index.array[i * 3 + 1]);
        p3.fromBufferAttribute(position, index.array[i * 3 + 2]);
        sum += this.signedVolumeOfTriangle(p1, p2, p3);
      }
    }
    return sum;
  }

  private signedVolumeOfTriangle(p1: any, p2: any, p3: any) {
    return p1.dot(p2.cross(p3)) / 6.0;
  }

  public getModelMesh(){
    const MERGED_SLAB_GEOMETRIES  = mergeGeometries( this.SLAB_GEOMETRIES );
    const MERGED_SPACE_GEOMETRIES = mergeGeometries( this.SPACE_GEOMETRIES );
    const MERGED_SITE_GEOMETRIES = mergeGeometries( this.SITE_GEOMETRIES );


    const SLAB_MATERIAL = new MeshBasicMaterial( { color: constants.SLAB_COLOR } );
    const SPACE_MATERIAL = new MeshPhongMaterial( { color: constants.SPACE_COLOR } );
    const SITE_MATERIAL = new MeshPhongMaterial( { color: 0x00cc99, opacity: 0.2, transparent: true } );


    const SLAB_MESH = new Mesh( MERGED_SLAB_GEOMETRIES, SLAB_MATERIAL );
    const SPACE_MESH = new Mesh( MERGED_SPACE_GEOMETRIES, SPACE_MATERIAL );
    const SITE_MESH = new Mesh( MERGED_SITE_GEOMETRIES, SITE_MATERIAL );
  
    SLAB_MESH.name = 'slab_mesh';
    SPACE_MESH.name = 'space_mesh';
    SITE_MESH.name = 'site_mesh';
    
    SLAB_MESH.castShadow = true ;
    SPACE_MESH.castShadow = true ;
    SITE_MESH.receiveShadow = true ;

    const main = new Mesh();
    main.children = [SLAB_MESH, SPACE_MESH, SITE_MESH, ...this.LINE_MESHES, ...this.TEXT_MESHES];

    console.log('[Variant: Mesh] ', main )
    main.name = 'model';
    return main
  }

  public evaluate(contour: Vector2[], podium: any, totalGeometry: BufferGeometry, towerShapes: [], towerFloorHeight: number, podiumFloorHeight: number, podiumFloorsCount: number){
    // contour in arguments is sites contour
    const site_area: number = Math.abs(ShapeUtils.area(contour)); 
    const base_area: number = Math.abs(ShapeUtils.area(podium.top_contour)); 
    const free_area = (site_area - base_area);
    const podium_volume = this.getRecVolume(this.getRecSurface(podium.top_contour), podiumFloorHeight) * podiumFloorsCount;
    const total_volume = this.getBufferGeometryVolume(totalGeometry);
    const tower_volume = total_volume - podium_volume;
    const {towerFacadeArea, towerTotalArea} = this.evaluateTower( towerShapes, towerFloorHeight );
    const {podiumFacadeArea, podiumTotalArea} = this.evaluatePodium(podium.top_contour, podiumFloorHeight, podiumFloorsCount);
    // console.log('[Generator: Facade area] ', podiumFacadeArea , towerFacadeArea);
    // console.log('[Generator: Total area] ', podiumTotalArea , towerTotalArea);


    return {
      exteriorArea: Math.round(free_area),
      podiumVolume: Math.round(podium_volume),
      towerVolume: Math.round(tower_volume),
      totalBuildingArea: Math.round( podiumTotalArea + towerTotalArea),
      facadeArea: Math.round( podiumFacadeArea + towerFacadeArea)
    }
  }

  public evaluateTower( shapes: any[], towerFloorHeight: number ){
    let total_facade_area = 0;
    let total_area = 0
    let type = shapes.length == 1 ? 'Type_a' : 'Type_b';

    if(shapes.length == 0 ) return {};

    switch (type) {

      case 'Type_a':
        let contour_a = shapes[0].contour;
        let dist1_a = contour_a[0].distanceTo(contour_a[1]);
        let dist2_a = contour_a[1].distanceTo(contour_a[2]);
        let floor_facade_area = (dist1_a * towerFloorHeight) * 2 + (dist2_a * towerFloorHeight) * 2;
        total_facade_area = shapes[0].num_floors * floor_facade_area;
        total_area = (dist1_a * dist2_a) * shapes[0].num_floors; 
        break;

      case 'Type_b':
        let contour1_b = shapes[0].contour;
        let contour2_b = shapes[1].contour;
        let h1 = shapes[0].num_floors;
        let h2 = shapes[1].num_floors;
        
        let shortest_shape: any, longest_shape: any;

        if( h1 < h2 ){
          shortest_shape = shapes[0];
          longest_shape = shapes[1];
        } else {
          shortest_shape = shapes[1];
          longest_shape = shapes[0];
        }

        let dif = longest_shape.num_floors - shortest_shape.num_floors;
        let length_1: number, width_1: number, length_2: number, width_2: number;

        let a = shortest_shape.contour[0].distanceTo(shortest_shape.contour[1]);
        let b = shortest_shape.contour[1].distanceTo(shortest_shape.contour[2]);

        let c = longest_shape.contour[0].distanceTo(longest_shape.contour[1]);
        let d = longest_shape.contour[1].distanceTo(longest_shape.contour[2]);

        if( a > b ){
          length_1 = a;
          width_1 = b;
        }else{
          length_1 = b;
          width_1 = a;
        }

        if( c > d ){
          length_2 = c;
          width_2 = d;
        }else{
          length_2 = d;
          width_2 = c;
        }
        // console.log('[Generator: Type B] ', a,b,c,d);

        const inter_dist = Math.abs(length_1 - length_2);
        let area_1 = (length_1 * towerFloorHeight) + ((width_1 * towerFloorHeight) * 2) + ((length_1 - inter_dist) * towerFloorHeight);
        let area_2 = (length_2 * towerFloorHeight) + ((width_2 * towerFloorHeight) * 2) + ((length_2 - inter_dist) * towerFloorHeight);
        let add_area = ((length_2 * towerFloorHeight) * 2) + ((width_2 * towerFloorHeight) * 2);
        // console.log('[Generator: Type B areas] ', area_1, area_2, add_area);
        
        total_facade_area = (area_1 * shortest_shape.num_floors) + (area_2 * shortest_shape.num_floors) + (add_area * dif);

        total_area = ((length_1 *  width_1) * shortest_shape.num_floors) + ((length_2 *  width_2) * longest_shape.num_floors);

        break;
      default:
        break;
    }
    
    return {towerFacadeArea: total_facade_area,
            towerTotalArea: total_area
      };
  }

  public evaluatePodium( contour: any[], podiumFloorHeight: number, podiumFloorsCount: number ){
    let dist1= contour[0].distanceTo(contour[1]);
    let dist2 = contour[1].distanceTo(contour[2]);
    let facade_area = ( (dist1 * podiumFloorHeight) * 2 + (dist2 * podiumFloorHeight) * 2 ) * podiumFloorsCount;
    return {
      podiumFacadeArea: facade_area,
      podiumTotalArea: (dist1 * dist2 ) * podiumFloorsCount
    };
  }

  public clearBuffers(){
    this.SLAB_GEOMETRIES  = [];
    this.SPACE_GEOMETRIES = [];
    this.LINE_GEOMETRIES  = [];
    this.TEXT_GEOMETRIES  = [];
    this.SITE_GEOMETRIES  = [];
    this.LINE_MESHES  = [];
    this.TEXT_MESHES  = [];
  }

  private addVarNumtoGeomBuffers( slabGeom: BufferGeometry, spaceGeom: BufferGeometry, siteGeom: BufferGeometry ){

  }

}







// TODO: Extusion
// let hasBBox = false;
// const height = 0.2;
// const extrudeSettings = {
// 	steps: 1,
// 	depth: height,
// 	bevelEnabled: true,
// 	bevelThickness: 0,
// 	bevelSize: 0,
// 	bevelOffset: 0,
// 	bevelSegments: 0
// };

// const spaceExtrudeSettings = {
// 	steps: 1,
// 	depth: 0.8,
// 	bevelEnabled: true,
// 	bevelThickness: 0,
// 	bevelSize: 0,
// 	bevelOffset: 0,
// 	bevelSegments: 0
// };

// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import fontJSON from "three/examples/fonts/droid/droid_sans_bold.typeface.json"

// const contour1 = [
//   new THREE.Vector2(0, 0),
//   new THREE.Vector2(0,18),
//   new THREE.Vector2(13,18),
//   new THREE.Vector2(20,15),
//   new THREE.Vector2(20,0),
//   new THREE.Vector2(0, 0)
// ];
// const contour2 = [
//   new THREE.Vector2(0, 0),
//   new THREE.Vector2(0,20),
//   new THREE.Vector2(10,20),
//   new THREE.Vector2(15,15),
//   new THREE.Vector2(15,5),
//   new THREE.Vector2(10,0),
//   new THREE.Vector2(0, 0)
// ];
// const createText = (results, offset) => {
//   const loader = new FontLoader();
//   const parsedFont = loader.parse(fontJSON)

//   const txtMaterial = new THREE.MeshPhongMaterial( { color: 0x404040 } );
//   const str = [`Base area: ${results.area} m2`, `Volume: ${results.volume} m3`, `Building height: ${results.height} m` ]
//   for ( let i=0; i < str.length; i++){
//     let text = new TextGeometry( str[i], {
//       font: parsedFont,
//       size: 0.7,
//       height: 0.01,
//     });

//     let txtMesh = new THREE.Mesh( text, txtMaterial ) ;

//     txtMesh.rotation.set(-Math.PI/2, 0, -Math.PI/2);
//     txtMesh.translateY(offset -i)
//     txtMesh.updateMatrix()
//     scene.add( txtMesh );
//   }
// }

// const visualizeBBox = ( bbox ) => {
//   const geometry = new THREE.SphereGeometry( 0.3, 32, 16 ); 
//   const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 
//   const sMax = new THREE.Mesh( geometry, material ); 
//   sMax.position.set( bbox.max.x,0, bbox.max.y );
//   const sMin = new THREE.Mesh( geometry, material ); 
//   sMin.position.set( bbox.min.x, 0, bbox.min.z );
//   scene.add( sMax );
//   scene.add( sMin );
// }

// const offsetContour = (offset, contour) => {

//   let result = [];

//   offset = new THREE.BufferAttribute(new Float32Array([offset, 0, 0]), 3);
//   // console.log("offset", offset);

//   for (let i = 0; i < contour.length - 1; i++) {
//     let v1 = new THREE.Vector2().subVectors(contour[i - 1 < 0 ? contour.length - 1 : i - 1], contour[i]);
//     let v2 = new THREE.Vector2().subVectors(contour[i + 1 == contour.length ? 0 : i + 1], contour[i]);
//     let angle = v2.angle() - v1.angle();
//     let halfAngle = angle * 0.5;

//     let hA = halfAngle;
//     let tA = v2.angle() + Math.PI * 0.5;

//     let shift = Math.tan(hA - Math.PI * 0.5);
//     let shiftMatrix = new THREE.Matrix4().set(
//            1, 0, 0, 0, 
//       -shift, 1, 0, 0,
//            0, 0, 1, 0,
//            0, 0, 0, 1
//     );


//     let tempAngle = tA;
//     let rotationMatrix = new THREE.Matrix4().set(
//       Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
//       Math.sin(tempAngle),  Math.cos(tempAngle), 0, 0,
//                         0,                    0, 1, 0,
//                         0,                    0, 0, 1
//     );

//     let translationMatrix = new THREE.Matrix4().set(
//       1, 0, 0, contour[i].x,
//       0, 1, 0, contour[i].y,
//       0, 0, 1, 0,
//       0, 0, 0, 1,
//     );

//     let cloneOffset = offset.clone();
//     cloneOffset.needsUpdate = true
//     // console.log("cloneOffset", cloneOffset);
//     // shiftMatrix.applyToBufferAttribute(cloneOffset);
//     // rotationMatrix.applyToBufferAttribute(cloneOffset);
//     // translationMatrix.applyToBufferAttribute(cloneOffset);
//     cloneOffset.applyMatrix4(shiftMatrix)
//     cloneOffset.applyMatrix4(rotationMatrix)
//     cloneOffset.applyMatrix4(translationMatrix)


//     result.push(new THREE.Vector2(cloneOffset.getX(0), cloneOffset.getY(0)));
//   }


//   return result;
// }

// const setScale = (currScale) =>{

//   if (!currScale) return currScale = new THREE.Vector3(1, 1, 1);

//   if (currScale.x == 1){
//     let rndBool = Math.random() < 0.5;
//     if( rndBool == false ) return currScale = new THREE.Vector3(1, 1, 1)
//     else {
//     let rndBool = Math.random() < 0.5;
//     if( rndBool == false ) currScale = new THREE.Vector3(0.9, 0.9, 1)
//     else currScale = new THREE.Vector3(0.7, 0.7, 1)
//     return currScale
//     }
//   }

//   if (currScale.x == 0.9){
//     let rndBool = Math.random() < 0.5;
//     if( rndBool == false ) currScale = new THREE.Vector3(0.9, 0.9, 1)
//     else currScale = new THREE.Vector3(0.7, 0.7, 1)
//     return currScale
//   } 

//   if (currScale.x == 0.7) return currScale;
// } 

// const createShape = ( points, floors ) => {
//   let dist = extrudeSettings.depth; 
//   let _dist = dist + spaceExtrudeSettings.depth;

//   let currScale;
//   let currOff = 0;
//   let offFloor;
//   let offSpace;

//   const offs = [ 0, -0.4, -0.7, -0.7, -0.7, -2];

//   const scale = { min: new THREE.Vector3(1,1,1),
//                   mid: new THREE.Vector3(0.9, 0.9, 1),
//                   max: new THREE.Vector3(0.7, 0.7, 1) 
//                 };

//   for ( let i = 0; i < floors.length; i++) { 
  
  
//     if(currScale && currScale.x == 1) {
//       let rndBool = Math.random() < 0.5;
//       if( rndBool == false ) currOff = randomIntFromInterval(currOff,-2);
//     } 
//     currScale = setScale(currScale);
//     console.log("Scale: ", currScale)
//     // else {
//     //   currOff = 0
//     // }

  
//     console.log("Offset: ", currOff)


//     offFloor = offsetContour( currOff, points );
//     offSpace = offsetContour( currOff - 0.2, points );

//     const floorShape = formBaseShape( offFloor );
//     const spaceFloorShape = formBaseShape( offSpace );

//     dist = createFloors( floorShape, floors[i], dist, currScale );
//     _dist = createFloorSpaces( spaceFloorShape, floors[i], _dist, currScale );
//   }

//   const results = {area: 6666, volume: 100000, height: dist}

//   createText(results, -3)
// }

// const createFloors = ( shape, nFloors, dist, scale ) => {
//   const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
//   const material = new THREE.MeshPhongMaterial( { color: 0xe6e6e6 } );
//   geometry.scale( scale.x, scale.y, scale.z);
//   for ( let i = 0; i < nFloors; i++) {
//     let mesh = new THREE.Mesh( geometry, material ) ;
//     mesh.rotation.set(Math.PI/2,0, 0);
//     mesh.translateZ(-dist)
//     mesh.updateMatrix();

//     // if(!hasBBox){
//     //   geometry.computeBoundingBox();
//     //   visualizeBBox( geometry.boundingBox );
//     //   hasBBox = true
//     // }

//     scene.add( mesh );
//     mesh.castShadow = true
//     dist += spaceExtrudeSettings.depth + extrudeSettings.depth

//     if ( i == nFloors - 1 ) {
//       let mesh = new THREE.Mesh( geometry, material ) ;
//       mesh.rotation.set(Math.PI/2,0, 0);
//       mesh.translateZ(-dist)
//       mesh.updateMatrix()
//       scene.add( mesh );
//     }

//   }
//   return dist;
// }

// const createFloorSpaces = ( spaceShape, nFloors, dist, scale ) => {
//   const spaceGeometry = new THREE.ExtrudeGeometry( spaceShape, spaceExtrudeSettings );
//   const spaceMaterial = new THREE.MeshPhongMaterial( { color: 0xadebeb, transparent:true, opacity: 0.8 } );
//   spaceGeometry.scale( scale.x, scale.y, scale.z);

//   for ( let i = 0; i < nFloors; i++) {
//     let floorMesh = new THREE.Mesh( spaceGeometry, spaceMaterial ) ;
//     floorMesh.rotation.set(Math.PI/2,0, 0);
//     floorMesh.translateZ(-dist)
//     floorMesh.updateMatrix();
//     scene.add( floorMesh );
//     floorMesh.castShadow = true
//     dist += spaceExtrudeSettings.depth + extrudeSettings.depth
//   }
//   return dist;
// }

// const formBaseShape = ( points ) => {
//   const shape = new THREE.Shape();
//   shape.moveTo( points[0].x, points[0].y );

//   for ( let i = 1; i < points.length; i++)
//     shape.lineTo( points[i].x, points[i].y );

//   shape.lineTo( points[0].x, points[0].y );

//   return shape;
// }

// const nDivider = (number, parts, min) => {

//   let randombit = number - min * parts;
//   let out = [];

//   for (let i=0; i < parts; i++) {
//     out.push( Math.random() );
//   }

//   let mult = randombit / out.reduce( (a,b)=> {return a+b;});

//   return out.map( (el) => { return Math.round(el * mult + min); });
// }

// const randomIntFromInterval = (min, max) => { 
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }

// const randomPolies = ( max, min, nPolies ) => {
//   const randomPolies = [];
//   while( randomPolies.lenth < nPolies ) {
//     let randX = randomIntFromInterval( min.x, max.x );
//     let randY = randomIntFromInterval( min.y, max.y );



//   }
// }


// const rndInt = randomIntFromInterval(15, 30);
// const floors = nDivider(rndInt, 6, 2);

// console.log(rndInt);
// console.log(floors);
// createShape( contour1, floors );


// TODO: Extusion
//TODO: NEW WAY Site - building contour - check for intersection with site boudries
// //* Contour
// const mat = new THREE.LineBasicMaterial( {color: 0x6600cc, linewidth: 2} );
// const contourLines = [];
// const contourLines3 = []

// for( let i=0; i < contour1.length - 1; i++ ){
//   const geometry = new THREE.BufferGeometry().setFromPoints([contour1[i],contour1[i+1]]);
//   const line = new THREE.Line(geometry, mat);
//   line.rotation.set(Math.PI/2,0, 0);
//   line.updateMatrix()

//   let l3 = new THREE.Line3(new THREE.Vector3(contour1[i].x, 0, contour1[i].y),
//                             new THREE.Vector3(contour1[i+1].x, 0, contour1[i+1].y));
//   contourLines.push(line)
//   contourLines3.push(l3)
//   scene.add(line)
// }


// //* get bbox of contour
// const shape = formBaseShape(contour1);
// const geom = new THREE.ExtrudeGeometry( shape, extrudeSettings ); // try using buffergeometry instead
// let meShape = new THREE.Mesh( geom, mat );
// meShape.rotation.set(Math.PI/2,0, 0);
// meShape.updateMatrix();
// meShape.geometry.computeBoundingBox();
// const bbox = visualizeBBox( meShape.geometry.boundingBox, false );
// const dist = bbox.min.distanceTo(bbox.max) / 1.7;
// const axesLines = drawAxes(bbox, false);

// //* Generate podium base position inside site

// const podiumBaseGeom = new THREE.BoxGeometry( dist, dist/2, 0.1 ); 
// const podiumBaseMat = new THREE.MeshBasicMaterial( {color: 0x66ffcc, side: THREE.DoubleSide} );
// const podiumBase = new THREE.Mesh( podiumBaseGeom, podiumBaseMat );
// let times=0
// let intersections = [];
// let rotation = 0;
// podiumBase.geometry.computeBoundingBox()
// podiumBase.updateMatrixWorld()
// scene.add( podiumBase );

// while(intersections.includes(true) || intersections.length == 0) {

//   let n = Math.random();
//   let axis = randomIntFromInterval(0,axesLines.length-1)
//   let pointAtParam = getPointAtParameter(axesLines[axis], n, false);

//   podiumBase.rotation.set(Math.PI/2, 0, rotation);
//   podiumBase.position.copy(pointAtParam)
//   podiumBase.updateMatrix()

//   for ( let j = 0; j < contourLines.length; j++)
//     intersections.push(checkTwoShapeIntersect(podiumBase, contourLines[j]));

//   // console.log(intersections)

//   if(intersections.includes(true)) {
//     intersections = []
//     rotation = Math.PI / (Math.random() * 4)
//     times++;
//     if(times == 500) break;
//   } 
// }
// console.log(`Found base position and orientation after: ${times} times`)
// podiumBase.visible = false;

// let topPodium = 0;

// function createPodium(width, height, depth, matrix, nFloor, floorHeight){
//   const geomF = new THREE.BoxGeometry( width, height, depth ); 
//   const matF = new THREE.MeshPhongMaterial( {color: 0xd9d9d9, side: THREE.DoubleSide} );

//   const geomS = new THREE.BoxGeometry( width, height, floorHeight ); 
//   const matS = new THREE.MeshPhongMaterial( {color: 0xb3e6ff, side: THREE.DoubleSide, transparent: true, opacity: 0.7} );
//   let hF = depth;
//   let hS = (floorHeight + hF)/2 + hF;

//   const floorMeshes = []
//   const spaceMeshes = []
//   const roofV = []
//   const setX = new Set();
//   const setY = new Set();

//   for( let i=0; i < nFloor; i++ ){
//     //* Podium floors
//     let podF = new THREE.Mesh( geomF, matF );
//     podF.applyMatrix4(matrix)
//     podF.translateZ(-hF)
//     podF.updateMatrixWorld()

//     // floorMeshes.push(podF)
//     scene.add(podF); //TODO: merge then addd to scene
//     hF += depth + floorHeight

//     //* Podium floors
//     let podS = new THREE.Mesh( geomS, matS );
//     podS.applyMatrix4(matrix)
//     podS.translateZ(-hS)
//     podS.updateMatrixWorld()

//     // spaceMeshes.push(podS)
//     scene.add(podS); //TODO: merge then addd to scene
//     hS += depth + floorHeight

//     //* Add podium roof
//     if( i == nFloor - 1 ){
//       let roof = new THREE.Mesh( geomF, matF );
//       roof.applyMatrix4(matrix)
//       roof.translateZ(-hF)
//       roof.updateMatrixWorld()
//       roof.updateMatrix()
//       hF += depth/2

//       // roof.geometry.computeBoundingBox()
//       // let box = new THREE.Box3().setFromObject( roof );
//       // let bBox = visualizeBBox(box, true)
//       for ( let y=0; y<roof.geometry.index.count; y++ ){
//         let v3 = new THREE.Vector3().fromBufferAttribute(roof.geometry.attributes.position, y);
//         roofV.push(v3)
//       }
//       const m = roofV.map( v=>{
//         if (v.x) setX.add(v.x)
//         if (v.y) setY.add(v.y)

//       })
//       scene.add(roof); //TODO: merge then addd to scene
//     }
//   }

//   //* Roof points
//   const topP = []
//   const shapeP = []
//   const x = Array.from(setX)
//   const y = Array.from(setY)

//   for( let a=0; a < x.length; a++ ){
//     for( let b=0; b < y.length; b++ ){
//       topP.push(new THREE.Vector3(x[a], y[b], -hF ))
//       shapeP.push(new THREE.Vector2(x[a], y[b]))
//     }
//   }
//   // shapeP.push(shapeP[0])

//   //!<              Visualize top points              >!
//   const geometry = new THREE.SphereGeometry( 0.1, 32, 16 ); 
//   const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 
//   for( let r=0; r <topP.length; r++){
//     let s = new THREE.Mesh( geometry, material ); 
//     s.position.copy(topP[r])
//     s.applyMatrix4(matrix)
//     scene.add( s );
//   }

//   const sortedCountour = [shapeP[2], shapeP[3], shapeP[1], shapeP[0], shapeP[2]];

//   topPodium = hF
//   return {height: topPodium, top_positions: topP, top_contour: sortedCountour}

// }

// function createFloors2(shape, extrudeSettings, stHeight, floorHeight, nFloor, matrix){
//   const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
//   const material = new THREE.MeshPhongMaterial( { color: 0xd9d9d9 } );
//   // geometry.scale( scale.x, scale.y, scale.z);
//   let dist = stHeight + floorHeight;
//   for( let i = 0; i < nFloor; i++){
//     let mesh = new THREE.Mesh( geometry, material ) ;
//     mesh.translateZ(-dist)
//     mesh.applyMatrix4(matrix)
//     scene.add(mesh)
//     dist += floorHeight
//   }
// }

// function createSpaces2(shape, extrudeSettings, stHeight, floorHeight, nFloor, matrix){
//   const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
//   const material = new THREE.MeshPhongMaterial( { color:0xb3e6ff, side: THREE.DoubleSide, transparent: true, opacity: 0.7} );
//   // geometry.scale( scale.x, scale.y, scale.z);
//   let dist = stHeight + extrudeSettings.depth;
//   for( let i = 0; i < nFloor; i++){
//     let mesh = new THREE.Mesh( geometry, material ) ;
//     mesh.translateZ(-dist)
//     mesh.applyMatrix4(matrix)
//     scene.add(mesh)
//     dist += extrudeSettings.depth + floorHeight
//   }
// }

// const rndInt = randomIntFromInterval(1, 4);
// // const floors = nDivider(rndInt, 6, 2);
// const pod = createPodium(dist, dist/2, 0.2, podiumBase.matrix , rndInt, 2)
// console.log(`Top podium is at: ${topPodium}`)
// console.log('Podium: ', pod)

// const contourF = offsetContour( 2, pod.top_contour);
// const contourS = offsetContour( 2.3, pod.top_contour);

// const topPodShapeF = formBaseShape(contourF);
// const topPodShapeS = formBaseShape(contourS);

// console.log('Shape: ', ShapeUtils.isClockWise(pod.top_contour))


// const towerFloorsRnd = randomIntFromInterval(6, 16);
// createFloors2( topPodShapeF, extrudeSettings, pod.height, 1, towerFloorsRnd, podiumBase.matrix)
// createSpaces2( topPodShapeS, spaceExtrudeSettings, pod.height, extrudeSettings.depth, towerFloorsRnd, podiumBase.matrix)

//TODO: Generate mass - Tower type B
// const _contourF = offsetContour( 2, pod.top_contour);
// const _contourS = offsetContour( 2.3, pod.top_contour);



// function getShapesforTypeB(_contour, paramA, paramB){
//   const _a = new THREE.Line3(_contour[0],_contour[1]);
//   const _b = new THREE.Line3(_contour[1],_contour[2]);
//   const _c = new THREE.Line3(_contour[1],_contour[2]);
//   const _d = new THREE.Line3(_contour[1],_contour[2]);

//   const pt_a = new THREE.Vector2()
//   const pt_b = new THREE.Vector2()
//   const pt_c = new THREE.Vector2()
//   const pt_d = new THREE.Vector2()

//   _a.at(0.5, pt_a)
//   _b.at(paramA, pt_b) // this is the one that controls the 
//   _c.at(0.5, pt_c)
//   _d.at(1-paramB, pt_d)

//   const pt_ab = new THREE.Vector2(pt_b.x, pt_a.y)
//   const pt_b0 = new THREE.Vector2(pt_b.x,_contour[0].y)


//   const first_half = [_contour[0], pt_a, pt_ab, pt_b0, _contour[0]]
//   const _shape = formBaseShape(first_half);

//   const pt_x = new THREE.Vector2(pt_d.x, pt_a.y)

//   const pt_y = new THREE.Vector2(_contour[2].x,pt_x.y)
//   const second_half = [_contour[2], pt_d, pt_x, pt_y, _contour[2]]
//   const _shape2 = formBaseShape(second_half);
//   return [_shape, _shape2]
// }

// const _shapeF = getShapesforTypeB(_contourF, 0.6, 0.9)
// const _shapeS = getShapesforTypeB(_contourS, 0.6, 0.9)

// // console.log("TYPE B: ", first_half)

// const towerFloorsRnd1 = randomIntFromInterval(8, 16);
// const towerFloorsRnd2 = randomIntFromInterval(8, 16);

// createFloors2( _shapeF[0], extrudeSettings, pod.height, 1, towerFloorsRnd1, podiumBase.matrix)
// createSpaces2( _shapeS[0], spaceExtrudeSettings, pod.height, extrudeSettings.depth, towerFloorsRnd1, podiumBase.matrix)
// createFloors2( _shapeF[1], extrudeSettings, pod.height, 1, towerFloorsRnd2, podiumBase.matrix)
// createSpaces2( _shapeS[1], spaceExtrudeSettings, pod.height, extrudeSettings.depth, towerFloorsRnd2, podiumBase.matrix)
