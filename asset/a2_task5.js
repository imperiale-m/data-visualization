// Task 5
// Data
d3.csv('../data/top6_data.csv', d3.autoType)
  .then((data) => {
    console.log(data);

    const xDomain = [0, d3.max(data, (d) => d.height_m)];
    const xRange = [0, width];

    const yDomain = [0, d3.max(data, (d) => d.gross_carbon_sequestration_kg_yr)];
    const yRange = [height, 0];

    const zDomain = d3.extent(data, (d) => d.crown_width_m);
    const zRange = [1, 16];

    console.log('domain', zDomain);

    // Construct scales and axes.
    const xScale = d3.scaleLinear(xDomain, xRange).nice();
    const yScale = d3.scaleLinear(yDomain, yRange).nice();
    // Add a scale for bubble size
    const zScale = d3.scaleLinear(zDomain, zRange);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const dd = data.map((d) => d.name);
    const species = [...new Set(dd)];
    // Add a scale for bubble color
    const myColor = d3
      .scaleOrdinal()
      .domain(species)
      // .domain((d) => d.name)
      .range(d3.schemeCategory10);

    const svg = d3
      .select('#a2_task5')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    // plot the x-axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end');

    // plot the y-axis
    svg.append('g').call(yAxis);

    // const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .append('g')
      .selectAll('dot')
      .data(data)
      .join('circle')
      .attr('cx', (d) => xScale(d.height_m))
      .attr('cy', (d) => yScale(d.gross_carbon_sequestration_kg_yr))
      .attr('r', (d) => zScale(d.crown_width_m))
      .style('fill', (d) => myColor(d.name))
      .style('opacity', '0.7')
      .attr('stroke', 'black')
      .style('stroke-width', '1px');
  })
  .catch((e) => {
    console.log(e);
  });
