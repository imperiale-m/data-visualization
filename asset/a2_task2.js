// Task 2
// Data
d3.csv('../data/top6_data.csv', d3.autoType)
  .then((data) => {
    const sumstat = d3.flatRollup(
      data,
      (box) => {
        const y = (k) => k['height_m'];
        const q1 = d3.quantile(
          box.map((d) => d['height_m']),
          0.25,
        );
        const median = d3.quantile(
          box.map((d) => d['height_m']),
          0.5,
        );
        const q3 = d3.quantile(
          box.map((d) => d['height_m']),
          0.75,
        );
        const iqr = q3 - q1;
        const min = d3.min(box, y);
        const max = d3.max(box, y);
        const r0 = Math.max(min, q1 - iqr * 1.5);
        const r1 = Math.min(max, q3 + iqr * 1.5);
        box.quartiles = [q1, median, q3];
        box.range = [r0, r1];
        box.outliers = box.filter((k) => k['height_m'] < r0 || k['height_m'] > r1);
        return box;
        // return { q1, median, q3, iqr, min, max };
      },
      (d) => d.name,
    );
    const xDomain = sumstat.map((d) => d[0]);
    const yDomain = [0, d3.max(data, (d) => d['height_m'])];
    const xRange = [0, width];
    const yRange = [height, 0];
    // console.log('domain', yDomain);

    // Construct scales and axes.
    const xScale = d3.scaleBand(xDomain, xRange).paddingInner(1).paddingOuter(0.5);
    const yScale = d3.scaleLinear(yDomain, yRange).nice();

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const svg = d3
      .select('#a2_task2')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    // plot the x-axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      // .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'middle');

    // plot the y-axis
    svg.append('g').call(yAxis);

    // const g = svg.append('g').selectAll('g').data(sumstat).join('g');

    // Show the main vertical line

    // const new_data = sumstat.map((d) => d[1]);
    // console.log(new_data[0]);
    svg
      .selectAll('vertLines')
      .data(sumstat)
      .join('line')
      .attr('x1', (d) => xScale(d[0]))
      .attr('x2', (d) => xScale(d[0]))
      .attr('y1', (d) => yScale(d[1].range[0]))
      .attr('y2', (d) => yScale(d[1].range[1]))
      .attr('stroke', 'black')
      .style('width', 40);

    // rectangle for the main box
    const boxWidth = 50;
    svg
      .selectAll('boxes')
      .data(sumstat)
      .join('rect')
      .attr('x', (d) => xScale(d[0]) - boxWidth / 2)
      .attr('y', (d) => yScale(d[1].quartiles[2]))
      .attr('height', (d) => yScale(d[1].quartiles[0]) - yScale(d[1].quartiles[2]))
      .attr('width', boxWidth)
      .attr('stroke', 'black')
      .style('fill', 'steelblue')
      .style('opacity', '1');

    // Show the median
    svg
      .selectAll('medianLines')
      .data(sumstat)
      .join('line')
      .attr('x1', (d) => xScale(d[0]) - boxWidth / 2)
      .attr('x2', (d) => xScale(d[0]) + boxWidth / 2)
      .attr('y1', (d) => yScale(d[1].quartiles[1]))
      .attr('y2', (d) => yScale(d[1].quartiles[1]))
      .attr('stroke', 'black')
      .style('width', 80);

    let out = sumstat.map((d) => d[1].outliers);
    out = out.flatMap((d) => d);
    // console.log('out=', out);

    // Add individual points with jitter
    const jitterWidth = 30;
    svg
      .selectAll('indPoints')
      .data(out)
      .join('circle')
      .attr('cx', (d) => xScale(d.name) - jitterWidth / 2 + Math.random() * jitterWidth)
      .attr('cy', (d) => yScale(d['height_m']))
      .attr('r', 4)
      .style('fill', 'firebrick')
      .attr('stroke', 'black')
      .style('opacity', 0.8);

    // console.log('ok=', sumstat);
    // tt = d3.groups(data, (d) => d.name)[0].slice(1);
    // console.log('tt= ', tt[0]);
    // console.log(d3.min(tt, (d) => d[0]['height_m']));
  })
  .catch((e) => {
    console.log(e);
  });
