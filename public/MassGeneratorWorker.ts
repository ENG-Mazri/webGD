const w: Worker = self as any;

// addEventListener('message', e => {

// console.log("[MG worker]: ", e)


// })

addEventListener('message', async e => {
    console.log("[MG: worker] ", e.data)

})

// export class GeneratorWorker extends Worker{
//     constructor(){
//         super()
//         this.addEventListener('message', async e => {
//             console.log("[MG: worker] ", e.data)
        
//         })
//     }
// }