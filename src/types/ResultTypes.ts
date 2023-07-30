import { Generator } from '../enums/Generator';
import { Strategy } from '../enums/Strategy';
import { BoxInputType, BuildingMassInputType, LayoutInputType } from './InputTypes'
import { BoxEvaluatorType, BuildingMassEvaluatorType, LayoutEvaluatorType } from './EvaluatorTypes'

export type StudyType = {
    id: string,
    generator: string,
    strategy: string,
    data: any               // data: {
}                           //   generation_0: {
                            //    population_0: [{VariationType},{VariationType},...],
                            //    population_1: [{VariationType},{VariationType},...],
                            //    ...
                            //   }
                            //  }

export type VariationType = {
    id: string,
    generator: string,
    strategy: string,
    genPop: string,
    inputs: BoxInputType | BuildingMassInputType | LayoutInputType,
    outputs: BoxEvaluatorType | BuildingMassEvaluatorType | LayoutEvaluatorType
}