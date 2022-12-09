// Task 1
d3.csv('../data/assignment4.csv', d3.autoType)
  .then((data) => {
    const margin = {
      t: 20,
      r: 100,
      b: 80,
      l: 100,
    };
    const width = 600;
    const height = 400;

    const group = d3.flatGroup(data, (d) => d.year);
    const sumstat = [...group.values()];

    // append the svg object to the div with id #task1
    const svg = d3
      .select('#a4_task1')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

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

    // Add X axis
    const x = d3.scalePoint(months, [0, width]).padding(1);
    svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));

    const domMin = d3.extent(data, (d) => d.min);
    const domMax = d3.extent(data, (d) => d.max);
    const domains = [...domMin, ...domMax];
    const dom = [d3.min(domains), d3.max(domains)];

    // Add Y axis
    const y = d3.scaleLinear().domain(dom).range([height, 0]).nice();
    svg.append('g').call(d3.axisLeft(y));

    const aux = data.map((d) => d.year);
    const years = [...new Set(aux)];

    const colors = d3.scaleOrdinal().domain(years).range(d3.schemeTableau10);

    function darken(color, k = 1) {
      const { l, c, h } = d3.lch(color);
      return d3.lch(l - 6 * k, c, h);
    }
    function lighten(color, k = 1) {
      const { l, c, h } = d3.lch(color);
      return d3.lch(l + 6 * k, c, h);
    }

    const lineMin = d3
      .line()
      .x((d) => x(months[d.month - 1]))
      .y((d) => y(d.min));

    const lineMax = d3
      .line()
      .x((d) => x(months[d.month - 1]))
      .y((d) => y(d.max));

    const yearsDict = d3.rollup(
      years,
      () => true,
      (d) => d,
    );

    const tooltip1 = d3.select('#a4_task1').append('div').attr('class', 'tooltip');

    function mouseover() {
      tooltip1.style('z-index', 1);
      tooltip1.transition().style('opacity', 0.9);
      d3.select(this).transition().attr('r', 6);
    }

    function mouseout() {
      tooltip1.style('z-index', -1);
      tooltip1.transition().style('opacity', 0);
      d3.select(this).transition().attr('r', 4);
    }

    function mousemove(event, d) {
      let text;
      switch (this.className.baseVal) {
        case 'dot dotMin':
          text = `Min: ${d.min}&degC`;
          break;
        case 'dot dotMax':
          text = `Max: ${d.max}&degC`;
          break;
        case 'dot dotMean':
          text = `Mean: ${d.mean}&degC`;
          break;
        default:
          text = 'Error';
      }
      tooltip1
        .html(`<b>${months[d.month - 1]} ${d.year}</b><br>${text}`)
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    }

    const legend = svg.append('g').attr('id', 'legend1').selectAll('.legend1').data(years);
    function redrawChart() {
      svg.selectAll('.line').remove();
      svg.selectAll('.dot').remove();

      const filteredData = sumstat.filter((yr) => yearsDict.get(yr[0]));

      svg
        .selectAll('.lineMin')
        .data(filteredData)
        .join('path')
        .attr('class', 'line')
        .attr('d', (d) => lineMin(d[1]))
        .attr('stroke', (d) => lighten(colors(d[0])))
        .style('stroke-width', 1)
        .style('fill', 'none');

      svg
        .selectAll('.dotMin')
        .data(data.filter((d) => yearsDict.get(d.year)))
        .join('circle')
        .attr('class', 'dot dotMin')
        .attr('cx', lineMin.x())
        .attr('cy', lineMin.y())
        .attr('r', 3.5)
        .style('fill', (d) => lighten(colors(d.year)))
        .style('stroke', 'white')
        .style('stroke-width', '1px');

      svg
        .selectAll('.lineMax')
        .data(filteredData)
        .join('path')
        .attr('class', 'line')
        .attr('d', (d) => lineMax(d[1]))
        .attr('stroke', (d) => darken(colors(d[0])))
        .style('stroke-width', 1)
        .style('fill', 'none');

      svg
        .selectAll('.dotMax')
        .data(data.filter((d) => yearsDict.get(d.year)))
        .join('circle')
        .attr('class', 'dot dotMax')
        .attr('cx', lineMax.x())
        .attr('cy', lineMax.y())
        .attr('r', 3.5)
        .style('fill', (d) => darken(colors(d.year)))
        .style('stroke', 'white')
        .style('stroke-width', '1px');

      svg
        .selectAll('.dotMean')
        .data(data.filter((d) => yearsDict.get(d.year)))
        .join('circle')
        .attr('class', 'dot dotMean')
        .attr('cx', (d) => x(months[d.month - 1]))
        .attr('cy', (d) => y(d.mean))
        .attr('r', 3)
        .style('fill', (d) => colors(d.year))
        .style('stroke', 'none');

      svg
        .selectAll('.dot')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove);

      const test = d3.selectAll('.textSelected1');
      const rect = d3.selectAll('.check1');
      function toggle(element) {
        d3.select(this).classed('disabled', !yearsDict.get(element));
      }
      test.each(toggle);
      rect.each(toggle);
    }
    redrawChart();

    // LEGEND
    function clickLegendHandler(event, yr) {
      yearsDict.set(yr, !yearsDict.get(yr));
      redrawChart();
    }

    legend
      .join('rect')
      .attr('x', width + margin.r - 80)
      .attr('y', (d, i) => 20 * i)
      .attr('width', 12)
      .attr('height', 12)
      .attr('class', 'check1')
      .style('fill', (d) => colors(d))
      .style('cursor', 'pointer')
      .on('click', clickLegendHandler);
    legend
      .join('text')
      .attr('x', width + margin.r - 60)
      .attr('y', (d, i) => 20 * i + 7)
      .text((d) => d)
      .attr('class', 'textSelected1')
      .style('font-size', '12px')
      .style('alignment-baseline', 'middle');

    const l = d3.select('#legend1');
    l.append('text')
      .attr('x', width + margin.r - 80)
      .attr('y', 20 * 8 + 12)
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
      .attr('x', width + margin.r - 40)
      .attr('y', 20 * 8 + 12)
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

    // x-axis name
    svg
      .append('text')
      .attr('transform', `translate(${width / 2 - 20}, ${height + margin.b - 40})`)
      .attr('class', 'axis-name')
      .text('Month');
    // y-axis name
    svg
      .append('text')
      .attr('transform', `translate(${-margin.l + 50}, ${height / 2 + 30}) rotate(-90)`)
      .attr('class', 'axis-name')
      .text('Degrees (Celsius)');
  })
  .catch((e) => {
    console.log(e);
  });
