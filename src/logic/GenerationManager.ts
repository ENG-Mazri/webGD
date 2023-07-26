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
    private generator: any; //Generator;
    public variants: any[] = [];
    private results = new Map<string,Result>();
    // private sortedResults = 

    constructor( generator: any,
                 strategy: string,
                 objectives: Objective[],
                 populations: number = 1,
                 generations: number = 1 )
    {
        this.populations = populations;
        this.generations = generations;
        this.generator = generator;
        this.strategy = strategy;
    }

    init(){}

    process(){}

    public populate(inputs: any) {
        if( this.populations == 0 || this.generations == 0 ) return;

        let transX = 0;
        let transY = 0;
        let pos = 0;
        for( let i = 0; i < this.populations; i++ ){
            let var_mesh = this.generator.generateVariant(inputs, transX, transY);
            // this.generator.evaluate();
            pos += 1;
            transX += 100;
            if( pos == 4){
                pos = 0;
                transX = 0;
                transY += 200;
            }
            
            // transY += 100;
            this.variants.push(var_mesh);
        }
        console.log('[Variants]: ', this.variants);
    }

    private getResults() {

        this.variants.forEach( variant => {
            let evaluator = this.results.get(variant.outputs.evalName);

            if( evaluator ) evaluator.values.push(variant.outputs.evalValue);
            else this.results.set(variant.outputs.evalName, {
                values: [variant.outputs.evalValue],
                max: 0,
                min: 0
            });
        })
    }

    public computeFitness() {
        this.variants.forEach( variant => {
            let goal = variant.outputs.goal;
            let max = this.results.get(variant.outputs.evalName).max;
            let min = this.results.get(variant.outputs.evalName).min;
            let value = variant.outputs.evalValue;

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

    public computeMaxMin() {
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
            goal: 'max' | 'min' | 'undefined',
            evalName: '',
            evalValue: 232,
            fitness: 0.1,
        },
        {}
    ]
}

//* from inputs panel
objective = [
    {
        outputName: '',
        goal: max | min
    }
]
*/