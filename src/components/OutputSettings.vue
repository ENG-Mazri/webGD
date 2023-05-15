<template>
<div class='inputs'>
    <n-divider title-placement="left">
        X axis
    </n-divider>
    <n-select id='outputs' :options="outputs" v-model:value="output"/>
    <n-divider title-placement="left">
        Y axis
    </n-divider>
    <n-select id='outputs' :options="outputs" v-model:value="output"/>
    <n-divider title-placement="left">
        Size
    </n-divider>
    <n-select id='outputs' :options="outputs" v-model:value="output"/>
    <n-divider title-placement="left">
        Color
    </n-divider>
    <n-select id='outputs' :options="outputs" v-model:value="output"/>
</div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {useDesign} from '../store/design';
import { LogOutOutline as outputIcon} from '@vicons/ionicons5';


export default defineComponent({
    components: {
        outputIcon
    },
    data(){
        return {
            outputs: [],
            output:''
        }
    },
    setup () {
    },
    created (){},
    mounted() {
        this.store = useDesign();
    },
    methods: {
    }
})
</script>