// Task 2
d3.csv('../data/assignment4_task3.csv', d3.autoType)
  .then((data) => {
    const margin = {
      t: 60,
      r: 100,
      b: 40,
      l: 100,
    };
    const width = 600;
    const height = 500;

    // append the svg object to the div with id #task1
    const svg = d3
      .select('#a4_task3')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const aux = data.map((d) => d.year);
    const years = [...new Set(aux)];

    // add the options to the button
    d3.select('#selectYear')
      .selectAll('myOptions')
      .data(years)
      .join('option')
      .text((d) => d) // text showed in the menu
      .attr('value', (d) => d); // corresponding value returned by the button

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

    // const domMin = d3.extent(data, (d) => d.min);
    // const domMax = d3.extent(data, (d) => d.max);
    // const domains = [...domMin, ...domMax];
    // const dom = [d3.min(domains), d3.max(domains)];

    // Add X axis
    const x = d3.scaleLinear([-20, 45], [0, width]).nice();
    svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));

    // Create a Y scale for temperature
    const y = d3.scaleLinear().domain([0, 1.2]).range([height, 0]);

    // Create the Y axis for names
    const yName = d3.scaleBand(months, [0, height]).paddingInner(1.2);
    svg.append('g').call(d3.axisLeft(yName));

    function kernelDensityEstimator(kernel, X) {
      return (V) => X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);
    }
    function kernelEpanechnikov(k) {
      return (v) => (Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0);
    }
    // Compute kernel density estimation for each column:
    const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(60));

    const lineCurve = d3
      .line()
      .curve(d3.curveBasis)
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    function updateChart(year) {
      svg.selectAll('.density').remove();
      const filteredData = data.filter((d) => d.year === year);
      const densityMin = [];
      const densityMax = [];

      for (let i = 0; i < months.length; i++) {
        const key = months[i];
        const tt = filteredData.filter((d) => d.month === i + 1);
        let density = kde(tt.map((d) => d.min));
        densityMin.push({ key, density });
        density = kde(tt.map((d) => d.max));
        densityMax.push({ key, density });
      }

      // Add areas
      const minD = svg
        .selectAll('areas')
        .data(densityMin)
        .join('path')
        .attr('transform', (d) => `translate(0, ${yName(d.key) - height})`)
        .datum((d) => d.density)
        .attr('class', 'density')
        .attr('fill', 'skyblue')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .style('opacity', 0.1)
        .attr('d', lineCurve);

      const maxD = svg
        .selectAll('areas')
        .data(densityMax)
        .join('path')
        .attr('transform', (d) => `translate(0, ${yName(d.key) - height})`)
        .attr('class', 'density')
        .datum((d) => d.density)
        .attr('fill', 'indianred')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .style('opacity', 0.1)
        .attr('d', lineCurve);

      minD.transition().duration(400).style('opacity', 0.7);
      maxD.transition().duration(400).style('opacity', 0.7);
    }
    // When the button is changed, run the updateChart function
    d3.select('#selectYear').on('change', function () {
      const year = d3.select(this).property('value');
      updateChart(+year);
    });
    updateChart(1993);
  })
  .catch((e) => {
    console.log(e);
  });
