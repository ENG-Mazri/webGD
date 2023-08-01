import {Generator} from './generators/Generator';
import {Model} from './Model';
import {Mesh} from 'three';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter.js'
import { v4 as uuidv4 } from 'uuid';
import {IDB} from '../IDB'

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
    public model: Mesh;
    private varsData: any[] = [];
    private objectives: any[] = [];
    private resultsByEvaluator = new Map<string, number[]>(); 
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

        for (let i = 0; i < generator.objectives.length; i++)
            this.resultsByEvaluator.set(generator.objectives[i], []);

        // console.log('[GenManager: results]', this.resultsByEvaluator)
    }

    init(){}

    process(){}

    public getResultsByEvaluator(){
        return this.resultsByEvaluator;
    }

    public getVarsData(){
        return this.varsData;
    }

    public populate(inputs: any, options: any, index: number) {
        if( this.populations == 0 || this.generations == 0 ) return;

        let varData = this.generator.generateVariant(inputs, options.transX, options.transY, index);
        
        this.varsData.push(varData);

        for ( let [key, value] of Object.entries(varData.outputs)){
            this.resultsByEvaluator.get(key).push(value as number);

        }
        // console.log('[GenManager: output]', this.resultsByEvaluator)

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

    public async getGlbFromGeneration( generationModel:Mesh, generationModelId: string ){
        const gltfExporter = new GLTFExporter();
        let data: Blob;
        await IDB.clearStorageAsync();
        gltfExporter.parse( generationModel, async (glb) => {
                data = new Blob([new Uint8Array( await glb as ArrayBuffer, 0, glb.byteLength)]);
                // let _data = btoa(
                //     new Uint8Array(glb as ArrayBuffer)
                //       .reduce((data, byte) => data + String.fromCharCode(byte), '')
                //   );
                // await IDB.saveDataAsync( data, 'glb');
                await IDB.saveDataAsync( data, 'glb');

                console.log('[GenerationManager:Glb]: ', data)

                // localStorage.setItem(`gd_glb-${generationModelId}`, JSON.stringify(gltf) )
            },
            (err: ErrorEvent)=>{
                console.log('[Error]: ', err)
            },
            { binary: true }
        )

    }

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