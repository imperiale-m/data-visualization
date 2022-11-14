// Task 1
const margin = {
  t: 20,
  r: 40,
  b: 80,
  l: 100,
};
const width = 600;
const height = 400;

// Data
d3.csv('../data/top6_data.csv', d3.autoType)
  .then((data) => {
    data = data.slice(0, data.length);
    // console.log(data)

    // append the svg object to the div with id #task1
    const svg = d3
      .select('#a2_task1')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    // console.log(d3.max(data, (d) => d['height_m']));

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d['height_m'])]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      // .transition()
      // .duration(1000)
      .call(d3.axisBottom(x));

    // axis: initialization
    const y = d3.scaleLinear().range([height, 0]);
    const yAxis = svg.append('g');

    // A function that builds the graph for a specific value of bin
    function update(nBin) {
      // set the parameters for the histogram
      const histogram = d3
        .histogram()
        .value((d) => d['height_m']) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(nBin)); // then the numbers of bins

      // And apply this function to data to get the bins
      const bins = histogram(data);

      // axis: update now that we know the domain
      y.domain([0, d3.max(bins, (d) => d.length)]);
      yAxis.call(d3.axisLeft(y));

      // Join the rect with the bins data
      const u = svg.selectAll('rect').data(bins);

      // Manage the existing bars and eventually the new ones:
      u.join('rect') // Add a new rect for each new elements
        .attr('x', 1)
        .attr('transform', (d) => `translate(${x(d.x0)}, ${y(d.length)})`)
        .attr('width', (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr('height', (d) => height - y(d.length))
        .style('fill', 'steelblue');
    }

    // Initialize with 20 bins
    update(30);

    // Listen to the button - update if user change it
    // d3.select("#nBin").on("input", function () {
    //   update(+this.value);
    // });

    // x-axis name
    svg
      .append('text')
      .attr('transform', `translate(${width / 2 - 40}, ${height + margin.b - 35})`)
      .attr('class', 'axis-name')
      .text('NUMBER OF TREES');
    // y-axis name
    svg
      .append('text')
      .attr('transform', `translate(${-margin.l + 40}, ${height / 2}) rotate(-90)`)
      .attr('class', 'axis-name')
      .text('SPECIES');
  })
  .catch((e) => {
    console.log(e);
  });
