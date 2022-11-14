// Task 2
// Data
d3.csv('../data/task2.csv', d3.autoType)
  .then((data) => {
    // console.log(data[0]);
    const margin = {
      t: 40,
      r: 40,
      b: 40,
      l: 40,
    };
    const sideLength = 400;

    const dataColumns = Object.keys(data[0]);
    // List of subgroups
    const subgroups = dataColumns.slice(1, 7);
    // console.log(subgroups);

    const districts = data.map((d) => d.district);

    // Build color scale
    const color = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#c4c4c4'];

    const total = data.map((d) => d.tot);

    const svg = d3
      .select('#task5')
      .append('svg')
      .attr('viewBox', [0, 0, sideLength + margin.l + margin.r, sideLength + margin.t + margin.b])
      .attr('style', 'max-width: 50%; height: auto; height: intrinsic;')
      .attr('class', 'ml-[20%]')
      .append('g')
      .attr('transform', `translate(${margin.l},${margin.t})`);

    // add the options to the button
    d3.select('#selectButton')
      .selectAll('myOptions')
      .data(districts)
      .join('option')
      .text((d) => d) // text showed in the menu
      .attr('value', (d) => d); // corresponding value returned by the button

    // Labels of row and columns
    const waffleX = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10'];
    const waffleY = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'];

    const waffleUnits = waffleX.length * waffleY.length;

    const waffleData = [];

    // Process data for every waffle
    data.forEach((w, wi) => {
      let currX = 0;
      const arr = [];
      subgroups.forEach((d, k) => {
        const squareValue = total[wi] / waffleUnits;
        const units = Math.ceil(w[d] / squareValue);
        const rows = Math.ceil(units / waffleX.length);
        let count = 0;
        for (let y = Math.floor(currX / 10); y < y + rows + 1; y += 1) {
          // currY = y;
          if (count === units || arr.length === waffleUnits) {
            break;
          }
          for (let x = currX % 10; x < waffleX.length; x += 1) {
            arr.push([waffleX[x], waffleY[y], k]);
            count += 1;
            currX += 1;
            if (count === units || arr.length === waffleUnits) {
              break;
            }
          }
        }
      });
      waffleData.push(arr);
    });

    // Build X scales and axis:
    const x = d3.scaleBand().range([0, sideLength]).domain(waffleX).padding(0.05);
    // svg.append('g').attr('transform', `translate(0, ${sideLength})`).call(d3.axisBottom(x));

    // Build X scales and axis:
    const y = d3.scaleBand().range([sideLength, 0]).domain(waffleY).padding(0.05);
    // svg.append('g').call(d3.axisLeft(y));

    const tooltip = d3.select('#task5').append('div').attr('class', 'tooltip');

    // const t = d3.transition().duration(1000).style('stroke', 'black');

    function mouseover(event, d) {
      tooltip.transition().style('opacity', 1);
      const groupClass = `group${d[2]}`;
      const selection = d3.selectAll(`.${groupClass}`);
      selection.transition().style('stroke', 'black').style('opacity', 1);
    }

    function mousemove(event, d) {
      const selectedOption = d3.select('#selectButton').property('selectedIndex');
      const count = data[selectedOption][subgroups[d[2]]];
      tooltip
        .html(`Tree type: <b>${subgroups[d[2]]}</b><br>Count: <b>${count}</b>`)
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    }

    function mouseout(event, d) {
      tooltip.transition().style('opacity', 0);
      const groupClass = `group${d[2]}`;
      const selection = d3.selectAll(`.${groupClass}`);
      selection.transition().style('stroke', 'none').style('opacity', 0.9);
    }

    // A function that update the chart
    function updateChart(selectedGroup) {
      svg.selectAll('*').remove();

      const rect = svg
        .selectAll()
        .data(waffleData[selectedGroup], (d) => `${d[0]}:${d[1]}`)
        .join('rect')
        .attr('x', (d) => x(d[0]) + 1)
        .attr('y', (d) => y(d[1]))
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('class', (d) => `group${d[2]}`)
        .style('stroke-width', 2)
        .style('stroke', 'none')
        .style('opacity', 0)
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', (d) => color[d[2]])
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseout);

      rect
        .transition()
        .duration(400)
        .delay((d, i) => i * 8)
        .style('opacity', 0.9);
    }

    // When the button is changed, run the updateChart function
    d3.select('#selectButton').on('change', function () {
      const selectedOption = d3.select(this).property('selectedIndex');
      updateChart(selectedOption);
    });
    updateChart('0');
  })
  .catch((e) => {
    console.log(e);
  });
