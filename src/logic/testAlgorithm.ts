import {InputParameters} from '../types/inputsParameters.js'

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
            const outputs = this.evaluate( inputs );
            this.outputs.push(outputs);
        }

        // console.log('Output: ', this.outputs);
        return this.outputs;

    }

    private generateBox( inputs: any ) {
        // const random = (min, max) => Math.floor(Math.random() * (max - min)) + min; // Alternative way
        let randomValues: any = {}; 

        for (let input in inputs) {
            const min = inputs[input].range[0];
            const max = inputs[input].range[1];
            let difference = max - min;
            let rand = Math.random();
            rand = Math.floor( rand * difference);
            rand = rand + min;
            randomValues[input] = rand;

        }
        console.log('Random values: ', randomValues);

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