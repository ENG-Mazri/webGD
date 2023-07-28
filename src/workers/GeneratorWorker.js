import {BuildingMassGenerator} from '../logic/generators/BuildingMassGenerator';
import {GenerationManager} from '../logic/GenerationManager';
import { BoxGeometry, Mesh, MeshPhongMaterial, Vector2 } from 'three';
  
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

onmessage = (event) => {
  if( event.data.type == 'onProcess'){
    const bldMassGen = new BuildingMassGenerator();
    // const model_mesh = bldMassGen.generateVariant(mock_inputs);
  
    const genManager = new GenerationManager(bldMassGen, 'randomize', [], 2)
    genManager.populate(mock_inputs);

  }
  // postMessage('helokojm');
};