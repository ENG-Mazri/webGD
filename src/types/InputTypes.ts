import { Color } from 'three';

export type BoxInputType = {
    width: number;
    height: number;
    length: number;
    // color: Color | undefined; 
}

export type BuildingMassInputType = {
    siteWidth: number;
    siteLength: number;
    siteOffset: number;
    buildingHeight: number;
    floorHeight: number;
    // color: Color | undefined;
}

export type LayoutInputType = {}