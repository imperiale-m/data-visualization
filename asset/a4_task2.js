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
    // Add the first element to the end for each year
    group.map((d) => d[1].push(d[1][0]));
    const sumstat = [...group.values()];

    // append the svg object to the div with id #task1
    const svg = d3
      .select('#a4_task2')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
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
    const total = months.length; // The number of different axes
    const radius = Math.min(width / 2, height / 2); // Radius of the outermost circle
    const angleSlice = (Math.PI * 2) / total; // The width in radians of each 'slice'

    // Scale for the radius
    const rScale = d3.scaleLinear().range([0, radius]).domain(dom);

    // Wrapper for the grid & axes
    const axisGrid = svg.append('g').attr('class', 'axisWrapper');

    const levels = 5;

    const aux = data.map((d) => d.year);
    const years = [...new Set(aux)];

    const yearsDict = d3.rollup(
      years,
      () => true,
      (d) => d,
    );

    // The radial line function
    const radarLine = d3
      .lineRadial()
      .radius((d) => rScale(d.mean))
      .angle((d, i) => i * angleSlice);

    const colors = d3.scaleOrdinal(years, d3.schemeTableau10);

    const legend = svg.append('g').attr('id', 'legend2').selectAll('.legend2').data(years);

    // Draw the background circles
    axisGrid
      .selectAll('.levels')
      .data(d3.range(1, levels + 1).reverse())
      .join('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d) => (radius / levels) * d)
      .style('fill', '#D3D3D3')
      .style('stroke', '#DCDCDC')
      .style('fill-opacity', 0.1);

    // Text indicating at what each level is
    axisGrid
      .selectAll('.axisLabel')
      .data(d3.range(1, levels + 1).reverse())
      .join('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', (d) => (-d * radius) / levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .attr('fill', 'gray')
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
      .attr('class', 'line2')
      .style('stroke', '#D3D3D3')
      .style('stroke-width', '1px');

    // Append the labels at each axis
    axis
      .append('text')
      .attr('class', 'legend')
      .style('font-size', '11px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(dom[1] * 1.2) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(dom[1] * 1.2) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => d);

    function redrawChart() {
      svg.selectAll('.radarWrapper').remove();
      const filteredData = sumstat.filter((yr) => yearsDict.get(yr[0]));

      // Create a wrapper for the blobs
      const blobWrapper = svg
        .selectAll('.radarWrapper')
        .data(filteredData)
        .join('g')
        .attr('class', 'radarWrapper');

      // Append the backgrounds
      blobWrapper
        .append('path')
        .attr('class', 'radarArea')
        .attr('d', (d) => radarLine(d[1]))
        .style('fill', (d) => colors(d[0]))
        .style('fill-opacity', 0.1);

      // Create the outlines
      blobWrapper
        .append('path')
        .attr('class', 'radarStroke')
        .attr('d', (d) => radarLine(d[1]))
        .style('stroke-width', '1px')
        .style('stroke', (d) => colors(d[0]))
        .style('fill', 'none');

      // Append the circles
      blobWrapper
        .selectAll('.radarCircle')
        .data((d) => d[1])
        .join('circle')
        .attr('class', 'radarCircle')
        .attr('r', 3)
        .attr('cx', (d, i) => rScale(d.mean) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr('cy', (d, i) => rScale(d.mean) * Math.sin(angleSlice * i - Math.PI / 2))
        .style('fill', (d) => colors(d.year))
        .style('fill-opacity', 1)
        .style('stroke', 'none');

      const test = d3.selectAll('.textSelected2');
      const rect = d3.selectAll('.check2');
      function toggle(element) {
        d3.select(this).classed('disabled', !yearsDict.get(element));
      }
      test.each(toggle);
      rect.each(toggle);
    }
    redrawChart();
    //
    // LEGEND
    function clickLegendHandler(event, yr) {
      yearsDict.set(yr, !yearsDict.get(yr));
      redrawChart();
    }

    legend
      .join('rect')
      .attr('x', width / 2)
      .attr('y', (d, i) => 20 * i - height / 2)
      .attr('width', 12)
      .attr('height', 12)
      .attr('class', 'check2')
      .style('fill', (d) => colors(d))
      .style('cursor', 'pointer')
      .on('click', clickLegendHandler);
    legend
      .join('text')
      .attr('x', width / 2 + 20)
      .attr('y', (d, i) => 20 * i - height / 2 + 7)
      .text((d) => d)
      .attr('class', 'textSelected2')
      .style('font-size', '12px')
      .style('alignment-baseline', 'middle');

    const l = d3.select('#legend2');

    l.append('text')
      .attr('x', width / 2)
      .attr('y', 20 * 8 - height / 2 + 12)
      .attr('class', 'underline hover:no-underline')
      .style('fill', 'steelblue')
      .style('cursor', 'pointer')
      .text('hide all')
      .style('font-size', '11px')
      .on('click', () => {
        years.forEach((yr) => {
          yearsDict.set(yr, false);
        });
        redrawChart();
      });
    l.append('text')
      .attr('x', width / 2 + 40)
      .attr('y', 20 * 8 - height / 2 + 12)
      .attr('class', 'underline hover:no-underline')
      .style('fill', 'steelblue')
      .style('cursor', 'pointer')
      .text('show all')
      .style('font-size', '11px')
      .on('click', () => {
        years.forEach((yr) => {
          yearsDict.set(yr, true);
        });
        redrawChart();
      });
  })
  .catch((e) => {
    console.log(e);
  });
