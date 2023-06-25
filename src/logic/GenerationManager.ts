import {Generator} from './generators/Generator';
import {Model} from './Model';



export class GenerationManager {
    
    private populations: number;
    private generations: number;
    private strategy: string;
    private generator: Generator;
    private models: any[] = [];
    private resuls = {};

    constructor( generator: Generator,
                 strategy: string,
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

    private populate(){
        if( this.populations == 0 || this.generations == 0 ) return;

        for( let i = 0; i < this.populations; i++ ){
            this.generator.evaluate();
            let model = this.generator.getModel();
            this.models.push(model);
        }
    }

    private computeFitness() {
        this.models.forEach( model => {
            let goal = model.outputs.goal;

            
        })

    }

    private matePool() {}

}

/*
model - is the object holding inputs, and evalution outputs 
model = {
    inputs: {'':''},
    outputs: [
        {
            goal: max | min | unedfined,
            propName: '',
            fitness: 0.1,
        },
        {}
    ]
}

*/