// Task 5
// Data
d3.csv('../data/top6_data.csv', d3.autoType)
  .then((data) => {
    // console.log(data);

    const sumstat = d3.group(data, (d) => d.name);
    // console.log(sumstat);

    const allKeys = [...sumstat.keys()];
    // console.log(allKeys);

    const names = data.map((d) => d.name);
    const species = [...new Set(names)];
    // Add a scale for bubble color
    const color = d3
      .scaleOrdinal()
      .domain(species)
      // .domain((d) => d.name)
      .range(d3.schemeCategory10);

    const xDomain = [0, d3.max(data, (d) => d['dbh_cm'])];
    const yDomain = [0, d3.max(data, (d) => d['gross_carbon_sequestration_kg_yr'])];

    sumstat.forEach((d, i) => {
      const margin = {
        t: 60,
        r: 60,
        b: 60,
        l: 60,
      };
      const width = 300;
      const height = 200;

      const xRange = [0, width];
      const yRange = [height, 0];

      // Construct scales and axes.
      const xScale = d3.scaleLinear(xDomain, xRange).nice();
      const yScale = d3.scaleLinear(yDomain, yRange).nice();

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      const svg = d3
        .select('#a2_task4')
        .append('svg')
        .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
        .attr('style', 'max-width: 40%; height: auto')
        .attr('class', 'inline-block')
        .append('g')
        .attr('transform', `translate(${margin.l}, ${margin.t})`);

      // console.log(index);
      svg
        .append('g')
        .attr('transform', `translate(${0}, ${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'middle');

      // plot the y-axis
      svg
        .append('g')
        // .attr('transform', `translate(0, ${height})`)
        .call(yAxis);

      svg
        .append('g')
        .selectAll(`dot${i}`)
        .data(d)
        .join('circle')
        // .attr('class', (f) => `dot ${f['name']}`)
        .attr('cx', (f) => xScale(f['dbh_cm']))
        .attr('cy', (f) => yScale(f['gross_carbon_sequestration_kg_yr']))
        .attr('r', 2)
        // .attr('stroke', 'black')
        .style('fill', (f) => color(f.name))
        .style('opacity', 0.7);

      // Title
      svg
        .append('text')
        .attr('transform', `translate(${10}, ${margin.t - 60})`)
        .style('fill', color(i))
        .style('font-size', '0.825em')
        .style('font-weight', '700')
        .text(i);

      // x-axis name
      svg
        .append('text')
        .attr('transform', `translate(${width / 2 - 40}, ${height + margin.b - 25})`)
        .style('font-size', '0.7em')
        .style('opacity', 0.7)
        .text('TRUNK DIAMETER (cm)');
      // y-axis name
      svg
        .append('text')
        .attr('transform', `translate(${-margin.l + 25}, ${height / 2}) rotate(-90)`)
        .style('font-size', '0.7em')
        .style('opacity', 0.7)
        .text('CO2 (kg/year)');
    });
  })
  .catch((e) => {
    console.log(e);
  });
