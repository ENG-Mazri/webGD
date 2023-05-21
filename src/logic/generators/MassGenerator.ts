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
//   new THREE.Vector2(0,8),
//   new THREE.Vector2(3,8),
//   new THREE.Vector2(10,5),
//   new THREE.Vector2(10,0),
//   new THREE.Vector2(0, 0)
// ];
// const createText = (results, position) => {
//   const loader = new FontLoader();
//   const parsedFont = loader.parse(fontJSON)
  
//   const txtMaterial = new THREE.MeshPhongMaterial( { color: 0x404040 } );
//   const str = [`Base area: ${results.area} m2`, `Volume: ${results.volume} m3`, `Building height: ${results.height} m` ]
//   for ( let i=0; i < str.length; i++){
//     let text = new TextGeometry( str[i], {
//       font: parsedFont,
//       size: 0.5,
//       height: 0.01,
//     });
  
//     let txtMesh = new THREE.Mesh( text, txtMaterial ) ;
  
//     txtMesh.rotation.set(-Math.PI/2, 0, -Math.PI/2);
//     txtMesh.translateY(-3 -i)
//     txtMesh.updateMatrix()
//     scene.add( txtMesh );
//   }
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

// const createShape = ( points, floors ) => {
//   let dist = extrudeSettings.depth; 
//   let _dist = dist + spaceExtrudeSettings.depth;
//   const offs = [ 0, -0.4, -0.7, -0.7, -0.7, -2];
//   const results = {area: 6666, volume: 100000, height: 95}

//   const scale = [ new THREE.Vector3(1,1,1), new THREE.Vector3(0.8, 0.8, 1), new THREE.Vector3(0.8, 0.8, 1) ]

//   for ( let i = 0; i < floors.length; i++) { 
//     const offFloor = offsetContour( offs[i], points );
//     const offSpace = offsetContour( offs[i] - 0.2, points );
//     const floorShape = formBaseShape(offFloor );
//     const spaceFloorShape = formBaseShape( offSpace );
//     dist = createFloors( floorShape, floors[i], dist, scale[0] );
//     _dist = createFloorSpaces( spaceFloorShape, floors[i], _dist, scale[0] );

//   }

//   createText(results, '')
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

// const floors = nDivider(20, 3, 2)
// console.log(floors);
// // const floors = [3, 12, 1];
// createShape( contour1, floors )


// TODO: Extusion