import {BuildingMassGenerator} from '../logic/generators/BuildingMassGenerator';
import {GenerationManager} from '../logic/GenerationManager';
import { BoxGeometry, Mesh, MeshPhongMaterial, Vector2 } from 'three';
import { v4 as uuidv4 } from 'uuid';
  
const mock_contour = [
  new Vector2(0, 0),
  new Vector2(0,88),
  new Vector2(60,88),
  new Vector2(70,95),
  new Vector2(70,0),
  new Vector2(0, 0)
];

const mock_inputs = {
                    site_offset: {type: 'constant', value: 0},
                    contour: mock_contour,
                    total_floors: {type: 'variable', value: {min: 19, max: 29 }},
                    tower_floor_height: {type: 'constant', value: 3},
                    podium_floor_height: {type: 'constant', value: 4}
                  }

onmessage = async (event) => {
  if( event.data.type == 'onProcess'){
    const bldMassGen = new BuildingMassGenerator();
    // const model_mesh = bldMassGen.generateVariant(mock_inputs);
  
    const genManager = new GenerationManager(bldMassGen, 'randomize', [], 2)

    let transX = 0;
    let transY = 0;
    let pos = 0;

    for( let i = 0; i < event.data.populations; i++ ){
      genManager.populate(mock_inputs, {transX, transY});
        // this.generator.evaluate();
        pos += 1;
        transX += 150;
        if( pos == 4){
            pos = 0;
            transX = 0;
            transY += 150;
        }
        
        // transY += 100;
        // this.variants.push(var_mesh);
      postMessage({type: 'onProgress', progress: i});
    }

    let model = bldMassGen.getModelMesh();
    genManager.model = model;
    await genManager.getGlbFromGeneration(model, uuidv4()).then(()=>{
      postMessage({type: 'onFinished'});

    });

    // console.log('[Variants]: ', this.variants);

  }
  // postMessage('helokojm');
};