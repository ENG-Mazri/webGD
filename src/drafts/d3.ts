// const w = 500;
// const h = 500;
// const svg = d3.select("svg").style('background-color', 'rgba(255, 51, 153,0.1)').attr("width", w).attr("height", h);
// const g = svg.append("g");
// const parseTime = d3.timeParse("%d-%b-%y");
// TODO: BAR CHART
// svg.selectAll("rect")
//    .data(this.dataset)
//    .enter()
//    .append("rect")
//    .attr('class', 'bar')
//    .attr("x", (d, i) => i * 30)
//    .attr("y", (d, i) => h - 3 * d)
//    .attr("width", 25)
//    .attr("height", (d, i) => 3 * d)
//    .attr("fill", "navy")
//    .append("title")
//    .text((d) => d)

// svg.selectAll("text")
//     .data(this.dataset)
//     .enter()
//     .append("text")
//     .attr('x',(d, i) => i * 30)
//     .attr('y',(d, i) => h - 3 * d - 4)
//     .text((d, i) => d)
//     .style('font-size', '15px')
//     .attr('fill', 'red')

// TODO: SCATTER
// svg.selectAll("circle")
//     .data(this.dataset)
//     .enter()
//     .append("circle")
//     .attr('cx', d => d[0] )
//     .attr('cy', d => d[1] )
//     .attr('r', 5)
//     .attr('fill','red')

// TODO: SCALE
// const scale = d3.scaleLinear();
// scale.domain([1000, 5000])
//      .range([0, 100])

// console.log(scale(3000))

// const locationData = [[1, 7],[6, 3],[8, 3]];
// const max = d3.max(this.dataset_bar);
// const minX = d3.min(locationData, (d) => d[1]);