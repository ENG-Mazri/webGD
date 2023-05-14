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

// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import fontJSON from "three/examples/fonts/droid/droid_sans_bold.typeface.json"

// //* Plane for shadow visualizition
// // const planeGeometry = new THREE.PlaneGeometry( 100, 100 );
// // const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xefefef, side: THREE.DoubleSide} );
// // const plane = new THREE.Mesh( planeGeometry, planeMaterial );
// // plane.receiveShadow = true;
// // plane.rotation.set(Math.PI/2,0, 0);
// // scene.add( plane );

// const greyColor = new THREE.Color(0x4d4d4d);


// const loader = new FontLoader();
// const parsedFont = loader.parse(fontJSON)

// const material = new THREE.MeshPhongMaterial( { greyColor, side: THREE.DoubleSide } );
// const txtMaterial = new THREE.MeshPhongMaterial( { color: 0x404040 } );
// const spaceMaterial = new THREE.MeshPhongMaterial( { color: 0xccffff } );



// let str = ["Public realm area: 2000 m2", "Volume: 40000 m3", "Building height: 80 m" ]
// // Volume: 5000"
// for ( let i=0; i < str.length; i++){
//   let text = new TextGeometry( str[i], {
//     font: parsedFont,
//     size: 0.5,
//     height: 0.01,
//   });

//   let txtMesh = new THREE.Mesh( text, txtMaterial ) ;

//   txtMesh.rotation.set(-Math.PI/2, 0, -Math.PI/2);
//   txtMesh.translateY(-3 + (-i))
//   txtMesh.updateMatrix()
//   scene.add( txtMesh );


// }
// const length = 5, height = 0.2, width = 8;

// const shape = new THREE.Shape();
// const spaceShape = new THREE.Shape();
// shape.moveTo( 0, 0 );
// shape.lineTo( 0, 8 );
// shape.lineTo( 3, 8 );
// shape.lineTo( 10, 5 );
// shape.lineTo( 10, 0 );
// shape.lineTo( 0, 0 );
// const contour1 = [
//   new THREE.Vector2(0, 0),
//   new THREE.Vector2(0,8),
//   new THREE.Vector2(3,8),
//   new THREE.Vector2(10,5),
//   new THREE.Vector2(10,0),
//   new THREE.Vector2(0, 0)
// ];



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


// let dist = extrudeSettings.depth;
// let _dist = dist + spaceExtrudeSettings.depth;

// // console.log(mesh)

// //* FLOOR SPACE SHAPE
// let off = offsetContour(-0.3,contour1);

// spaceShape.moveTo( off[0].x, off[0].y );
// spaceShape.lineTo( off[1].x, off[1].y );
// spaceShape.lineTo( off[2].x, off[2].y );
// spaceShape.lineTo( off[3].x, off[3].y );
// spaceShape.lineTo( off[4].x, off[4].y );
// spaceShape.lineTo( off[0].x, off[0].y );

// for ( let i=0; i < 16; i++) {
  
//   // if (i == 7) {
//   //   shape.curves[2].v2.x = 10;
//   //   shape.curves[2].v2.y = 3;
//   //   shape.curves[3].v1.x = 10;
//   //   shape.curves[3].v1.y = 3;
//   // }
//   // let geometry = new THREE.ShapeGeometry( shape );
//   let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
//   if (i > 4) {
//     geometry.scale(0.8, 0.8, 0.8)
//   }
//   let mesh = new THREE.Mesh( geometry, material ) ;

//   // console.log("shape...", geometry)
  
//   mesh.rotation.set(Math.PI/2,0, 0);
//   mesh.translateZ(-dist)
//   mesh.updateMatrix();
//   scene.add( mesh );
//   mesh.castShadow = true

//   //TODO: Floor space geometry

//   let spaceGeometry = new THREE.ExtrudeGeometry( spaceShape, spaceExtrudeSettings );
//   if (i >= 4) {
//     spaceGeometry.scale(0.8, 0.8, 1)
//   }
//   let floorMesh = new THREE.Mesh( spaceGeometry, spaceMaterial ) ;
//   floorMesh.rotation.set(Math.PI/2,0, 0);
//   floorMesh.translateZ(-_dist)
//   floorMesh.updateMatrix();
//   // console.log(floorMesh)
//   scene.add( floorMesh );
//   floorMesh.castShadow = true

//   dist += spaceExtrudeSettings.depth + extrudeSettings.depth
//   _dist += spaceExtrudeSettings.depth + extrudeSettings.depth

//   //TODO: add roof
//   if ( i==15) {
//     let mesh = new THREE.Mesh( geometry, material ) ;

//     // console.log("shape...", geometry)
    
//     mesh.rotation.set(Math.PI/2,0, 0);
//     mesh.translateZ(-dist)
//     mesh.updateMatrix()
//     scene.add( mesh );
//   }

  
// }

//* OFFSET

// function offsetContour(offset, contour) {

//     let result = [];
  
//     offset = new THREE.BufferAttribute(new Float32Array([offset, 0, 0]), 3);
//     console.log("offset", offset);
  
//     for (let i = 0; i < contour.length; i++) {
//       let v1 = new THREE.Vector2().subVectors(contour[i - 1 < 0 ? contour.length - 1 : i - 1], contour[i]);
//       let v2 = new THREE.Vector2().subVectors(contour[i + 1 == contour.length ? 0 : i + 1], contour[i]);
//       let angle = v2.angle() - v1.angle();
//       let halfAngle = angle * 0.5;
  
//       let hA = halfAngle;
//       let tA = v2.angle() + Math.PI * 0.5;
  
//       let shift = Math.tan(hA - Math.PI * 0.5);
//       let shiftMatrix = new THREE.Matrix4().set(
//              1, 0, 0, 0, 
//         -shift, 1, 0, 0,
//              0, 0, 1, 0,
//              0, 0, 0, 1
//       );
  
  
//       let tempAngle = tA;
//       let rotationMatrix = new THREE.Matrix4().set(
//         Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
//         Math.sin(tempAngle),  Math.cos(tempAngle), 0, 0,
//                           0,                    0, 1, 0,
//                           0,                    0, 0, 1
//       );
  
//       let translationMatrix = new THREE.Matrix4().set(
//         1, 0, 0, contour[i].x,
//         0, 1, 0, contour[i].y,
//         0, 0, 1, 0,
//         0, 0, 0, 1,
//       );
  
//       let cloneOffset = offset.clone();
//       cloneOffset.needsUpdate = true
//       // console.log("cloneOffset", cloneOffset);
//       // shiftMatrix.applyToBufferAttribute(cloneOffset);
//       // rotationMatrix.applyToBufferAttribute(cloneOffset);
//       // translationMatrix.applyToBufferAttribute(cloneOffset);
//       cloneOffset.applyMatrix4(shiftMatrix)
//       cloneOffset.applyMatrix4(rotationMatrix)
//       cloneOffset.applyMatrix4(translationMatrix)
  
  
//       result.push(new THREE.Vector2(cloneOffset.getX(0), cloneOffset.getY(0)));
//     }
  
  
//     return result;
//   }
  
//   const off = offsetContour(-1,contour1);
  
//   shape.moveTo( off[0].x, off[0].y );
//   shape.lineTo( off[1].x, off[1].y );
//   shape.lineTo( off[2].x, off[2].y );
//   shape.lineTo( off[3].x, off[3].y );
//   shape.lineTo( off[4].x, off[4].y );
//   shape.lineTo( off[0].x, off[0].y );
  
//   let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
//   let mesh = new THREE.Mesh( geometry, material ) ;
//   mesh.rotation.set(Math.PI/2,0, 0);
//   mesh.updateMatrix()
//   scene.add( mesh );

// TODO: Extusion