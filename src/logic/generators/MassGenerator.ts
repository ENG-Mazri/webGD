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