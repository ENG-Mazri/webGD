<template>
<div class='inputs'>
    <n-divider title-placement="left">
        X axis
    </n-divider>
    <n-select id='outputs' :options="outputOptions" v-model:value="x_axis"/>
    <n-divider title-placement="left">
        Y axis
    </n-divider>
    <n-select id='outputs' :options="outputOptions" v-model:value="y_axis"/>
    <n-divider title-placement="left">
        Size
    </n-divider>
    <n-select id='outputs' :options="outputOptions" v-model:value="size"/>
    <n-divider title-placement="left">
        Color
    </n-divider>
    <n-select id='outputs' :options="outputOptions" v-model:value="color"/>
</div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {useDesign} from '../store/design';
import { LogOutOutline as outputIcon} from '@vicons/ionicons5';
import {show_chart_event} from '../events/index'

export default defineComponent({
    props:{
        outputOptions: []
    },
    components: {
        outputIcon
    },
    data(){
        return {
            outputs: [],
            output:'',
            x_axis: null,
            y_axis: null,
            size: null,
            color: null,
            outputOptions: [
                {
                    label: 'exteriorArea',
                    value: 'exteriorArea'
                },
                {
                    label: 'facadeArea',
                    value: 'facadeArea'
                },
                {
                    label: 'podiumVolume',
                    value: 'podiumVolume'
                },
                {
                    label: 'totalBuildingArea',
                    value: 'totalBuildingArea'
                },
                {
                    label: 'towerVolume',
                    value: 'towerVolume'
                },
            ]
        }
    },
    setup () {
    },
    created (){},
    watch:{
        x_axis(){
            localStorage.setItem('gd_d3', JSON.stringify({
                x_axis: this.x_axis,
                y_axis: this.y_axis,
                size: this.size,
                color: this.color
            }));
        },
        y_axis(){
            localStorage.setItem('gd_d3', JSON.stringify({
                x_axis: this.x_axis,
                y_axis: this.y_axis,
                size: this.size,
                color: this.color
            }));
        },
        size(){
            localStorage.setItem('gd_d3', JSON.stringify({
                x_axis: this.x_axis,
                y_axis: this.y_axis,
                size: this.size,
                color: this.color
            }));
        },
        color(){
            localStorage.setItem('gd_d3', JSON.stringify({
                x_axis: this.x_axis,
                y_axis: this.y_axis,
                size: this.size,
                color: this.color
            }));
        }
    },
    mounted() {
        this.store = useDesign();
        // console.log("OUTPUT ", this.outputOptions);

        const gd_resultsByEvaluator = JSON.parse(localStorage.getItem('gd_resultsByEvaluator') );


        // const GD_d3 = {
        //   x_axis: Object.keys(gd_resultsByEvaluator)[0],
        //   y_axis: Object.keys(gd_resultsByEvaluator)[1],
        //   size: Object.keys(gd_resultsByEvaluator)[2],
        //   color: Object.keys(gd_resultsByEvaluator)[3]
        // };
        if( gd_resultsByEvaluator ){
            this.x_axis = Object.keys(gd_resultsByEvaluator)[0];
            this.y_axis = Object.keys(gd_resultsByEvaluator)[1];
            this.size = Object.keys(gd_resultsByEvaluator)[2];
            this.color = Object.keys(gd_resultsByEvaluator)[3];
            // window.dispatchEvent(show_chart_event)            
        }

        // localStorage.setItem('gd_d3', JSON.stringify({
        //     x_axis: this.x_axis,
        //     y_axis: this.y_axis,
        //     size: this.size,
        //     color: this.color
        // }));
    },
    methods: {
    }
})
</script>