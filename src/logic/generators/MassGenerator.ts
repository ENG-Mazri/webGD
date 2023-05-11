import { Generator } from "./Generator";

/*// TODO: Mass Generation logic
    - generate floor slabs as box
    - generate floor rooms as another box
    - check the possibility of polygon box profile https://threejs.org/docs/index.html#api/en/geometries/ExtrudeGeometry
    - use worker for computations
    -  

*/
export class MassGenerator extends Generator {
    
}

// TODO: Extusion
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import fontJSON from "three/examples/fonts/droid/droid_sans_bold.typeface.json"


// const loader = new FontLoader();
// const parsedFont = loader.parse(fontJSON)

// let text = new TextGeometry( "HELLOOOOOO",{
//   font: parsedFont,
//   size: 0.5,
//   height: 0.01,
// });
// const length = 5, height = 0.2, width = 8;

// const shape = new THREE.Shape();
// shape.moveTo( 0, 0 );
// shape.lineTo( 0, 8 );
// shape.lineTo( 3, 8 );
// shape.lineTo( 10, 5 );
// shape.lineTo( 10, 0 );
// shape.lineTo( 0, 0 );


// const extrudeSettings = {
// 	steps: 1,
// 	depth: height,
// 	bevelEnabled: true,
// 	bevelThickness: 0,
// 	bevelSize: 0,
// 	bevelOffset: 0,
// 	bevelSegments: 0
// };

// const material = new THREE.MeshPhongMaterial( { color } );
// // let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
// let mesh = new THREE.Mesh( text, material ) ;

// mesh.rotation.set(-Math.PI/2, 0, -Math.PI/2);
// mesh.translateY(-3)
// mesh.updateMatrix()
// scene.add( mesh );
// let dist = extrudeSettings.depth;

// console.log(mesh)

// for ( let i=0; i <15; i++) {
  
//   if (i == 10) {
//     shape.curves[2].v2.x = 10;
//     shape.curves[2].v2.y = 3;
//     shape.curves[3].v1.x = 10;
//     shape.curves[3].v1.y = 3;
//   }
//   let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
//   let mesh = new THREE.Mesh( geometry, material ) ;
  
//   mesh.rotation.set(Math.PI/2,0, 0);
//   mesh.translateZ(-dist)
//   mesh.updateMatrix()
//   dist += 1
//   scene.add( mesh );
  
// }

// TODO: Extusion