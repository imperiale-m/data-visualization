// Data
d3.csv("../data/task3.csv", d3.autoType).then(function (data) {
  console.log(data);

  const WIDTH3 = document.getElementById("task1").offsetWidth;
  const HEIGHT3 = window.innerHeight * 0.6;
  const l3 = Math.floor(WIDTH3 / 6);
  const r3 = 0; // Math.floor(WIDTH3 / 12);

  const margin3 = { top: 80, right: r3, bottom: 80, left: l3 };
  const width3 = WIDTH3 - margin3.left - margin3.right;
  const height3 = HEIGHT3 - margin3.top - margin3.bottom;

  const svg3 = d3
    .select("#task3")
    .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform", `translate(${margin3.left}, ${margin3.bottom})`);

  // console.log(Object.keys(data[0]).slice(1));

  const N = 5;

  let arr = []
  for (let i = 0; i < N; i++) {
    arr = [...arr, ...Object.values(data[i]).slice(1)];
  }
  // console.log(arr)

  const max = d3.max(arr);
  // console.log("max", max);

  for (let i = 0; i < N; i++) {
    const xx = Object.keys(data[i]).slice(1);

    const x = d3
      .scaleLinear()
      .range([0, width3 / 7])
      .domain([0, max])
      .nice();

    const y = d3.scaleBand().range([0, height3]).domain(xx).padding(0.1);

    svg3
      .append("g")
      .attr("transform", `translate(${(width3 / 5) * i}, ${height3})`)
      .call(d3.axisBottom(x).ticks(4))
      .selectAll("text")
      .attr("transform", "translate(-15,5)rotate(-70)")
      .style("text-anchor", "end");

    if (i === 0) {
      svg3.append("g").call(d3.axisLeft(y)).select(".domain").remove();
    }

    const colors = ["#ebac23", "#b80058", "#878500", "#006e00", "#b24502", "#bdbdbd"];

    svg3
      .append("text")
      .attr("transform", `translate(${(width3 / 5) * i}, ${-30})`)
      .attr("class", "font-bold text-base graph-title")
      .style("fill", colors[i])
      .text(Object.values(data[i]).slice(0, 1));

    svg3
      .selectAll("rect" + i)
      .data(Object.entries(data[i]))
      .join("rect")
      .attr("x", (width3 / 5) * i)
      .attr("y", d => y(d[0]))
      .attr("width", d => x(d[1]))
      .attr("height", y.bandwidth())
      .attr("fill", colors[i]);
  }
});
