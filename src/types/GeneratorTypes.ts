import { Color } from 'three';

export type BoxGeneratorInput = {
    width: number;
    height: number;
    length: number;
    color: Color | undefined; 
}

export type MassGeneratorInput = {
    siteWidth: number;
    siteLength: number;
    siteOffset: number;
    buildingHeight: number;
    floorHeight: number;
    color: Color | undefined;
}

export type LayoutGeneratorInput = {}