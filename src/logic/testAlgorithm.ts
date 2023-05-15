import { StudyType } from '../types/ResultTypes';
import {BoxInputType} from '../types/InputTypes';
import { v4 as uuidv4 } from 'uuid';
import { Generator } from '../enums/Generator';
import { Strategy } from '@/enums/Strategy';
import {VariationType} from '../types/ResultTypes'

export class TestAlgorithm {

    private populations: number;
    private seed: number;
    private inputs: BoxInputType;
    private variations: any[] = [];
    public study: StudyType;
    private generator: string = Generator.BoxGenerator;
    private strategy: string;
    private studyData: any[] = []


    constructor( data: any ) {
        this.populations = data.populations;
        this.seed = 0;
        this.inputs = data.inputs
        const id = uuidv4();
        this.generator = Generator.BoxGenerator;
        this.strategy = data.strategy;
        
        this.study = { 
            id, 
            generator: this.generator, 
            strategy: this.strategy, 
            data: this.studyData 
        }
    }

    public process() {
        if ( this.populations == 0 || !this.inputs.width ) return this.study;
        
        for ( let i = 0; i < this.populations; i++ ) {
            let variation: VariationType;

            const inputs = this.generateBox(this.inputs);
            const outputs = this.evaluate( inputs );
            const id = uuidv4();
            variation = {
                id,
                generator: this.generator,
                strategy: this.strategy,
                genPop: `0_${i}`,
                inputs,
                outputs
            }
            this.study.data.push(variation)
        }

        return this.study;

    }

    private generateBox( inputs: any ) {
        // const random = (min, max) => Math.floor(Math.random() * (max - min)) + min; // Alternative way
        let randomValues: any = {}; 

        for (let input in inputs) {
            if ( inputs[input]['type'] == 'variable' ) {
                const min = inputs[input]['value'][0];
                const max = inputs[input]['value'][1];
                let difference = max - min;
                let rand = Math.random();
                rand = Math.floor( rand * difference);
                rand = rand + min;
                randomValues[input] = rand;

            } else {
                randomValues[input] = inputs[input]['value'];
            }

        }
        
        console.log('GENERATOR: ', randomValues);

        return randomValues;
    }

    private evaluate( inputs: any ) {
        const surface_area_1 = inputs.width * inputs.height * 2;
        const surface_area_2 = inputs.length * inputs.height * 2;
        const surface_area = surface_area_1 + surface_area_2;
        const volume = inputs.width * inputs.length * inputs.height;
        const base_area = inputs.width * inputs.length;
        
        return {
            surface_area,
            volume,
            base_area
        }
    }

    // public clearTest() {
    //     this.outputs = [];
    //     this.outputs.length = 0;
    // }


}