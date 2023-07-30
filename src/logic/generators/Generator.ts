import { Model } from "../Model";

export abstract class Generator {

    private seed: number;
    private inputs: any;
    private outputs: any = [];
    // abstract evaluate(); //: Model; 
    public getVariant = (): any => {};
    
}