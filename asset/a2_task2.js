// Task 2
// Data
d3.csv('../data/top6_data.csv', d3.autoType)
  .then((data) => {
    const sumstat = d3.flatRollup(
      data,
      (box) => {
        const y = (k) => k.dbh_cm;
        const q1 = d3.quantile(
          box.map((d) => d.dbh_cm),
          0.25,
        );
        const median = d3.quantile(
          box.map((d) => d.dbh_cm),
          0.5,
        );
        const q3 = d3.quantile(
          box.map((d) => d.dbh_cm),
          0.75,
        );
        const iqr = q3 - q1;
        const min = d3.min(box, y);
        const max = d3.max(box, y);
        const r0 = Math.max(min, q1 - iqr * 1.5);
        const r1 = Math.min(max, q3 + iqr * 1.5);
        box.quartiles = [q1, median, q3];
        box.range = [r0, r1];
        box.outliers = box.filter((k) => k.dbh_cm < r0 || k.dbh_cm > r1);
        return box;
        // return { q1, median, q3, iqr, min, max };
      },
      (d) => d.name,
    );
    const xDomain = sumstat.map((d) => d[0]);
    const yDomain = [0, d3.max(data, (d) => d.dbh_cm)];
    const xRange = [0, width];
    const yRange = [height, 0];
    // console.log('domain', yDomain);

    // Construct scales and axes.
    const xScale = d3.scaleBand(xDomain, xRange).paddingInner(1).paddingOuter(0.5);
    const yScale = d3.scaleLinear(yDomain, yRange).nice();

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // console.log(sumstat);

    const svg = d3
      .select('#a2_task2')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const species = sumstat.map((d) => d[0]);
    // console.log(species);
    // const species = [...new Set(names)];
    // Add a scale for bubble color
    const color = d3.scaleOrdinal().domain(species).range(d3.schemeCategory10);

    // plot the x-axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('class', 'x-label');

    d3.selectAll('.x-label')
      .attr('class', 'font-semibold')
      .attr('fill', (d) => color(d));

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

    const tooltip = d3.select('#a2_task2').append('div').attr('class', 'tooltip');

    const mouseover = function (event, d) {
      tooltip.style('z-index', 1);
      tooltip.transition().style('opacity', 0.9);
      d3.selectAll('.box').transition().duration(500).style('fill', 'gray');
      d3.select(this).transition().duration(500).style('fill', color(d[0]));
    };

    const mouseout = function () {
      tooltip.style('z-index', -1);
      tooltip.transition().style('opacity', 0);
      d3.selectAll('.box').transition().style('fill', (d) => color(d[0]));
    };

    const mousemove = function (event, d) {
      tooltip
        .html(
          `25th percentile = <b>${d[1].quartiles[0]} cm</b><br>Median = <b>${d[1].quartiles[1]} cm</b>
           <br>75th percentile = <b>${d[1].quartiles[2]} cm</b><br>min = <b>${d[1].range[0]} cm</b>
           <br>max = <b>${d[1].range[1]} cm</b>`,
        )
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    };

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
      .attr('class', 'box')
      .style('fill', (d) => color(d[0]))
      .style('opacity', '1')
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', mousemove);

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
      .attr('cy', (d) => yScale(d.dbh_cm))
      .attr('r', 4)
      .style('fill', 'gold')
      .attr('stroke', 'black')
      .style('opacity', 0.8);

    // x-axis name
    svg
      .append('text')
      .attr('transform', `translate(${width / 2 - 40}, ${height + margin.b - 35})`)
      .attr('class', 'axis-name')
      .text('SPECIES');
    // y-axis name
    svg
      .append('text')
      .attr('transform', `translate(${-margin.l + 40}, ${height / 2}) rotate(-90)`)
      .attr('class', 'axis-name')
      .text('TRUNK DIAMETER (cm)');

    // console.log('ok=', sumstat);
    // tt = d3.groups(data, (d) => d.name)[0].slice(1);
    // console.log('tt= ', tt[0]);
    // console.log(d3.min(tt, (d) => d[0]['dbh_cm']));
  })
  .catch((e) => {
    console.log(e);
  });
