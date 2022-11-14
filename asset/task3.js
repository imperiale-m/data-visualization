// Data
d3.csv('../data/data3.csv', d3.autoType).then((data) => {
  // console.log(data);

  const svg = d3
    .select('#task3')
    .append('svg')
    .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + 20 + margin.b])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .append('g')
    .attr('transform', `translate(${margin.l}, ${margin.t + 20})`);

  // console.log(Object.keys(data[0]).slice(1));

  const N = 5;

  let arr = [];
  for (let i = 0; i < N; i++) {
    arr = [...arr, ...Object.values(data[i]).slice(1)];
  }
  // console.log(arr)

  const max = d3.max(arr);
  // console.log("max", max);

  for (let i = 0; i < N; i++) {
    const yDomain = Object.keys(data[i]).slice(1);

    const x = d3.scaleLinear([0, max], [0, width / 7]);

    const y = d3.scaleBand(yDomain, [0, height]).padding(0.1);

    svg
      .append('g')
      .attr('transform', `translate(${(width / 5) * i}, ${height})`)
      .call(d3.axisBottom(x).ticks(4).tickSizeOuter(0))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    if (i === 0) {
      svg.append('g').call(d3.axisLeft(y)).select('.domain').remove();
    }

    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

    svg
      .append('text')
      .attr('transform', `translate(${(width / 5) * i}, ${-10})`)
      .attr('class', 'font-bold')
      .style('font-size', '0.6rem')
      .style('fill', colors[i])
      .text(Object.values(data[i]).slice(0, 1));

    svg
      .selectAll(`rect${i}`)
      .data(Object.entries(data[i]))
      .join('rect')
      .attr('x', (width / 5) * i)
      .attr('y', (d) => y(d[0]))
      .attr('width', (d) => x(d[1]))
      .attr('height', y.bandwidth())
      .attr('fill', colors[i]);
  }
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
});
