<template>
    <div class='inputs'>
        <n-space vertical>
            <div>
                <n-divider title-placement="left">
                    Site offset (m)
                </n-divider>
                <n-space align="center" justify="space-between" inline>
                    <n-switch v-model:value="fixed_width" :rail-style="railStyle">
                        <template #checked>
                        fixed
                        </template>
                        <template #unchecked>
                        var
                        </template>
                    </n-switch>
                    <n-input-number v-if="fixed_width" class="input" clearable/>
                    <n-input v-if="!fixed_width"
                        class="input"
                        id='input_value'
                        v-model:value="input_data"
                        pair
                        separator="-"
                        :placeholder="['Min', 'Max']"
                        clearable />
                </n-space>
            </div>
            <div>
                <n-divider title-placement="left">
                    Building height (m)
                </n-divider>
                <n-space align="center" justify="space-between" inline>
                    <n-switch v-model:value="fixed_height" :rail-style="railStyle">
                        <template #checked>
                        fixed
                        </template>
                        <template #unchecked>
                        var
                        </template>
                    </n-switch>
                    <n-input-number v-if="fixed_height" class="input" clearable/>
                    <n-input v-if="!fixed_height"
                        class="input"
                        id='input_value'
                        v-model:value="input_data"
                        pair
                        separator="-"
                        :placeholder="['Min', 'Max']"
                        clearable />
                </n-space>
            </div>
            <div>
                <n-divider title-placement="left">
                    Floor height (m)
                </n-divider>
                <n-space align="center" justify="space-between" inline>
                    <n-switch v-model:value="fixed_length" :rail-style="railStyle">
                        <template #checked>
                        fixed
                        </template>
                        <template #unchecked>
                        var
                        </template>
                    </n-switch>
                    <n-input-number v-if="fixed_length" clearable/>
                    <n-input v-if="!fixed_length"
                        id='input_value'
                        v-model:value="input_data"
                        pair
                        separator="-"
                        :placeholder="['Min', 'Max']"
                        clearable />
                </n-space>
            </div>
        </n-space>
    </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, ref } from 'vue';
import {useDesign} from '../../store/design'

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
            fixed_height: true,
            fixed_length: true
            
        }
    },
    mounted() {
        this.store = useDesign();
        console.log("Function: ", this.function)

    },
    watch: {
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

.input_label{
    color: white !important;
    left:0px;
    margin: 1px;
}

.n-divider{
    margin: 0px !important
}

.n-divider__title{
    color: white !important;
}
</style>