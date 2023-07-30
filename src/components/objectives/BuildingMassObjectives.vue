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
                    Podium volume
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
            <div>
                <n-divider title-placement="left">
                    Total facade area
                </n-divider>
                <n-space item-style="display: flex;" align="center">
                    <n-checkbox
                        v-model:checked="isMaxFacadeArea"
                        @click="onMaxFacadeArea"
                        size="small">
                        Maximize
                    </n-checkbox>
                    <n-checkbox
                        v-model:checked="isMinFacadeArea"
                        @click="onMinFacadeArea"
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
            isMaxFacadeArea: false,
            isMinFacadeArea: false,
            disabled: true,
            value: '',
            extArea: null,
            towerVolume: null,
            podiumVolume: null,
            totalArea: null,
            facadeArea: null
            
        }
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
            if (this.isMaxExtArea){
                this.isMinExtArea = false;
                this.extArea = 'Max' 
            } else this.extArea = null
            this.save();
        },
        onMinExtArea() {
            if (this.isMinExtArea){
                this.isMaxExtArea = false;
                this.extArea = 'Min'
            } else this.extArea = null
            this.save();
        },
        // onMaxVolume() {
        //     if (this.isMaxVolume) this.isMinVolume = false;
        // },
        // onMinVolume() {
        //     if (this.isMinVolume) this.isMaxVolume = false;
        // },
        onMaxTVolume() {
            if (this.isMaxTVolume) {
                this.isMinTVolume = false;
                this.towerVolume = 'Max';
            } else this.towerVolume = null;
            this.save();
        },
        onMinTVolume() {
            if (this.isMinTVolume){
                this.isMaxTVolume = false;
                this.towerVolume= 'Min'
            } else this.towerVolume = null;
            this.save();
        },
        onMaxPVolume() {
            if (this.isMaxPVolume){
                this.isMinPVolume = false;
                this.podiumVolume = 'Max'
            } else this.podiumVolume = null
            this.save();
        },
        onMinPVolume() {
            if (this.isMinPVolume){
                this.isMaxPVolume = false;
                this.podiumVolume = 'Min'
            } else this.podiumVolume = null
            this.save();
        },
        onMaxTotalArea() {
            if (this.isMaxTotalArea){
                this.isMinTotalArea = false;
                this.totalArea = 'Max'
            } else this.totalArea = null
            this.save();
        },
        onMinTotalArea() {
            if (this.isMinTotalArea){
                this.isMaxTotalArea = false;
                this.totalArea = 'Min'
            } else this.totalArea = null
            this.save();
        },
        onMaxFacadeArea() {
            if (this.isMaxFacadeArea){
                this.isMinFacadeArea = false;
                this.facadeArea = 'Max'
            } else this.facadeArea = null
            this.save();
        },
        onMinFacadeArea() {
            if (this.isMinFacadeArea){
                this.isMaxFacadeArea = false;
                this.facadeArea = 'Min'
            } else this.facadeArea = null
            this.save();
        },
        save(){
            if(!this.store.design[this.function]) this.store.design[this.function] = {};
            
            this.store.design[this.function]['objectives'] = {
                exteriorArea: this.extArea,
                towerVolume: this.towerVolume,
                podiumVolume: this.podiumVolume,
                totalArea: this.totalArea
            };
            // console.log('[Objectives]: ', this.store.design[this.function]['objectives']);
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