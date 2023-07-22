<template>
    <div class='objectives'>
        <n-space vertical>
            <div>
                <n-divider title-placement="left">
                    Exterior surface area
                </n-divider>
                <n-space item-style="display: flex;" align="center">
                    <n-checkbox
                        v-model:checked="isMaxExtArea"
                        @click="onMaxExtArea"
                        size="small">
                        Maximize
                    </n-checkbox>
                    <n-checkbox
                        v-model:checked="isMinExtArea"
                        @click="onMinExtArea"
                        size="small">
                        Minimize
                    </n-checkbox>
                </n-space>
            </div>
            <div>
                <n-divider title-placement="left">
                    Podium vlume
                </n-divider>
                <n-space item-style="display: flex;" align="center">
                    <n-checkbox
                        v-model:checked="isMaxPVolume"
                        @click="onMaxPVolume"
                        size="small">
                        Maximize
                    </n-checkbox>
                    <n-checkbox
                        v-model:checked="isMinPVolume"
                        @click="onMinPVolume"
                        size="small">
                        Minimize
                    </n-checkbox>
                </n-space>
            </div>
            <div>
                <n-divider title-placement="left">
                    Tower volume
                </n-divider>
                <n-space item-style="display: flex;" align="center">
                    <n-checkbox
                        v-model:checked="isMaxTVolume"
                        @click="onMaxTVolume"
                        size="small">
                        Maximize
                    </n-checkbox>
                    <n-checkbox
                        v-model:checked="isMinTVolume"
                        @click="onMinTVolume"
                        size="small">
                        Minimize
                    </n-checkbox>
                </n-space>
            </div>  
            <div>
                <n-divider title-placement="left">
                    Total building area
                </n-divider>
                <n-space item-style="display: flex;" align="center">
                    <n-checkbox
                        v-model:checked="isMaxTotalArea"
                        @click="onMaxTotalArea"
                        size="small">
                        Maximize
                    </n-checkbox>
                    <n-checkbox
                        v-model:checked="isMinTotalArea"
                        @click="onMinTotalArea"
                        size="small">
                        Minimize
                    </n-checkbox>
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
            store: '' as any,
            isMaxExtArea: false,
            isMinExtArea: false,
            isMaxVolume: false,
            isMinVolume: false,
            isMaxTVolume: false,
            isMinTVolume: false,
            isMaxPVolume: false,
            isMinPVolume: false,
            isMaxTotalArea: false,
            isMinTotalArea: false,
            disabled: true,
            value: ''
            
        }
    },
    updated(){
        console.log("[Bld mass - objectives]: ");

    },
    mounted() {
        this.store = useDesign();
    },
    watch: {
        isMaxSurfaceArea() {
            // this.isMinSurfaceArea = !this.isMinSurfaceArea
            // if(this.isMinSurfaceArea) this.isMinSurfaceArea = false

        },
        isMinSurfaceArea() {
            // this.isMaxSurfaceArea = !this.isMaxSurfaceArea
            // if(this.isMaxSurfaceArea) this.isMaxSurfaceArea = false
        }
    },
    methods: {
        onMaxExtArea() {
            if (this.isMaxExtArea) this.isMinExtArea = false;
            this.save();
        },
        onMinExtArea() {
            if (this.isMinExtArea) this.isMaxExtArea = false;
            this.save();
        },
        // onMaxVolume() {
        //     if (this.isMaxVolume) this.isMinVolume = false;
        // },
        // onMinVolume() {
        //     if (this.isMinVolume) this.isMaxVolume = false;
        // },
        onMaxTVolume() {
            if (this.isMaxTVolume) this.isMinTVolume = false;
            this.save();
        },
        onMinTVolume() {
            if (this.isMinTVolume) this.isMaxTVolume = false;
            this.save();
        },
        onMaxPVolume() {
            if (this.isMaxPVolume) this.isMinPVolume = false;
            this.save();
        },
        onMinPVolume() {
            if (this.isMinPVolume) this.isMaxPVolume = false;
            this.save();
        },
        onMaxTotalArea() {
            if (this.isMaxTotalArea) this.isMinTotalArea = false;
            this.save();
        },
        onMinTotalArea() {
            if (this.isMinTotalArea) this.isMaxTotalArea = false;
            this.save();
        },
        save(){
            if(!this.store.design[this.function]) return;
            
            this.store.design[this.function]['objectives'] = {
                isMaxExtArea: this.isMaxExtArea,
                isMinExtArea: this.isMinExtArea,
                isMaxVolume: this.isMaxVolume,
                isMinVolume: this.isMinVolume,
                isMaxTVolume: this.isMaxTVolume,
                isMinTVolume: this.isMinTVolume,
                isMaxPVolume: this.isMaxPVolume,
                isMinPVolume: this.isMinPVolume,
                isMaxTotalArea: this.isMaxTotalArea,
                isMinTotalArea: this.isMinTotalArea
            };
            // this.store.design[this.function]['objectives']['']
        }

    }
})
</script>

<style>
.objectives{
    background-color: #9cabb4;
    padding: 10px 5px;
    margin: 3px 0px;

}

.n-checkbox{
    --n-color-checked: #a2588f !important;
    /* --n-focus-checked: #eaff00 !important; */
}

</style>