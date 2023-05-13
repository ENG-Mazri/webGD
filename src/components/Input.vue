<template>
    <div class='inputs'>
        <n-space vertical>
            <!-- <n-input id='input_name' ref='input' v-model:value="input_name" type="text" placeholder="Input's name" clearable />
            <n-select id='input_type' v-model:value="input_type" :options="inputTypes" default-value="Sequence" placeholder='Input types'/>
            <n-input v-if="input_type == 'Sequence'"
                id='input_value'
                v-model:value="input_data"
                pair
                separator="-"
                :placeholder="['Min', 'Max']"
                clearable />
            <n-input-number clearable 
                v-if="input_type == 'Fixed'"
                :precision="0" min="1" max="10"  
                v-model:value="input_data"
                placeholder="Input's value" />

            <n-upload v-if="input_type == 'File'">
                <n-button ghost color="#a2588f">Upload .svg</n-button>
            </n-upload> -->

            <!-- <n-button type="warning" @click='saveInput' >
                Save input
            </n-button> -->
            <!-- // TODO: new way considering generator function-->
            <!-- <div class="input">
                
                <n-input-number clearable 
        
                    :precision="0" min="1" max="10"  
                    v-model:value="input_data"
                    placeholder="Input's value" />
            </div> -->
            <n-space class="input">
                <h4 class="input_label">Width</h4>
                <n-space align="center" justify="space-between" inline>
                    <n-switch v-model:value="fixed_width" :rail-style="railStyle">
                        <template #checked>
                        fixed
                        </template>
                        <template #unchecked>
                        var
                        </template>
                    </n-switch>
                    <n-input-number v-if="fixed_width" :disabled="disabled" class="input"/>
                    <n-input v-if="!fixed_width"
                        class="input"
                        id='input_value'
                        v-model:value="input_data"
                        pair
                        separator="-"
                        :placeholder="['Min', 'Max']"
                        clearable />
                </n-space>
            </n-space>
            <n-space class="input">
                <h4 class="input_label">Height</h4>
                <n-space align="center" justify="space-between" inline>
                    <n-switch v-model:value="fixed_height" :rail-style="railStyle">
                        <template #checked>
                        fixed
                        </template>
                        <template #unchecked>
                        var
                        </template>
                    </n-switch>
                    <n-input-number v-if="fixed_height" :disabled="disabled" class="input"/>
                    <n-input v-if="!fixed_height"
                        class="input"
                        id='input_value'
                        v-model:value="input_data"
                        pair
                        separator="-"
                        :placeholder="['Min', 'Max']"
                        clearable />
                </n-space>
            </n-space>


        </n-space>
    </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, ref } from 'vue';
import {useDesign} from '../store/design'
// import { } from '@vicons/ionicons5';

export default defineComponent({
    name: 'InputVue',
    props: {
        function: String
    },
    setup () {
    return {
      railStyle: ({
        focused,
        checked
      }: {
        focused: boolean
        checked: boolean
      }) => {
        const style: CSSProperties = {}
        if (checked) {
          style.background = '#a2588f'
           if (focused) {
            style.boxShadow = '0 0 0 2px #d0305040'
          }

        } else {
          style.background = '#153048'
           if (focused) {
            style.boxShadow = '0 0 0 2px #2080f040'
          }
        }
        return style
      }
    }
  },
    data() {
        return {
            inputTypes: [
                // {
                //     label: 'Discrete',
                //     value: 'Discrete'
                // },
                // {
                //     label: 'Continuous',
                //     value: 'Continuous'
                // },
                {
                    label: 'Sequence',
                    value: 'Sequence'
                },
                {
                    label: 'Fixed',
                    value: 'Fixed'
                },
                {
                    label: 'File',
                    value: 'File'
                }
            ],
            store: '' as any,
            input_name: null,
            input_type: 'Sequence',
            input_data: null,
            fixed_width: true,
            fixed_height: true
            
        }
    },
    mounted() {
        this.store = useDesign();
        console.log("Function: ", this.function)

    },
    watch: {
        // input_type() {
        //     console.log("Input Type: ", this.input_type)
        // },
        // input_name() {
        //     console.log("Input Type: ", this.input_name)
        // },
        // input_data() {
        //     console.log("Input Type: ", this.input_data)
        // }
    },
    methods: {
        saveInput() {
            if(this.input_data && this.input_name){
                if ( Array.isArray(this.input_data) ) {
                    const min = this.input_data[0];
                    const max = this.input_data[1];
    
                    this.store.design[this.input_name] = { type: this.input_type, range: [min, max] }
                } else {
                    this.store.design[this.input_name] = { type: this.input_type, value: this.input_data }
                }

            } else {
                // show error message
            }
            console.log("Save input", this.store.design)
        }
    }
})
</script>

<style>
.inputs{
    background-color: #9cabb4;
    padding: 10px 5px;
    margin: 3px 0px;

}

/* .input{
    justify-content:space-around !important;
    position: relative !important;
    width: 100% !important;
    width: 40% !important;
    align-items: center !important;
    flex-flow:row !important;
    margin-right:  0px !important;
} */

/* .input{
    position: relative !important;
    width: 70% !important;
    flex-flow:row !important;
} */


.input_label{
    color: white !important;
    left:0px;
    margin: 1px;
}
</style>