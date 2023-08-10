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

const inputs = {
                    site_offset: {type: 'constant', value: 0},
                    contour: mock_contour,
                    total_floors: {type: 'variable', value: [19, 29]},
                    tower_floor_height: {type: 'constant', value: 3},
                    podium_floor_height: {type: 'constant', value: 4}
                  }

const mock_objectives = new Map()

mock_objectives.set('exteriorArea', 'max');
mock_objectives.set('podiumVolume', 'min');
mock_objectives.set('towerVolume', 'undefined');
mock_objectives.set('totalBuildingArea', 'undefined');
mock_objectives.set('facadeArea', 'undefined');
                  
// const gd_currentInputs = localStorage.setItem( 'gd_currentInputs' );
const strategy = 'Randomize';
const generations = 1;
const populations = 3;

onmessage = async (event) => {
  if( event.data.type == 'onProcess'){
    const inputs = JSON.parse(event.data.inputs);

    const bldMassGen = new BuildingMassGenerator();
    // const model_mesh = bldMassGen.generateVariant(mock_inputs);
  
    const genManager = new GenerationManager(bldMassGen, strategy, mock_objectives, populations)
    // console.log('[WORKER: inputs] ', inputs);
    let transX = 0;
    let transY = 0;
    let pos = 0;

    let genNum = 0;

    for( let j = 0; j < event.data.generations; j++ ){
      genNum += 1; 
      for( let i = 0; i < event.data.populations; i++ ){
        
        genManager.populate( inputs, {transX, transY}, i, genNum );
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
        postMessage( {type: 'onProgress', progress: i} );
      }

      transX = 0;
      transY = 0;
      pos = 0;

      let model = bldMassGen.getModelMesh();
  
      genManager.model = model;

      const varsData = genManager.getVarsData();
      const resultsByEvaluator = genManager.getResultsByEvaluator();
      await genManager.getGlbFromGeneration( model, j, uuidv4() )
        .then(()=>{
          bldMassGen.clearBuffers()
          postMessage({type: 'onFinished',
            varsData,
            resultsByEvaluator,
            generation: j
          });
        });
    }



    // if(strategy == 'Optimize'){
      //* CREATE NEXT GENERATIONS
      
      //* Get last generation data 
      // const varsData = genManager.getVarsData();
      // const resultsByEvaluator = genManager.getResultsByEvaluator();
      
      //* Compute fitness
    //   const evalMaxMin = genManager.computeMaxMin(resultsByEvaluator);
    //   const chancesArray = genManager.computeFitnessMain(varsData, evalMaxMin, resultsByEvaluator);

    //   const parentsIDs = []
    //   const PARENTS = [];
    //   //* Selection
    //   for( let i = 0; i < event.data.populations; i++ ) {
    //     genManager.pickParents( parentsIDs, chancesArray);
    //   }

    //   console.log("[WORKER: parents ids]", parentsIDs);
    //   // console.log("[WORKER: parents]", PARENTS);
    //   genManager.runMatingPool(parentsIDs);

    // // }

    // console.log('[Worker: results] ', resultsByEvaluator);
    // console.log('[Worker: vars] ', varsData);
    // console.log('[Worker: max - min] ', evalMaxMin);
    // console.log('[Worker: fitness] ', chances);
    // console.log('[Worker: outputs fitness] ', outputsFitness);


    // await genManager.getGlbFromGeneration( model, uuidv4() )
    //   .then(()=>{
    //     postMessage({type: 'onFinished',
    //       varsData,
    //       resultsByEvaluator
    //     });

    //   });
  }
};