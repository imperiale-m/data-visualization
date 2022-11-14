// Task 2
// Data
d3.csv('../data/data2.csv', d3.autoType)
  .then((data) => {
    // console.log(data);

    const svg = d3
      .select('#task2')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const dataColumns = Object.keys(data[0]);
    // console.log(dataColumns);

    // List of subgroups
    const subgroups = dataColumns.slice(1);

    const groups = data.map((d) => d['district']);
    // console.log(groups);

    const stackedData = d3.stack().order(d3.stackOrderNone).keys(subgroups)(data);

    const max = d3.max(stackedData[stackedData.length - 1], (d) => d[1]);
    // console.log(max);

    const x = d3.scaleLinear([0, max], [0, width]);

    const y = d3.scaleBand(groups, [0, height]).padding(0.1);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .style('text-anchor', 'middle');

    svg.append('g').call(d3.axisLeft(y)).select('.domain').remove();

    const tooltip = d3.select('#task2').append('div').attr('class', 'tooltip');

    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#c4c4c4']);

    const mouseover = function () {
      tooltip.style('opacity', 1);
      d3.select(this).style('stroke', 'black').style('opacity', 1);
    };

    const mouseout = function () {
      tooltip.style('opacity', 0);
      d3.select(this).style('stroke', 'none').style('opacity', 0.9);
    };

    const mousemove = function (event, d) {
      const subgroupName = d3.select(this.parentNode).datum().key;
      const subgroupValue = d.data[subgroupName];
      tooltip
        .html(`Tree type = <b>${subgroupName}</b><br>Count = <b>${subgroupValue}</b>`)
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    };

    svg
      .append('g')
      .selectAll('g')
      // Enter the stack data = loop key per key = group per group
      .data(stackedData)
      .join('g')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d) => d)
      .join('rect')
      .attr('y', (d) => y(d.data['district']))
      .attr('x', (d) => x(d[0]))
      .attr('width', (d) => x(d[1]) - x(d[0]))
      .attr('height', y.bandwidth())
      .style('opacity', 0.9)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', mousemove);

    // x-axis name
    svg
      .append('text')
      .attr('transform', `translate(${width / 2 - 50}, ${height + margin.b - 15})`)
      .attr('class', 'axis-name')
      .text('NUMBER OF TREES');
    // y-axis name
    svg
      .append('text')
      .attr('transform', `translate(${-margin.l + 40}, ${height / 2}) rotate(-90)`)
      .attr('class', 'axis-name')
      .text('DISTRICT');
  })
  .catch((e2) => {
    console.log(e2);
  });
