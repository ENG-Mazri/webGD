<template>
  <div class="d3Panel" ref="$wrapper" @showResultEvent="visualizeResult">
    <svg id="d3Svg"></svg>
    <div class="d3Panel_footer">
      <h3> Output chart </h3>
    </div>
  </div>
    
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as d3 from "d3";
import {TestAlgorithm} from '../logic/testAlgorithm';
import {InputParameters} from '../types/inputsParameters';
import {useDesign} from '../store/design';



export default defineComponent({
  name: 'D3Panel',
  props: {
    msg: String,
  },
  data() {
    return {
      show: false,
      store: useDesign().design
    }
   
  },
  watch:{
    store(){
      console.log("D3 PANEL WATCHING STORE")
    }
  },
  mounted() {
    // this.store = useDesign();

    const w = 500;
    const h = 500;
    const svg = d3.select("#d3Svg").attr("width", w).attr("height", h);
    const g = svg.append("g");
    const parseTime = d3.timeParse("%d-%b-%y");

    // TODO: SCATTER SCALE   
    const dataset = [
                  [ 34,     78 ],
                  [ 109,   280 ],
                  [ 310,   120 ],
                  [ 79,   411 ],
                  [ 420,   220 ],
                  [ 233,   145 ],
                  [ 333,   96 ],
                  [ 222,    333 ],
                  [ 78,    320 ],
                  [ 21,   123 ]
                ];
    const dataset2 = [ 34, 99, 89, 34, 78 ];
    // TODO: GD TESTING + SCATTER PLOT VISUALIZATION
    // const inputs: InputParameters = {inputs: {
    //     width: [5,30],
    //     height: [8,55],
    //     length: [7,50]
    //   },
    //   generations: 10

    // }
    // const GD_test = new TestAlgorithm(inputs).process();
    // svg.selectAll("rect")
    //     .data(dataset2)
    //     .enter()
    //     .append("rect")
    //     .attr('class', 'bar')
    //     .attr("x", (d, i) => i * 30)
    //     .attr("y", (d, i) => h - 3 * d)
    //     .attr("width", 25)
    //     .attr("height", (d, i) => 3 * d)
    //     .attr("fill", "navy")
    //     .append("title")
    //     .text((d) => d)

    // const GD_test = this.store.result;
    // if( GD_test.length == 0) return;
    // console.log("D3 result", GD_test)
 
    // const padding = 60;
    // const maxX = d3.max( [...GD_test], (d,i) => d.surface_area);
    // const maxY = d3.max( [...GD_test], (d,i) => d.volume);

    // const xScale = d3.scaleLinear()
    //                  .domain([0, maxX as number])
    //                  .range([padding, w - padding]);

    // const yScale = d3.scaleLinear()
    //                  .domain([0, maxY as number])
    //                  .range([h - padding, padding]);

    // svg.selectAll("circle")
    //    .data([...GD_test])
    //    .enter()
    //    .append("circle")
    //    .attr("cx", (d) => xScale(d.surface_area))
    //    .attr("cy",(d) => yScale(d.volume))
    //    .attr("r", (d) => 5)
    //    .attr("id", "scatter")
    //    .attr('fill', 'rgb(112, 112, 219)')
    //    .on("click", () => console.log("CLICKED"));

    // // // // svg.selectAll("text")
    // // // //    .data(dataset)
    // // // //    .enter()
    // // // //    .append("text")
    // // // //    .text((d) =>  `(${d[0]}, ${d[1]})`)
    // // // //    .attr("x", (d) => xScale(d[0] + 10))
    // // // //    .attr("y", (d) => yScale(d[1]))

    // const xAxis = d3.axisBottom(xScale);
    // const yAxis = d3.axisLeft(yScale);


    // svg.append("g")
    //    .attr("transform", `translate(0, ${(h - padding)})`)
    //    .call(xAxis);

    // svg.append("g")
    //    .attr("transform", `translate(${(padding)}, 0)`)
    //    .call(yAxis); 


  },
  methods: {
    visualizeResult(){
      // console.log("VISUALIZE.................")
      // const dataset2 = [ 34, 99, 89, 34, 78 ];
      // // TODO: GD TESTING + SCATTER PLOT VISUALIZATION
      // svg.selectAll("rect")
      //     .data(dataset2)
      //     .enter()
      //     .append("rect")
      //     .attr('class', 'bar')
      //     .attr("x", (d, i) => i * 30)
      //     .attr("y", (d, i) => h - 3 * d)
      //     .attr("width", 25)
      //     .attr("height", (d, i) => 3 * d)
      //     .attr("fill", "navy")
      //     .append("title")
      //     .text((d) => d)

    }
  }
});
</script>

<style >
.d3Panel{
  position: absolute;
  left: 300px;
  top: 35px;
  width: 700px;
  height: 650px;
  margin: 3px;
  padding: 5px;
  display: flex;
  flex-direction: column; 
  box-shadow: 0px 0px 25px 10px rgba(170, 170, 170, 0.2);
    
}

.bar:hover{
  fill: yellow;
}

#d3Svg{
  margin: 10px 100px;
  /*background-color: #efefef;*/

}

.d3Panel_footer{
  /*background-color: #efefef;*/
  height: 100px;
  text-align: left;
  border-top: 2px dashed #9cabb4;

}

.d3Panel_footer > * {
  margin: 5px 10px;
}

#scatter:hover{
  fill: red;
  cursor: pointer
}
</style>