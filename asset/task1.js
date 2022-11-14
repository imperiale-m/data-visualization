// Task 1
const margin = {
  t: 20,
  r: 40,
  b: 60,
  l: 200,
};
const width = 600;
const height = 400;

// Data
d3.csv('../data/data1.csv', d3.autoType)
  .then((data) => {
    // append the svg object to the div with id #task1
    const svg = d3
      .select('#task1')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    // number of elements to plot
    const N = 10;

    const top6 = data.slice(0, N);

    // console.log(data);

    // max value for the x-axis
    const max = d3.max(top6, (d) => d.count);

    const x = d3.scaleLinear([0, max], [0, width]).nice();

    const y = d3
      .scaleBand(
        top6.map((d) => d.name),
        [0, height],
      )
      .padding(0.1);

    // plot the x-axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'middle');

    // plot the y-axis
    svg.append('g').call(d3.axisLeft(y)).select('.domain').remove();

    const tooltip = d3.select('#task1').append('div').attr('class', 'tooltip');

    const color = d3
      .scaleLinear()
      .domain([0, max])
      .range(['gray', 'darkgreen'])
      .interpolate(d3.interpolateRgb.gamma(2.2));

    const mouseover = function () {
      tooltip.style('opacity', 0.9);
      d3.select(this).style('stroke', 'black').style('opacity', 1);
    };

    const mouseout = function (event, d) {
      tooltip.style('opacity', 0);
      d3.select(this).style('stroke', 'none').attr('fill', color(d.count)).style('opacity', 0.8);
    };

    const mousemove = function (event, d) {
      tooltip
        .html(
          `Count = <b>${d.count}</b><br>Mean canopy size = <b>${d['mean_canopy_size']}</b> m<sup>2</sup>`,
        )
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    };

    svg
      .selectAll('rect')
      .data(top6)
      .join('rect')
      .attr('x', 0.5)
      .attr('y', (d) => y(d.name))
      .attr('width', (d) => x(d.count))
      .attr('height', y.bandwidth())
      .attr('fill', (d) => color(d.count))
      .style('opacity', 0.8)
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
      .text('SPECIES');
  })
  .catch((e) => {
    console.log(e);
  });
