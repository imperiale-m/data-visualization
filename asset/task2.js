// Task 2
// const WIDTH = document.getElementById("task2").offsetWidth;
// const HEIGHT = 600;
//
// const l = Math.floor(WIDTH / 4);
// // console.log(l)
//
// const margin = { top: 40, right: 40, bottom: 40, left: l };
// width = WIDTH - margin.left - margin.right;
// height = HEIGHT - margin.top - margin.bottom;

const svg2 = d3
  .select("#task2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Data
d3.csv("/data/task2.csv", d3.autoType)
  .then(function (data) {
    // console.log(data);

    const dataColumns = Object.keys(data[0]);
    // console.log(dataColumns);

    // List of subgroups = header of the csv files = soil condition here
    const subgroups = dataColumns.slice(1);

    const groups = data.map(d => d["district"]);
    // console.log(groups);

    const stackedData = d3.stack().keys(subgroups)(data);

    const max = d3.max(stackedData[stackedData.length - 1], d => d[1]);
    // console.log(max);

    const x = d3
      .scaleLinear()
      .range([0, width * 0.95])
      .domain([0, max])
      .nice();

    const y = d3.scaleBand().range([0, height]).domain(groups).padding(0.1);

    svg2
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end");

    svg2.append("g").call(d3.axisLeft(y));

    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      // The first 5 colors from Category10 + #cccccc (gray) for the last one
      .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#cccccc"]);
    svg2
      .append("g")
      .selectAll("g")
      // Enter the stack data = loop key per key = group per group
      .data(stackedData)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
      .attr("y", d => y(d.data["district"]))
      .attr("x", d => x(d[0]))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth());
    // .attr("stroke", "black");

    // const tooltip = d3.select("#task1")
    //   .append("div")
    //   .style("opacity", 0)
    //   .attr("class", "tooltip")
    //   .style("background-color", "white")
    //   .style("position", "absolute")
    //   .style("border", "solid")
    //   .style("border-width", "1px")
    //   .style("border-radius", "5px")
    //   .style("padding", "8px");

    // svg.selectAll("rect")
    //   .data(data)
    //   .join("rect")
    //   .attr("x", 0)
    //   .attr("y", d => y(d['district']))
    //   .attr("width", d => x(d['others']))
    //   .attr("height", y.bandwidth())
    //   .attr("fill", "orange")
    // .on("mouseover", mouseover)
    // .on("mouseout", mouseout)
    // .on("mousemove", mousemove);
  })
  .catch(e2 => {
    console.log(e2);
  });
