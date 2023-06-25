import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';


// import Vue from 'vue';
// const EventBus = new Vue();
// import {MassGenerator} from './logic/generators/MassGenerator'
// const mg = new MassGenerator();

const app = createApp(App);
app.use(naive);
app.use(PrimeVue);

import Button from "primevue/button"
import TabView from "primevue/tabview"
import TabPanel from "primevue/tabpanel"
app.component('Button', Button);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);


app.use(createPinia());
app.mount('#app');