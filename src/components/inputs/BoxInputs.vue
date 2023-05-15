<template>
    <div class='inputs'>
        <n-space vertical>
            <div>
                <n-divider title-placement="left">
                    Width (m)
                </n-divider>
                <n-space align="center" justify="space-between" inline>
                    <n-switch v-model:value="fixed_width" :rail-style="railStyle">
                        <template #checked>
                        static
                        </template>
                        <template #unchecked>
                        var
                        </template>
                    </n-switch>
                    <n-input-number v-if="fixed_width" v-model:value="input_width" class="input" clearable/>
                    <n-input v-if="!fixed_width"
                        class="input"
                        id='input_value'
                        v-model:value="input_width"
                        pair
                        separator="-"
                        :placeholder="['Min', 'Max']"
                        clearable />
                </n-space>
            </div>
            <div>
                <n-divider title-placement="left">
                    Height (m)
                </n-divider>
                <n-space align="center" justify="space-between" inline>
                    <n-switch v-model:value="fixed_height" :rail-style="railStyle">
                        <template #checked>
                        static
                        </template>
                        <template #unchecked>
                        var
                        </template>
                    </n-switch>
                    <n-input-number v-if="fixed_height" v-model:value="input_height" class="input" clearable/>
                    <n-input v-if="!fixed_height"
                        class="input"
                        id='input_value'
                        v-model:value="input_height"
                        pair
                        separator="-"
                        :placeholder="['Min', 'Max']"
                        clearable />
                </n-space>
            </div>
            <div>
                <n-divider title-placement="left">
                    Length (m)
                </n-divider>
                <n-space align="center" justify="space-between" inline>
                    <n-switch v-model:value="fixed_length" :rail-style="railStyle">
                        <template #checked>
                        static
                        </template>
                        <template #unchecked>
                        var
                        </template>
                    </n-switch>
                    <n-input-number v-if="fixed_length" v-model:value="input_length" clearable/>
                    <n-input v-if="!fixed_length"
                        id='input_value'
                        v-model:value="input_length"
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
import { BoxInputType } from '../../types/InputTypes'
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
            store: '' as any,
            input_name: null,
            input_type: 'Sequence',
            input_data: null,
            fixed_width: true,
            fixed_height: true,
            fixed_length: true,
            input_width: null,
            input_length: null,
            input_height: null,
            
        }
    },
    mounted() {
        this.store = useDesign();
        this.store.design[this.function] = {};
        this.store.design[this.function]['strategy'] = this.function;
        this.store.design[this.function]['inputs'] = {};
        console.log("Function: ", this.store.design)

    },
    watch: {
        input_width(){
            let w = this.input_width;
            if(this.fixed_width) {
                this.store.design[this.function]['inputs']['width'] = {};
                this.store.design[this.function]['inputs']['width']['type'] = 'static';
                this.store.design[this.function]['inputs']['width']['value'] = w;
            } else {
                this.store.design[this.function]['inputs']['width'] = {};
                this.store.design[this.function]['inputs']['width']['type'] = 'variable';
                this.store.design[this.function]['inputs']['width']['value'] = [parseInt(w[0]), parseInt(w[1])];
            }
        },
        input_length(){
            let l = this.input_length;
            if(this.fixed_length) {
                this.store.design[this.function]['inputs']['length'] = {};
                this.store.design[this.function]['inputs']['length']['type'] = 'static';
                this.store.design[this.function]['inputs']['length']['value'] = l;
            } else {
                this.store.design[this.function]['inputs']['length'] = {};
                this.store.design[this.function]['inputs']['length']['type'] = 'variable';
                this.store.design[this.function]['inputs']['length']['value'] = [parseInt(l[0]), parseInt(l[1])];
            }
        },
        input_height(){
            let h = this.input_height;
            if(this.fixed_height) {
                this.store.design[this.function]['inputs']['height'] = {};
                this.store.design[this.function]['inputs']['height']['type'] = 'static';
                this.store.design[this.function]['inputs']['height']['value'] = h;
            } else {
                this.store.design[this.function]['inputs']['height'] = {};
                this.store.design[this.function]['inputs']['height']['type'] = 'variable';
                this.store.design[this.function]['inputs']['height']['value'] = [parseInt(h[0]), parseInt(h[1])];
            }
        },
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