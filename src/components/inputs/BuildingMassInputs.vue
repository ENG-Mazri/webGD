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
            <div>
                <n-divider title-placement="left">
                    Site boundary
                </n-divider>
                <!-- <n-upload :on-change="upload" ref="file2">
                    <n-button text color="#153048">
                        <template #icon>
                            <n-icon>
                                <fileIcon/>
                            </n-icon>
                        </template>
                        Upload .svg
                    </n-button>
                </n-upload> -->
                <DrawPad/>
            </div>
        </n-space>
    </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, ref } from 'vue';
import {useDesign} from '../../store/design';
import { DocumentAttachOutline as fileIcon } from '@vicons/ionicons5';
import { parse as SVGParser } from 'svg-parser';
import DrawPad from './DrawPad.vue'
// import { parse, stringify } from 'svgson';
import { parse, scale, stringify } from 'svg-path-tools'

import {createInterpolator} from 'svg-path-interpolator';

export default defineComponent({
    name: 'InputVue',
    components:{ fileIcon, DrawPad },
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
        },
        async upload(file: any){
            const url = URL.createObjectURL(file.fileList[0].file);
            const data = await this.getFile(url);
            const enc = new TextDecoder("utf-8");
            const dec = enc.decode( data as Uint8Array );
            const parsed = SVGParser(dec);
            const path = parsed.children[0].children[0].properties.d;
            const lines = [];

            const config = {
                joinPathData: false,
                minDistance: 0.5,
                roundToNearest: 0.25,
                sampleFrequency: 0.001
            };
            // const interpolator = new SVGPathInterpolator(config);
            // const pathData = interpolator.processSvg(dec);

            // console.log('SVG Boundary: ', pathData)
        },
        getFile(url: any){

            return new Promise((resolve, reject) => {
                var oReq = new XMLHttpRequest();
                oReq.responseType = "arraybuffer";
                oReq.addEventListener("load", () => {
                    resolve(new Uint8Array(oReq.response));
                });
                oReq.open("GET", url);
                oReq.send();
            })

        },
       
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