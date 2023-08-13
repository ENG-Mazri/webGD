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
                  tower_floor_height: {type: 'variable', value: [1, 3]},
                  podium_floor_height: {type: 'variable', value: [3, 5]}
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

const allVarsData = [];
const allResultsByEvaluator = new Map();
allResultsByEvaluator.set('exteriorArea', []);
allResultsByEvaluator.set('podiumVolume', []);
allResultsByEvaluator.set('towerVolume', []);
allResultsByEvaluator.set('totalBuildingArea', []);
allResultsByEvaluator.set('facadeArea', []);


onmessage = async (e) => {

  if( e.data.type == 'onProcess'){
    // const inputs = JSON.parse(e.data.inputs);

    const bldMassGen = new BuildingMassGenerator();
    // const model_mesh = bldMassGen.generateVariant(mock_inputs);
    let goals = e.data.objectives ? e.data.objectives : mock_objectives;
  
    const genManager = new GenerationManager(bldMassGen, strategy, goals, populations)

    // console.log('[WORKER: inputs] ', inputs);
    let transX = 0;
    let transY = 0;
    let pos = 0;

    let genNum = 0;

    for( let j = 0; j < e.data.generations; j++ ){
      genNum += 1; 
      genManager.prepareDataStores()


      for( let i = 0; i < e.data.populations; i++ ){
        
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
      allVarsData.push(...varsData);

      for( let [key,value] of resultsByEvaluator)
        allResultsByEvaluator.get(key).push(...value);

      await genManager.getGlbFromGeneration( model, j, uuidv4() )
        .then(()=>{
          postMessage( {type: 'onProgressGen', generation: j} );


          if(j == e.data.generations - 1 ){
            postMessage({type: 'onFinished',
            varsData: allVarsData,
            resultsByEvaluator: allResultsByEvaluator
            });

          }
          bldMassGen.clearBuffers()
        });

      //* PREPARE NEXT GENERATION

      if(e.data.generations > 1) {

        // * Get last generation data 
        const varsData = genManager.getVarsData();
        const resultsByEvaluator = genManager.getResultsByEvaluator();

        //* Compute fitness
        const evalMaxMin = genManager.computeMaxMin(resultsByEvaluator);

        //* Create merged chances array by var id
        const chancesArray = genManager.computeFitnessMain(varsData, evalMaxMin, resultsByEvaluator);

        const parentsIDs = [] // parents id_id 
        const PARENTS = [];

        //* Selection parents for next generation
        for( let i = 0; i < e.data.populations; i++ ) {
          genManager.pickParents( parentsIDs, chancesArray); // fill parents ids array
        }

        // console.log("[WORKER: parents ids]", parentsIDs);
        // console.log("[WORKER: chances]", chancesArray);

        const nextGenDNA = genManager.runMatingPool(parentsIDs);

        //* clear generation data 
        genManager.clearGenerationData();

      }
    }
  }
};