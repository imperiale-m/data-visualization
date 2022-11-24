// Task 5
// Data
d3.csv('../data/top6_data.csv', d3.autoType)
  .then((data) => {
    console.log(data);

    const sumstat = d3.group(data, (d) => d.name);
    console.log(sumstat);

    const allKeys = [...sumstat.keys()];
    console.log(allKeys);

    const svg = d3
      .select('#a2_task4')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const xDomain = [0, d3.max(data, (d) => d['dbh_cm'])];
    const yDomain = [0, d3.max(data, (d) => d['gross_carbon_sequestration_kg_yr'])];

    let index = 0;
    sumstat.forEach((d, i) => {
      index += 1;
      const xRange = [0, width / 3.25];
      const yRange = [height / 2.25, 0];

      // Construct scales and axes.
      const xScale = d3.scaleLinear(xDomain, xRange).nice();
      const yScale = d3.scaleLinear(yDomain, yRange).nice();

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // console.log(index);
      svg
        .append('g')
        .attr(
          'transform',
          `translate(${(width / 3) * (index % 3)}, ${index <= 3 ? height : height / 2.25})`,
        )
        .call(xAxis.ticks(5))
        .selectAll('text')
        .style('text-anchor', 'middle');

      // plot the y-axis
      svg
        .append('g')
        .attr('transform', `translate(0, ${index <= 3 ? 0 : height / 1.8})`)
        .call(yAxis);

      svg
        .append('g')
        .selectAll(`dot${i}`)
        .data(d)
        .join('circle')
        // .attr('class', (f) => `dot ${f['name']}`)
        .attr('cx', (f) => xScale(f['dbh_cm']) * (index % 3))
        .attr('cy', (f) =>
          yScale(f['gross_carbon_sequestration_kg_yr'] * (index <= 3 ? 1 : 1)),
        )
        .attr('r', 4)
        .attr('stroke', 'black')
        // .style('fill', (f) => color(f.name))
        .style('opacity', 0.8);
      // .on('mouseover', mouseover)
      // .on('mouseout', mouseout)
      // .on('mousemove', mousemove);
    });

    const names = data.map((d) => d.name);
    const species = [...new Set(names)];
    // Add a scale for bubble color
    const color = d3
      .scaleOrdinal()
      .domain(species)
      // .domain((d) => d.name)
      .range(d3.schemeCategory10);
  })
  .catch((e) => {
    console.log(e);
  });
