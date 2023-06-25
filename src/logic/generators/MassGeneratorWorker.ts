const w: Worker = self as any;

// addEventListener('message', e => {

// console.log("[MG worker]: ", e)


// })

self.onmessage = (e)=>{
    console.log("[MG worker]: ", e.data)

}