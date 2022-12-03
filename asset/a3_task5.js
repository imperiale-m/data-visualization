getData('a3')
  .then((data) => {
    const margin = {
      t: 40,
      r: 60,
      b: 40,
      l: 60,
    };
    const width = 600;
    const height = 400;

    // console.log(data[1].features);

    const treeGroups = Array(d3.flatGroup(data[1].features, (d) => d.properties.name));

    const sortedGroups = treeGroups[0].sort((a, b) => a[1].length - b[1].length).reverse();

    const top10Names = sortedGroups.map((d) => d[0]).slice(0, 10);
    // console.log(top6Names);

    // append the svg object to the div with id #a3_task5
    const svg = d3
      .select('#a3_task5')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const color = d3.scaleOrdinal().domain(top10Names).range(d3.schemeTableau10).unknown('gray');

    const top10Plus = color.domain();
    top10Plus.push('Others');

    // LEGEND
    const legend = svg.append('g').selectAll('.legend').data(top10Plus);

    legend
      .join('circle')
      .attr('cx', width + margin.r - 20)
      .attr('cy', (d, i) => 20 * i + height / 4)
      .attr('fill', (d) => color(d))
      .attr('r', 4);

    legend
      .join('text')
      .text((d) => d)
      .attr('x', width + margin.r - 30)
      .attr('y', (d, i) => 20 * i + height / 4)
      .attr('fill', (d) => color(d))
      .style('font-size', '12px')
      .style('alignment-baseline', 'middle')
      .style('text-anchor', 'end');

    const path = d3.geoPath();
    const projection = d3.geoIdentity().reflectY(true);
    projection.fitSize([width, height], data[0]);

    const tooltip = d3.select('#a3_task5').append('div').attr('class', 'tooltip');

    const mouseover = function () {
      tooltip.style('z-index', 1);
      tooltip.transition().style('opacity', 0.9);
      d3.select(this).transition().attr('fill', 'whitesmoke');
    };

    const mouseout = function () {
      tooltip.style('z-index', -1);
      tooltip.transition().style('opacity', 0);
      d3.select(this).transition().attr('fill', 'darkslategray');
    };

    const mousemove = function (event, d) {
      tooltip
        .html(
          `<b>${d.properties.nome}</b><br>
           Tree abundance = <b>${d.properties.count}</b><br>`,
        )
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    };

    svg
      .selectAll('points')
      .data(data[1].features)
      .join('circle')
      .attr('cx', (d) => projection(d.geometry.coordinates)[0])
      .attr('cy', (d) => projection(d.geometry.coordinates)[1])
      .attr('r', 2)
      .style('fill', (d) => color(d.properties.name))
      .attr('stroke', 'none')
      .attr('fill-opacity', 1);

    // Draw the map
    svg
      .append('g')
      .selectAll('path')
      .data(data[0].features)
      .join('path')
      .attr('d', path.projection(projection))
      .attr('fill', 'darkslategray')
      .style('stroke', 'darkslategray')
      .style('stroke-width', '1px')
      .attr('fill-opacity', 0.1)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', mousemove);
  })
  .catch((e) => {
    console.log(e);
  });
