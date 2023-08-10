import {Vector2} from 'three'

// class Vector2 {

//     x: number;
//     y: number;

//     constructor(x: number = 0, y: number = 0){
//         this.x = x;
//         this.y = y;
//     };
// }


export class SVGTools {

    static parsePath(path: string): Vector2[]{
        const POSITIONS = [];


        const CHARS = ['L', 'H', 'V'];
        const PARTS = []; 
        const COORDINATES = [];

        for( let i = 0; i < CHARS.length; i++ ){
            let pos = 0;
            let target = CHARS[i];
            while (true) {
                let foundPos = path.indexOf(target, pos);
                if (foundPos == -1) break;
                POSITIONS.push(foundPos)

                pos = foundPos + 1;
            }
        }

        POSITIONS.sort( ( a , b) => {
            if(a > b) return 1;
            if(a < b) return -1;
            return 0;
        });


        let pos = 0;
        for( let i = 0; i < POSITIONS.length; i++ ){
            PARTS.push( path.slice(pos, POSITIONS[i]) );
            pos = POSITIONS[i];

            if( i == POSITIONS.length - 1 ) PARTS.push( path.slice(pos) );
        }

        if (PARTS[ PARTS.length - 1 ].endsWith('Z') ) {
            const last = PARTS[ PARTS.length - 1 ].replace('Z', '');
            PARTS.pop();
            PARTS.push( last );
        }


        let last_x: any;
        let last_y: any;
        for( let i = 0; i < PARTS.length; i++ ){
            let start: string = PARTS[i].charAt(0);

            switch (start) {
                case "M":
                    let Mx = PARTS[i].slice( PARTS[i].indexOf('M') + 1, PARTS[i].indexOf(' '));
                    let My = PARTS[i].slice( PARTS[i].indexOf(' '));
                    last_x = Mx;
                    last_y = My;

                    COORDINATES.push( new Vector2(parseInt(Mx), parseInt(My)) );                     
                    break;
                case "H":
                    let Hx = PARTS[i].replace(' ', '').split('H')[1];
                    COORDINATES.push( new Vector2( parseInt(Hx), parseInt(last_y)) );
                    last_x = Hx;
                    
                    break;
                case "V":
                    let Vy = PARTS[i].replace(' ', '').split('V')[1];
                    COORDINATES.push( new Vector2(parseInt(last_x) , parseInt(Vy)) );
                    last_y = Vy;
                    break;
                case "L":
                    let Lx = PARTS[i].slice( PARTS[i].indexOf('L') + 1, PARTS[i].indexOf(' '));
                    let Ly = PARTS[i].slice( PARTS[i].indexOf(' '));
                    COORDINATES.push( new Vector2(parseInt(Lx) , parseInt(Ly)) );
                    last_x = Lx;
                    last_y = Ly;
                    break;
                default:
                    break;
            }

        }

        return COORDINATES;
    }

}