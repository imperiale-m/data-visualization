// Task 2
d3.csv('../data/assignment4.csv', d3.autoType)
  .then((data) => {
    const margin = {
      t: 60,
      r: 100,
      b: 80,
      l: 100,
    };
    const width = 600;
    const height = 400;

    const group = d3.flatGroup(data, (d) => d.year);
    // Add the fisrt element to the end for each year
    group.map((d) => d[1].push(d[1][0]));
    const sumstat = [...group.values()];

    // append the svg object to the div with id #task1
    const svg = d3
      .select('#a4_task2')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      // .attr('transform', `translate(${margin.l}, ${margin.t})`);
      .attr('transform', `translate(${width / 2 + margin.l},${height / 2 + margin.t})`);

    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];

    const dom = d3.extent(data, (d) => d.mean);

    // const allAxis = data[0].map((i, j) => i.axis); //Names of each axis
    const total = months.length; // The number of different axes
    const radius = Math.min(width / 2, height / 2); // Radius of the outermost circle
    const angleSlice = (Math.PI * 2) / total; // The width in radians of each "slice"

    // Scale for the radius
    const rScale = d3.scaleLinear().range([0, radius]).domain(dom);

    // Wrapper for the grid & axes
    const axisGrid = svg.append('g').attr('class', 'axisWrapper');

    const levels = 5;

    // Draw the background circles
    axisGrid
      .selectAll('.levels')
      .data(d3.range(1, levels + 1).reverse())
      .join('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d) => (radius / levels) * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', 0.1);
    // .style('filter', 'url(#glow)');

    // Text indicating at what % each level is
    axisGrid
      .selectAll('.axisLabel')
      .data(d3.range(1, levels + 1).reverse())
      .join('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', (d) => (-d * radius) / levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .attr('fill', '#737373')
      .text((d) => `${Math.round((dom[1] * d) / levels)}°C`);

    // Create the straight lines radiating outward from the center
    const axis = axisGrid.selectAll('.axis').data(months).join('g').attr('class', 'axis');
    // Append the lines
    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(dom[1] * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(dom[1] * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('class', 'line')
      .style('stroke', 'gray')
      .style('stroke-width', '1px');

    // Append the labels at each axis
    axis
      .append('text')
      .attr('class', 'legend')
      .style('font-size', '11px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(dom[1] * 1.25) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(dom[1] * 1.25) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => d);
    // .call(wrap, 60);

    // The radial line function
    const radarLine = d3
      .lineRadial()
      // .interpolate('linear-closed')
      .radius((d) => rScale(d.mean))
      .angle((d, i) => i * angleSlice);

    const aux = data.map((d) => d.year);
    const years = [...new Set(aux)];
    // Create a wrapper for the blobs
    const blobWrapper = svg
      .selectAll('.radarWrapper')
      .data(sumstat)
      .join('g')
      .attr('class', 'radarWrapper');
    const colors = d3.scaleOrdinal().domain(years).range(d3.schemeTableau10);
    // Append the backgrounds
    blobWrapper
      .append('path')
      .attr('class', 'radarArea')
      .attr('d', (d) => radarLine(d[1]))
      .style('fill', (d) => colors(d[0]))
      .style('fill-opacity', 0.1);
    // .on('mouseover', function (d, i) {
    //   // Dim all blobs
    //   d3.selectAll('.radarArea').transition().duration(200).style('fill-opacity', 0.1);
    //   // Bring back the hovered over blob
    //   d3.select(this).transition().duration(200).style('fill-opacity', 0.7);
    // })
    // .on('mouseout', () => {
    //   // Bring back all blobs
    //   d3.selectAll('.radarArea')
    //     .transition()
    //     .duration(200)
    //     .style('fill-opacity', cfg.opacityArea);
    // });

    // Create the outlines
    blobWrapper
      .append('path')
      .attr('class', 'radarStroke')
      .attr('d', (d) => radarLine(d[1]))
      .style('stroke-width', '1px')
      .style('stroke', (d) => colors(d[0]))
      .style('fill', 'none');
    // .style('filter', 'url(#glow)');

    // Append the circles
    blobWrapper
      .selectAll('.radarCircle')
      .data((d) => d[1])
      .enter()
      .append('circle')
      .attr('class', 'radarCircle')
      .attr('r', 3)
      .attr('cx', (d, i) => rScale(d.mean) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.mean) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', (d) => colors(d.year))
      .style('fill-opacity', 0.8);

    // const yearsDict = d3.rollup(
    //   years,
    //   () => true,
    //   (d) => d,
    // );
    //
    // const tooltip = d3.select('#a4_task1').append('div').attr('class', 'tooltip');
    //
    // function mouseover() {
    //   tooltip.style('z-index', 1);
    //   tooltip.transition().style('opacity', 0.9);
    //   d3.select(this).transition().attr('r', 6);
    // }
    //
    // function mouseout() {
    //   tooltip.style('z-index', -1);
    //   tooltip.transition().style('opacity', 0);
    //   d3.select(this).transition().attr('r', 4);
    // }
    //
    // function mousemove(event, d) {
    //   let text = '';
    //   switch (this.className.baseVal) {
    //     case 'dot dotMin':
    //       text = `Min: ${d.min}&degC`;
    //       break;
    //     case 'dot dotMax':
    //       text = `Max: ${d.max}&degC`;
    //       break;
    //     case 'dot dotMean':
    //       text = `Mean: ${d.mean}&degC`;
    //       break;
    //     default:
    //       text = 'Error';
    //   }
    //   tooltip
    //     .html(`<b>${months[d.month - 1]} ${d.year}</b><br>${text}`)
    //     .style('top', `${event.pageY}px`)
    //     .style('left', `${event.pageX + 20}px`);
    // }
    //
    // const legend = svg.append('g').attr('class', 'legends').selectAll('.legend').data(years);
    // function redrawChart() {
    //   svg.selectAll('.line').remove();
    //   svg.selectAll('.dot').remove();
    //
    //   const filteredData = sumstat.filter((yr) => yearsDict.get(yr[0]));
    //
    //   svg
    //     .selectAll('.lineMin')
    //     .data(filteredData)
    //     .join('path')
    //     .attr('class', 'line')
    //     .attr('d', (d) => lineMin(d[1]))
    //     .attr('stroke', (d) => lighten(colors(d[0])))
    //     .style('stroke-width', 1)
    //     .style('fill', 'none');
    //
    //   svg
    //     .selectAll('.dotMin')
    //     .data(data.filter((d) => yearsDict.get(d.year)))
    //     .join('circle')
    //     .attr('class', 'dot dotMin')
    //     .attr('cx', lineMin.x())
    //     .attr('cy', lineMin.y())
    //     .attr('r', 3.5)
    //     .style('fill', (d) => lighten(colors(d.year)))
    //     .style('stroke', 'white')
    //     .style('stroke-width', '1px');
    //
    //   svg
    //     .selectAll('.lineMax')
    //     .data(filteredData)
    //     .join('path')
    //     .attr('class', 'line')
    //     .attr('d', (d) => lineMax(d[1]))
    //     .attr('stroke', (d) => darken(colors(d[0])))
    //     .style('stroke-width', 1)
    //     .style('fill', 'none');
    //
    //   svg
    //     .selectAll('.dotMax')
    //     .data(data.filter((d) => yearsDict.get(d.year)))
    //     .join('circle')
    //     .attr('class', 'dot dotMax')
    //     .attr('cx', lineMax.x())
    //     .attr('cy', lineMax.y())
    //     .attr('r', 3.5)
    //     .style('fill', (d) => darken(colors(d.year)))
    //     .style('stroke', 'white')
    //     .style('stroke-width', '1px');
    //
    //   svg
    //     .selectAll('.dotMean')
    //     .data(data.filter((d) => yearsDict.get(d.year)))
    //     .join('circle')
    //     .attr('class', 'dot dotMean')
    //     .attr('cx', (d) => x(months[d.month - 1]))
    //     .attr('cy', (d) => y(d.mean))
    //     .attr('r', 3)
    //     .style('fill', (d) => colors(d.year))
    //     .style('stroke', 'none')
    //     .style('stroke-width', '0.5px');
    //
    //   svg
    //     .selectAll('.dot')
    //     .on('mouseover', mouseover)
    //     .on('mouseout', mouseout)
    //     .on('mousemove', mousemove);
    //
    //   const test = d3.selectAll('.textSelected');
    //   const rect = d3.selectAll('rect');
    //   function toggle(element) {
    //     d3.select(this).classed('disabled', !yearsDict.get(element));
    //   }
    //   test.each(toggle);
    //   rect.each(toggle);
    // }
    // redrawChart();
    //
    // // LEGEND
    // function clickLegendHandler(event, yr) {
    //   yearsDict.set(yr, !yearsDict.get(yr));
    //   redrawChart();
    // }
    //
    // legend
    //   .join('rect')
    //   .attr('x', width + margin.r - 80)
    //   .attr('y', (d, i) => 20 * i)
    //   .attr('width', 12)
    //   .attr('height', 12)
    //   .attr('class', 'check')
    //   .style('fill', (d) => colors(d))
    //   .style('cursor', 'pointer')
    //   .on('click', clickLegendHandler);
    // legend
    //   .join('text')
    //   .attr('x', width + margin.r - 60)
    //   .attr('y', (d, i) => 20 * i + 7)
    //   .text((d) => d)
    //   .attr('class', 'textSelected')
    //   .style('font-size', '12px')
    //   .style('alignment-baseline', 'middle');
    //
    // const l = d3.select('.legends');
    // l.append('text')
    //   .attr('x', width + margin.r - 80)
    //   .attr('y', 20 * 8 + 12)
    //   .attr('class', 'hide-all-option underline hover:no-underline')
    //   .style('fill', 'steelblue')
    //   .style('cursor', 'pointer')
    //   .text('hide all')
    //   .style('font-size', '11px')
    //   .on('click', () => {
    //     years.forEach((yr) => {
    //       yearsDict.set(yr, false);
    //     });
    //     redrawChart();
    //   });
    // l.append('text')
    //   .attr('x', width + margin.r - 40)
    //   .attr('y', 20 * 8 + 12)
    //   .attr('class', 'show-all-option underline hover:no-underline')
    //   .style('fill', 'steelblue')
    //   .style('cursor', 'pointer')
    //   .text('show all')
    //   .style('font-size', '11px')
    //   .on('click', () => {
    //     years.forEach((yr) => {
    //       yearsDict.set(yr, true);
    //     });
    //     redrawChart();
    //   });
  })
  .catch((e) => {
    console.log(e);
  });
