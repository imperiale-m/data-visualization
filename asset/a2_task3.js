// Task 3
// Data
d3.csv('../data/top6_data.csv', d3.autoType)
  .then((data) => {
    // console.log(data);

    const xDomain = [0, d3.max(data, (d) => d['dbh_cm'])];
    const xRange = [0, width];

    const yDomain = [0, d3.max(data, (d) => d['gross_carbon_sequestration_kg_yr'])];
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

    const names = data.map((d) => d.name);
    const species = [...new Set(names)];
    // Add a scale for bubble color
    const color = d3
      .scaleOrdinal()
      .domain(species)
      // .domain((d) => d.name)
      .range(d3.schemeCategory10);

    const tooltip = d3.select('#a2_task3').append('div').attr('class', 'tooltip');

    const mouseover = function () {
      tooltip.style('z-index', 1);
      tooltip.transition().style('opacity', 0.9);
      d3.select(this).transition().style('opacity', 1).attr('r', 6);
    };

    const mouseout = function () {
      tooltip.style('z-index', -1);
      tooltip.transition().style('opacity', 0);
      d3.select(this).transition().style('opacity', 0.8).attr('r', 4);
    };

    const mousemove = function (event, d) {
      tooltip
        .html(
          `Specie = <b>${d['name']}</b><br>Trunk diameter = <b>${d['dbh_cm']} cm</b>
                    <br>CO<sup>2</sup> = <b>${d['gross_carbon_sequestration_kg_yr']} kg/year</b>`,
        )
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    };

    svg
      .append('g')
      .selectAll('dot')
      .data(data)
      .join('circle')
      .attr('class', (d) => `dot ${d['name']}`)
      .attr('cx', (d) => xScale(d['dbh_cm']))
      .attr('cy', (d) => yScale(d['gross_carbon_sequestration_kg_yr']))
      .attr('r', 4)
      .attr('stroke', 'black')
      .style('stroke-width', 'px')
      .style('fill', (d) => color(d.name))
      .style('opacity', 0.8)
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
