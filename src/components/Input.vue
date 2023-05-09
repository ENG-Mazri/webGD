<template>
    <div class='input'>
        <n-space vertical>
            <n-input id='input_name' ref='input' v-model="inputName" @input="inputName($event)" type="text" placeholder="Input's name" clearable />
            <n-select id='input_type' v-model="input_type" :options="inputTypes" default-value="Continuous" placeholder='Input types'/>
            <n-input
                id='input_value'
                v-model="input_value"
                pair
                separator="-"
                :placeholder="['Min', 'Max']"
                clearable
                @input="inputData($event)"
            />

            <n-button type="warning" @click='saveInput' dashed>
                Save
            </n-button>

        </n-space>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {useDesign} from '../store/design'
// import { } from '@vicons/ionicons5';

export default defineComponent({
    name: 'InputVue',
    setup () {
    },
    data() {
        return {
            inputTypes: [{
                    label: 'Discrete',
                    value: 'Discrete'
                },
                {
                    label: 'Continuous',
                    value: 'Continuous'
                },
                {
                    label: 'Permutation sequences',
                    value: 'Permutation sequences'
                }
            ],
            store: '' as any,
            input_name: null,
            input_type: 'Continuous',
            input_data: null
            
        }
    },
    mounted() {
        this.store = useDesign();

    },
    watch: {
        // inputName() {
        //     console.log("TEST", this.inputName)
        // }
    },
    methods: {
        saveInput() {
            if(this.input_data && this.input_name){
                const min = this.input_data[0];
                const max = this.input_data[1];

                this.store.design[this.input_name] = { type: this.input_type, range: [min, max] }

            }
            console.log("Data", )
        },
        inputData($event) {
            this.input_data = $event;
        },
        inputName($event){
            this.input_name = $event;
        },
        inputType($event){
       
        }
    }
})
</script>

<style>
.input{
    background-color: #9cabb4;
    padding: 5px;
    margin: 3px 0px;
}
</style>