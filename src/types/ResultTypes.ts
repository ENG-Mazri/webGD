import { Generator } from '../enums/Generator';
import { Strategy } from '../enums/Strategy';
import { BoxInputType, BuildingMassInputType, LayoutInputType } from './InputTypes'
import { BoxEvaluatorType, BuildingMassEvaluatorType, LayoutEvaluatorType } from './EvaluatorTypes'

export type StudyType = {
    id: string,
    generator: Generator,
    strategy: Strategy,
    data: any               // data: {
}                           //   generation_0: {
                            //    population_0: [{VariationType},{VariationType},...],
                            //    population_1: [{VariationType},{VariationType},...],
                            //    ...
                            //   }
                            //  }

export type VariationType = {
    id: string,
    generator: Generator,
    strategy: Strategy,
    genPop: string,
    inputs: BoxInputType | BuildingMassInputType | LayoutInputType,
    outputs: BoxEvaluatorType | BuildingMassEvaluatorType | LayoutEvaluatorType
}