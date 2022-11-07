// Task 1
const WIDTH = document.getElementById("task1").offsetWidth;
const HEIGHT = window.innerHeight * 0.6;
const l = Math.floor(WIDTH / 3.5);
const r = Math.floor(WIDTH / 9);
// console.log(r)

const margin = { top: 40, right: r, bottom: 40, left: l };
const width = WIDTH - margin.left - margin.right;
const height = HEIGHT - margin.top - margin.bottom;

// append the svg object to the div with id #task1
const svg = d3
  .select("#task1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.bottom})`);

// Data
d3.csv("../data/task1.csv", d3.autoType)
  .then(function (data) {
    // number of elements to plot
    const N = 10;

    data = data.slice(0, N);

    // console.log(data);

    // max value for the x-axis
    const max = d3.max(data, d => d.count);

    const x = d3.scaleLinear().range([0, width]).domain([0, max]).nice();

    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(data.map(d => d.name))
      .padding(0.06);

    // plot the x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end");

    // plot the y-axis
    svg.append("g").call(d3.axisLeft(y)).select(".domain").remove();

    const tooltip = d3.select("#tooltip1");

    const mouseover = function () {
      tooltip.style("opacity", 0.9);
      d3.select(this).style("stroke", "black").attr("fill", "Gold");
    };

    const mouseout = function () {
      tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none").attr("fill", "teal");
    };

    const mousemove = function (event, d) {
      tooltip
        .html("Count = " + d["count"] + "<br>Mean canopy size = " + d["mean_canopy_size"])
        .style("top", event.pageY + "px")
        .style("left", event.pageX + 20 + "px");
    };

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", 0.5)
      .attr("y", d => y(d.name))
      .attr("width", d => x(d.count))
      .attr("height", y.bandwidth())
      .attr("fill", "teal")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("mousemove", mousemove);
  })
  .catch(e => {
    console.log(e);
  });
