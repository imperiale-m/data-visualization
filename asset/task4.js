// Data
d3.csv("../data/data2.csv", d3.autoType)
  .then(function (data) {
    // console.log(data);

    const svg4 = d3
      .select("#task4")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const dataColumns = Object.keys(data[0]);
    // console.log(dataColumns);

    // List of subgroups
    const subgroups = dataColumns.slice(1);

    const groups = data.map(d => d["district"]);
    // console.log(groups);

    const stackedData = d3
      .stack()
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetExpand)
      .keys(subgroups)(data);

    const max = d3.max(stackedData[stackedData.length - 1], d => d[1]);
    // console.log(max);

    const x = d3.scaleLinear().range([0, width]).domain([0, max]).nice();

    const y = d3.scaleBand().range([0, height]).domain(groups).padding(0.1);

    svg4
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(10, "%"))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    svg4.append("g").call(d3.axisLeft(y)).select(".domain").remove();

    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#ebac23", "#b80058", "#878500", "#006e00", "#b24502", "#bdbdbd"]);

    const tooltip = d3.select("#tooltip4");

    const mouseover = function () {
      tooltip.style("opacity", 0.9);
      d3.select(this).style("stroke", "black");
    };

    const mouseout = function () {
      tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none");
    };

    const formatter = d3.format(".2%");

    const mousemove = function (event, d) {
      const subgroupName = d3.select(this.parentNode).datum().key;
      // const subgroupValue = d.data[subgroupName];

      tooltip
        .html("Tree type = " + subgroupName + "<br>Count = " + formatter(d[1] - d[0]))
        .style("top", event.pageY + "px")
        .style("left", event.pageX + 20 + "px");
    };

    svg4
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
      .attr("height", y.bandwidth())
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("mousemove", mousemove);
  })
  .catch(e => {
    console.log(e);
  });
