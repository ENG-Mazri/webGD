import {Generator} from './generators/Generator';
import {Model} from './Model';

type Result = {
    values: number[],
    max: number;
    min: number;
}

type Objective = {
    outputName: string,
    goal: string
}


export class GenerationManager {
    
    private populations: number;
    private generations: number;
    private strategy: string;
    private generator: Generator;
    private variants: any[] = [];
    private results = new Map<string,Result>();
    // private sortedResults = 

    constructor( generator: Generator,
                 strategy: string,
                 objectives: Objective[],
                 populations: number,
                 generations: number = 1 )
    {
        this.populations = populations;
        this.generations = generations;
        this.generator = generator;
        this.strategy = strategy;
    }

    init(){}

    process(){}

    private populate() {
        if( this.populations == 0 || this.generations == 0 ) return;

        for( let i = 0; i < this.populations; i++ ){
            this.generator.evaluate();
            let variant = this.generator.getVariant();
            this.variants.push(variant);
        }
    }

    private getResults() {

        this.variants.forEach( variant => {
            let prop = this.results.get(variant.outputs.propName);

            if( prop ) prop.values.push(variant.outputs.propValue);
            else this.results.set(variant.outputs.propName, {
                values: [variant.outputs.propValue],
                max: 0,
                min: 0
            });
        })
    }

    private computeFitness() {
        this.variants.forEach( variant => {
            let goal = variant.outputs.goal;
            let max = this.results.get(variant.outputs.propName).max;
            let min = this.results.get(variant.outputs.propName).min;
            let value = variant.outputs.propValue;

            switch (goal) {
                case 'max':
                    variant.fitness =  (value - min) / (max - min);
                    break;
                case 'min':
                    variant.fitness =  1 - (value - min) / (max - min);
                    break;        
                default:
                    break;
            }
        })

    }

    private computeMaxMin() {
        for (let result of this.results.values()) {
            result.max = Math.max(...result.values);
            result.min = Math.min(...result.values);
        }
    }

    private runMatingPool() {}

}

/*
variant - is the object holding inputs, and evalution outputs.

variant = {
    inputs: { '' : '' },
    outputs: [
        {
            goal: '',
            propName: '',
            propValue: 232,
            fitness: 0.1,
        },
        {}
    ]
}

objective = [
    {
        outputName: '',
        goal: max | min
    }
]
*/