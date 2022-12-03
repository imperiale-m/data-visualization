const promiseCache2 = new Map();
function getData3_2(dataId) {
  // If the promise is not stored in the cache, fetch it
  if (!promiseCache2.has(dataId)) {
    const data = Promise.all([
      d3.json('../data/trento.geojson'),
      d3.json('../data/trento_trees.geojson'),
    ]);
    // Store promise in the cache
    promiseCache2.set(dataId, data);
  }
  // Return the promise from cache
  return promiseCache2.get(dataId);
}

getData3_2(1)
  .then((data) => {
    const margin = {
      t: 40,
      r: 60,
      b: 40,
      l: 60,
    };
    const width = 600;
    const height = 400;

    // append the svg object to the div with id #a3_task4
    const svg = d3
      .select('#a3_task4')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const path = d3.geoPath();
    const projection = d3.geoIdentity().reflectY(true);
    projection.fitSize([width, height], data[0]);

    const tooltip = d3.select('#a3_task4').append('div').attr('class', 'tooltip');

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
      .data(data[1].features.map((d) => d.geometry))
      .join('circle')
      .attr('cx', (d) => projection(d.coordinates)[0])
      .attr('cy', (d) => projection(d.coordinates)[1])
      .attr('r', 2)
      .style('fill', 'green')
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
