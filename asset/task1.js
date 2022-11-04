// Task 1

const WIDTH = document.getElementById("task1").offsetWidth;
const HEIGHT = 600;

let l = Math.floor(WIDTH / 5);
// console.log(l)

const margin = { top: 40, right: 40, bottom: 40, left: l };
width = WIDTH - margin.left - margin.right;
height = HEIGHT - margin.top - margin.bottom;

// append the svg object to the div with id #task1
const svg = d3
  .select("#task1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Data
d3.csv("../data/task1.csv", d3.autoType).then(function (data) {
  // number of elements to plot
  const N = 20;

  data = data.slice(0, N);

  // console.log(data);

  // max value for the x-axis
  const max = d3.max(data, d => d.count);

  const x = d3
    .scaleLinear()
    .range([0, width * 0.95])
    .domain([0, max]);

  const y = d3
    .scaleBand()
    .range([0, height])
    .domain(data.map(d => d.name))
    .padding(0.1);

  // plot the x-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end");

  // plot the y-axis
  svg.append("g").call(d3.axisLeft(y));

  const tooltip = d3
    .select("#task1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("position", "absolute")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "8px");

  const mouseover = function () {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 1);
  };

  const mouseout = function () {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  const mousemove = function (event, d) {
    tooltip
      .html("The mean canopy size is: " + d["mean_canopy_size"])
      .style("top", event.pageY + "px")
      .style("left", event.pageX + 20 + "px");
  };

  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", 0)
    .attr("y", d => y(d.name))
    .attr("width", d => x(d.count))
    .attr("height", y.bandwidth())
    .attr("fill", "orange")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("mousemove", mousemove);
});
