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
    // console.log(data);

    // append the svg object to the div with id #task1
    const svg = d3
      .select('#a2_task1')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    // console.log(d3.max(data, (d) => d['dbh_cm']));

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d['dbh_cm'])]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      // .transition()
      // .duration(1000)
      .call(d3.axisBottom(xScale));

    // axis: initialization
    const yRange = d3.scaleLinear().range([height, 0]);
    const yAxis = svg.append('g');

    // A function that builds the graph for a specific value of bin
    function update(nBin) {
      // set the parameters for the histogram
      const histogram = d3
        .histogram()
        .value((d) => d['dbh_cm']) // I need to give the vector of value
        .domain(xScale.domain()) // then the domain of the graphic
        .thresholds(xScale.ticks(nBin)); // then the numbers of bins

      // And apply this function to data to get the bins
      const bins = histogram(data);

      // axis: update now that we know the domain
      yRange.domain([0, d3.max(bins, (d) => d.length)]);
      yAxis.call(d3.axisLeft(yRange));

      const tooltip = d3.select('#a2_task1').append('div').attr('class', 'tooltip');

      const mouseover = function () {
        tooltip.style('z-index', 1);
        tooltip.transition().style('opacity', 0.9);
        d3.selectAll('.bin').transition().duration(400).style('fill', 'gray');
        d3.select(this).transition().duration(400).style('fill', 'steelblue');
        // d3.select(this).style('opacity', 1);
      };

      const mouseout = function () {
        tooltip.style('z-index', -1);
        tooltip.transition().style('opacity', 0);

        d3.selectAll('.bin').transition().duration(400).style('fill', 'steelblue');
        // d3.select(this).style('opacity', 0.9);
      };

      const mousemove = function (event, d) {
        tooltip
          .html(`Range: ${d.x0} - ${d.x1} cm`)
          .style('top', `${event.pageY}px`)
          .style('left', `${event.pageX + 20}px`);
      };

      // Join the rect with the bins data
      const u = svg.selectAll('rect').data(bins);

      // Manage the existing bars and eventually the new ones:
      u.join('rect') // Add a new rect for each new elements
        .attr('x', 1)
        .attr('transform', (d) => `translate(${xScale(d.x0)}, ${yRange(d.length)})`)
        .attr('width', (d) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr('height', (d) => height - yRange(d.length))
        .attr('class', 'bin')
        .style('fill', 'steelblue')
        .style('opacity', 0.9)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove);
    }

    // Initialize with 20 bins
    update(30);

    // x-axis name
    svg
      .append('text')
      .attr('transform', `translate(${width / 2 - 40}, ${height + margin.b - 35})`)
      .attr('class', 'axis-name')
      .text('TRUNK DIAMETER (cm)');
    // y-axis name
    svg
      .append('text')
      .attr('transform', `translate(${-margin.l + 40}, ${height / 2}) rotate(-90)`)
      .attr('class', 'axis-name')
      .text('NUMBER OF TREES');
  })
  .catch((e) => {
    console.log(e);
  });
