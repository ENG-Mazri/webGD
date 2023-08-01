import {BuildingMassGenerator} from '../logic/generators/BuildingMassGenerator';
import {GenerationManager} from '../logic/GenerationManager';
import { BoxGeometry, Mesh, MeshPhongMaterial, Vector2 } from 'three';
import { v4 as uuidv4 } from 'uuid';

const mock_contour = [
  new Vector2(0, 0),
  new Vector2(0,88),
  new Vector2(60,88),
  new Vector2(90,55),
  new Vector2(90,0),
  new Vector2(0, 0)
];

const mock_inputs = {
                    site_offset: {type: 'constant', value: 0},
                    contour: mock_contour,
                    total_floors: {type: 'variable', value: {min: 19, max: 29 }},
                    tower_floor_height: {type: 'constant', value: 3},
                    podium_floor_height: {type: 'constant', value: 4}
                  }
                  
// const gd_currentInputs = localStorage.setItem( 'gd_currentInputs' );
const strategy = 'Randomize';
const generations = 1;
const populations = 3;

onmessage = async (event) => {
  if( event.data.type == 'onProcess'){
    const inputs = JSON.parse(event.data.inputs);

    const bldMassGen = new BuildingMassGenerator();
    // const model_mesh = bldMassGen.generateVariant(mock_inputs);
  
    const genManager = new GenerationManager(bldMassGen, strategy, [], populations)
    // console.log('[WORKER: inputs] ', inputs);
    let transX = 0;
    let transY = 0;
    let pos = 0;

    for( let i = 0; i < event.data.populations; i++ ){
      genManager.populate( inputs, {transX, transY}, i);
        // this.generator.evaluate();
        pos += 1;
        transX += 150;

        if( pos == 4 ){
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
    const varsData = genManager.getVarsData();
    const resultsByEvaluator = genManager.getResultsByEvaluator();
    // console.log('[Worker: results] ', resultsByEvaluator)

    await genManager.getGlbFromGeneration(model, uuidv4()).then(()=>{
      postMessage({type: 'onFinished',
        varsData,
        resultsByEvaluator
      });

    });

    // console.log('[Variants]: ', this.variants);

  }
  // postMessage('helokojm');
};