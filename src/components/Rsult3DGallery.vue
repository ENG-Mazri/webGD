<template>
    <div class="outputPanel_gallery">
        <div class="panel_header">
            <h3> Variation's info </h3>
        </div>
        <div class="result3D_var" id="result3D_var"></div>
            <n-scrollbar style="max-height: 200px" trigger='none'>
                <div class="resultInfo_var" id="resultInfo_var"></div>
            </n-scrollbar>
        <!-- <div class="outputPanel_gallery_main">
            <n-result v-if="isPicked" title="No data to display" description="After generating, pick a variation from the ouptput panel to display details.">
                <template #icon>
                    <div>
                        <n-icon>
                            <outputIcon/>
                        </n-icon>
                    </div>
                </template>
            </n-result>
        </div>   -->
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { OptionsOutline as optionsIcon } from '@vicons/ionicons5';


export default defineComponent({
    props:{
        outputOptions: []
    },
    components: {
        optionsIcon
    },
    data(){
        return {
            isPicked: false
        }
    },
    setup () {
    },
    created (){},
    watch:{
    },
    mounted() {
    },
    methods: {
    }
})
</script>
<style>
.outputPanel_gallery{
  position: absolute;
  left: 1070px;
  top: 35px;
  width: 400px;
  min-height:100px;
  max-height: 650px;
  margin: 3px;
  padding: 5px;
  display: flex;
  flex-direction: column; 
  text-align: left;
  box-shadow: 0px 0px 25px 10px rgba(170, 170, 170, 0.2);
  border-radius: 10px;
}

/* .outputPanel_gallery > * {
  margin: 5px 10px;
} */

.result3D_var{
    position: relative !important;
    /* background-color:aquamarine!important; */
    width: 100% !important;
    height: 300px !important;
    margin: 15px 0px !important;
    padding: 5px 0px !important;
    /* border: 1px solid #9cabb4 !important;
    border-radius: 10px !important; */
}
.resultInfo_var{
    position: relative !important;
    /* background-color:aquamarine!important; */
    width: 100% !important;
    height: 350px !important;
    margin: 0px 0px !important;
    padding: 5px 10px !important;
    /* border: 1px solid #9cabb4 !important;
    border-radius: 10px !important; */
}
</style>