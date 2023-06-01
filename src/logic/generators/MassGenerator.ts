import { Generator } from "./Generator";

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
export class MassGenerator extends Generator {
    
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
//   const x = Array.from(setX)
//   const y = Array.from(setY)

//   for( let a=0; a < x.length; a++ ){
//     for( let b=0; b < y.length; b++ ){
//       topP.push(new THREE.Vector3(x[a], y[b], -hF ))
//     }
//   }

//   //!<              Visualize top points              >!
//   const geometry = new THREE.SphereGeometry( 0.1, 32, 16 ); 
//   const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 
//   for( let r=0; r <topP.length; r++){
//     let s = new THREE.Mesh( geometry, material ); 
//     s.position.copy(topP[r])
//     s.applyMatrix4(matrix)
//     scene.add( s );
//   }
//   console.log("Roof: ", topP)

//   topPodium = hF
//   return {height: topPodium, topVectors: topP}

// }
// const rndInt = randomIntFromInterval(1, 4);
// // const floors = nDivider(rndInt, 6, 2);
// const pod = createPodium(dist, dist/2, 0.2, podiumBase.matrix , rndInt, 2)
// console.log(`Top podium is at: ${topPodium}`)
// console.log('Podium: ', pod)







