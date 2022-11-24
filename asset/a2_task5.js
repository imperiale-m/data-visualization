// Task 5
// Data
d3.csv('../data/top6_data.csv', d3.autoType)
  .then((data) => {
    // console.log(data);

    const xDomain = [0, d3.max(data, (d) => d['dbh_cm'])];
    const xRange = [0, width];

    const yDomain = [0, d3.max(data, (d) => d['gross_carbon_sequestration_kg_yr'])];
    const yRange = [height, 0];

    const zDomain = d3.extent(data, (d) => d['crown_width_m']);
    const zRange = [1, 16];

    // console.log('domain', zDomain);

    // Construct scales and axes.
    const xScale = d3.scaleLinear(xDomain, xRange).nice();
    const yScale = d3.scaleLinear(yDomain, yRange).nice();
    // Add a scale for bubble size
    const zScale = d3.scaleLinear(zDomain, zRange);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const names = data.map((d) => d.name);
    const species = [...new Set(names)];
    // Add a scale for bubble color
    const color = d3
      .scaleOrdinal()
      .domain(species)
      // .domain((d) => d.name)
      .range(d3.schemeCategory10);

    const svg = d3
      .select('#a2_task5')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
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

    const tooltip = d3.select('#a2_task5').append('div').attr('class', 'tooltip');

    const mouseover = function () {
      tooltip.style('z-index', 1);
      tooltip.transition().style('opacity', 0.9);
      d3.select(this).style('opacity', 1);
    };

    const mouseout = function () {
      tooltip.style('z-index', -1);
      tooltip.transition().style('opacity', 0);
      d3.select(this).style('opacity', 0.8);
    };

    const mousemove = function (event, d) {
      tooltip
        .html(
          `Specie = <b>${d['name']}</b><br>Trunk diameter = <b>${d['dbh_cm']} cm</b>
                    <br>CO<sup>2</sup> = <b>${d['gross_carbon_sequestration_kg_yr']} kg/year</b>
                    <br>Canopy Size = <b>${d['crown_width_m']} m</b>`,
        )
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    };

    svg
      .append('g')
      .selectAll('dot')
      .data(data)
      .join('circle')
      .attr('cx', (d) => xScale(d['dbh_cm']))
      .attr('cy', (d) => yScale(d['gross_carbon_sequestration_kg_yr']))
      .attr('r', (d) => zScale(d['crown_width_m']))
      .style('fill', (d) => color(d['name']))
      .style('opacity', '0.7')
      .attr('stroke', 'black')
      .style('stroke-width', '1px')
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', mousemove);

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
      .text('CO2 (kg/year)');
  })
  .catch((e) => {
    console.log(e);
  });
