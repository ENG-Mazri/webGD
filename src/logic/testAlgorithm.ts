import {InputParameters} from '../types/inputsParameters.js';
import { v4 as uuidv4 } from 'uuid';

export class TestAlgorithm {

    private generations: number;
    private seed: number;
    private inputs: any;
    public outputs: any = [];

    constructor( data: InputParameters ) {
        this.generations = data.generations;
        this.seed = 0;
        this.inputs = data.inputs
    }

    public process() {
        if ( this.generations == 0 || !this.inputs.width ) return this.outputs;

        for ( let i = 0; i < this.generations; i++ ) {
            const inputs = this.generateBox(this.inputs);
            const {surface_area,volume} = this.evaluate( inputs );
            const id = uuidv4();
            this.outputs.push({ id, surface_area, volume, inputs});
            console.log('Output: ', { id, surface_area, volume, inputs});
        }

        console.log('Output: ', this.outputs);
        return this.outputs;

    }

    private generateBox( inputs: any ) {
        // const random = (min, max) => Math.floor(Math.random() * (max - min)) + min; // Alternative way
        let randomValues: any = {}; 

        for (let input in inputs) {
            console.log('GENERATOR: inputs - ', inputs[input]);
            const min = inputs[input].range[0];
            const max = inputs[input].range[1];
            let difference = max - min;
            let rand = Math.random();
            rand = Math.floor( rand * difference);
            rand = rand + min;
            randomValues[input] = rand;

        }
        

        return randomValues;
    }

    private evaluate( inputs: any ) {
        const surface_area_1 = inputs.width * inputs.height * 2;
        const surface_area_2 = inputs.length * inputs.height * 2;
        const surface_area = surface_area_1 + surface_area_2;
        const volume = inputs.width * inputs.length * inputs.height
        
        return {
            surface_area,
            volume
        }
    }

    public clearTest() {
        this.outputs = [];
        this.outputs.length = 0;
    }


}