<template>
    <div class='objectives'>
        <n-space vertical>
            <div>
                <n-divider title-placement="left">
                    Surface area
                </n-divider>
                <n-space item-style="display: flex;" align="center">
                    <n-checkbox
                        v-model:checked="isMaxSurfaceArea"
                        @update:checked="()=> !isMinSurfaceArea"
                        size="small"
                        >
                        Maximize
                    </n-checkbox>
                    <n-checkbox
                        v-model:checked="isMinSurfaceArea"
                        @update:checked="()=> !isMaxSurfaceArea"
                        size="small"
                        >
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
            isMaxSurfaceArea: false,
            isMinSurfaceArea: false,
            disabled: true,
            value: ''
            
        }
    },
    mounted() {
        this.store = useDesign();
        console.log("Function: ", this.function)

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
        // test() {
            
        //     this.isMinSurfaceArea = !this.isMinSurfaceArea;
        //     this.isMaxSurfaceArea = !this.isMaxSurfaceArea;
        //     console.log('koloooooooo')
        // },
        test (checked: boolean) {
            console.log('koloooooooo', checked)
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

</style>