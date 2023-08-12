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
    private objectives = new Map<string, string>(); 
    private resultsByEvaluator = new Map<string, number[]>(); 

    private evalMaxMin = new Map<string, any>(); 
    // private sortedResults = 

    constructor( generator: any,
                 strategy: string,
                 objectives: any,
                 populations: number = 1,
                 generations: number = 1 )
    {
        this.populations = populations;
        this.generations = generations;
        this.generator = generator;
        this.strategy = strategy;
        this.objectives = objectives;



        // console.log('[GenManager: results]', this.resultsByEvaluator)
    }

    init(){}

    process(){}

    public prepareDataStores(){
        for (let i = 0; i < this.generator.objectives.length; i++)
            this.resultsByEvaluator.set(this.generator.objectives[i], []);
    }

    public getResultsByEvaluator(){
        return this.resultsByEvaluator;
    }

    public getVarsData(){
        return this.varsData;
    }

    public populate(inputs: any, options: any, index: number, genNum: number, isNextGeneration: boolean = false) {
        if( this.populations == 0 || this.generations == 0 ) return;

        let varData = this.generator.generateVariant(inputs, options.transX, options.transY, index, genNum);
        
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

    public computeFitness( varsData: any[], evalMaxMin: Map<string,any> ) {
        const varsFitness = new Map<string, any>();

        varsData.forEach( varData => {
            const varOutputs = {};

            for( let [output, value] of Object.entries(varData.outputs) ){
                let goal = this.objectives.get(output);
                let max = evalMaxMin.get(output).max;
                let min = evalMaxMin.get(output).min;

                switch (goal) {
                    case 'max':
                        varOutputs[output] = (value as number - min) / (max - min);
                        break;
                    case 'min':
                        varOutputs[output] = 1 - (value as number - min) / (max - min);
                        break;   
                    case 'undefined':
                        varOutputs[output] = -1;
                        break;                
                    default:
                        break;
                }
            }
            varsFitness.set( varData.id, varOutputs)
        })

        return varsFitness;
    }

    public computeFitnessMain( varsData: any[], evalMaxMin: Map<string,any>, resultsByEvaluator:  Map<string,number[]> ) {
        //** This function gets the percentage of vars fitness, higher value if goal, is max is the fittest, if goal is min, then it's the less fit **/
        const varsFitness = new Map<string, any>();
        const outputsWeight = this.calculateOutputsWeight(resultsByEvaluator);
        console.log('[GenManager: weights] ', outputsWeight)

        const chancesByEval = new Map<string, any[]>();
        const evalsChancesTest = new Map<string, number[]>()

        const realOne = new Map()


        varsData.forEach( varData => {
            const varOutputs = {};
            // const realOne = new Map()
            const percentageById = {}


            for( let [output, value] of Object.entries(varData.outputs) ){
                let percentage = value as number / outputsWeight[output] * 100;
                varOutputs[output] = percentage
            
                if (chancesByEval.has(output)) chancesByEval.get(output).push(varData.id);
                else chancesByEval.set(output, [varData.id]);
                
                if (evalsChancesTest.has(output)) evalsChancesTest.get(output).push(percentage);
                else evalsChancesTest.set(output, [percentage]);

                if (realOne.has(output)) realOne.get(output)[percentage] = varData.id;
                else realOne.set(output, {[percentage]: varData.id});
            }
            varsFitness.set( varData.id, varOutputs)
        })

        for( let [evaluator, values] of evalsChancesTest.entries() ){
            values.sort( function( a , b){
                if(a > b) return 1;
                if(a < b) return -1;
                return 0;
            });
            evalsChancesTest.set(evaluator , values)
        }

        const mergedChances = [];

        for( let [output, percentages] of chancesByEval.entries()){
            let goal = this.objectives.get(output);
            console.log('[Goal] ', goal)

            mergedChances.push(...this.ganarateFitnessArrayById( evalsChancesTest.get(output), goal, realOne.get(output), output ));
            // console.log(`[Genartaor:Goal: ${output}] `, array)

        }
        // console.log('[Generator: sort chances] ', realOne)



        return mergedChances;
    }

    public computeMaxMin( resultsBylEval: any ) {
        for (let [output, values]  of resultsBylEval.entries()) {
            let max = Math.max( ...values );
            let min = Math.min( ...values );
            this.evalMaxMin.set( output, {max, min} );
        }
        return this.evalMaxMin;
    }

    public calculateOutputsWeight( resultsBylEval: any ){
        let outputsFitness = {};
        for (let [output, values]  of resultsBylEval.entries()) {
            outputsFitness[output] = values.reduce((a, b) => a + b, 0);
        }

        return outputsFitness;
    }

    private ganarateFitnessArrayById( array: any[] , goal: string, chancesByEval : any, evaluator: string){
        let output = [];

        const tempArray = [...array];

        // console.log('[FITNESS: array] ', array)
        // console.log('[FITNESS: chance id ] ', chancesByEval)


        switch (goal) {
            case 'max':
                for( let i = 0; i < array.length; i++){
                    let v = chancesByEval[array[i]]
                    // console.log('[FITNESS: V] ', v)
                    for( let j = 0; j < Math.round(array[i]); j++){
                        output.push(v)
                    }
                }
                break;
        
            case 'min':
                for( let i = 0; i < array.length; i++){
                    let v = chancesByEval[array[ tempArray.length - 1]]
                    // console.log('[FITNESS: V] ', v)
                    for( let j = 0; j < Math.round(array[ tempArray.length - 1]); j++){
                        output.push(v)
                    }
                    tempArray.pop()
                }
                break;
            default:
                break;
        }

        return output;
    }

    public pickParents( parents: any[], chancesArray: string[] ){
        let parent1 = chancesArray[Math.floor(Math.random() * chancesArray.length)];
        let parent2 = chancesArray[Math.floor(Math.random() * chancesArray.length)];
        let parentsID = `${parent1}_${parent2}`;
        let reversed = `${parent2}_${parent1}`;

        if(!parents.includes(parentsID) && !parents.includes(reversed) && parent1 !== parent2 )
            return parents.push(parentsID);
        else {
            this.pickParents(parents, chancesArray)
        }
    }

    public runMatingPool( parentsIDs: string[] ) {
        // get parents id_id, mate them by picking random midpoint 
        const parents = []
        for( let i = 0; i < parentsIDs.length; i++){
            let newDNA = {}
            let parents = [];

            let [id1, id2] = parentsIDs[i].split('_');
            for( let i=0; i < this.varsData.length; i++){
                let varData = this.varsData[i];

                if( varData.id == id1 || varData.id == id2 ) parents.push(varData);
            }
            console.log('[parents] ', parents);
        }

    }

    public async getGlbFromGeneration( generationModel: Mesh, genNum: number, generationModelId: string ){
        const gltfExporter = new GLTFExporter();
        let data: Blob;
        // await IDB.clearStorageAsync();
        gltfExporter.parse( generationModel, async (glb) => {
                data = new Blob([new Uint8Array( await glb as ArrayBuffer, 0, glb.byteLength)]);
                // let _data = btoa(
                //     new Uint8Array(glb as ArrayBuffer)
                //       .reduce((data, byte) => data + String.fromCharCode(byte), '')
                //   );
                // await IDB.saveDataAsync( data, 'glb');
                await IDB.saveDataAsync( data, `glb_${genNum + 1}`);

                console.log('[GenerationManager:Glb]: ', data)

                // localStorage.setItem(`gd_glb-${generationModelId}`, JSON.stringify(gltf) )
            },
            (err: ErrorEvent)=>{
                console.log('[Error]: ', err)
            },
            { binary: true }
        )

    }

    public clearGenerationData(){
        this.resultsByEvaluator.clear();
        this.evalMaxMin.clear();
        this.varsData = [];
        this.model = undefined;
    }

}