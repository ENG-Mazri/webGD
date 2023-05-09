import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import { createPinia } from 'pinia'

// import Vue from 'vue';
// const EventBus = new Vue();

const app = createApp(App);
app.use(naive);
app.use(createPinia());
app.mount('#app');