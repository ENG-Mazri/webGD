import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import router from './router'

// import Vue from 'vue';
// const EventBus = new Vue();
//@ts-ignore
// import {MassGenerator} from './logic/generators/MassGenerator'
// const mg = new MassGenerator();
// console.log()

// import VueWorker from 'vue-worker';


const app = createApp(App);
app.use(naive);
app.use(PrimeVue);
// app.use(VueWorker);


import Button from "primevue/button"
import TabView from "primevue/tabview"
import TabPanel from "primevue/tabpanel"
import { BoxGenerator } from './logic/generators/BoxGenerator';
app.component('Button', Button);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);

app.use(router)
app.use(createPinia());
app.mount('#app');

//todo: tst rearrangr array max min 
let array = [9,
    18.6,
    16.2,
    20.9,
    34.8];
let array2 = [...array]
let outputMax = [];

// for( let i = 0; i < array.length; i++){
//     let v = Math.round(array[i])
//     for( let j = 0; j < v; j++){
//         outputMax.push(array[i])
//     }
// }

// // console.log(outputMax)

// let outputMin = [];

// for( let i = 0; i < array.length; i++){
//     let v = Math.round(array[ array2.length - 1])
//     for( let j = 0; j < v; j++){
//         outputMin.push(array[i])
//     }
//     array2.pop()
// }


// let randomMax = outputMax[Math.floor(Math.random() * outputMax.length)];
// let randomMin = outputMin[Math.floor(Math.random() * outputMin.length)];

// console.log('Max: ', randomMax)
// console.log('Min: ', randomMin)


// import * as d3 from "d3";

// (async () =>{
//     const svg = await d3.svg("/contour.svg");
    
//     console.log('[SVG] ', svg);

// })();