// Task 3
// Data
d3.csv('../data/top6_data.csv', d3.autoType)
  .then((data) => {
    // console.log(data);

    const xDomain = [0, d3.max(data, (d) => d.height_m)];
    const yDomain = [0, d3.max(data, (d) => d.gross_carbon_sequestration_kg_yr)];
    const xRange = [0, width];
    const yRange = [height, 0];
    // console.log('domain', xDomain);

    // Construct scales and axes.
    const xScale = d3.scaleLinear(xDomain, xRange).nice();
    const yScale = d3.scaleLinear(yDomain, yRange).nice();

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const svg = d3
      .select('#a2_task3')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle');

    // plot the y-axis
    svg.append('g').call(yAxis);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', (d) => `dot ${d.name}`)
      .attr('cx', (d) => xScale(d.height_m))
      .attr('cy', (d) => yScale(d.gross_carbon_sequestration_kg_yr))
      .attr('r', 5)
      .attr('stroke', 'black')
      .style('fill', (d) => color(d.name));
  })
  .catch((e) => {
    console.log(e);
  });
