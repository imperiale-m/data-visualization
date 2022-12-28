// Assignment 5
d3.csv('../data/assignment5.csv', d3.autoType)
  .then((data) => {
    const margin = {
      t: 40,
      r: 40,
      b: 40,
      l: 40,
    };
    const width = 600;
    const height = 400;

    // Format data for Sankey diagram
    // NODES
    const col = data.columns.slice(1);
    const names = [col[0], ...data.map((d) => d.name), col[1]];
    const nodes1 = d3.map(names, (d, i) => {
      const node = i;
      const name = d;
      return { node, name };
    });
    const nodes = [...nodes1];

    // LINKS
    const tot1 = d3.sum(d3.map(data, (d) => d[col[0]]));
    const tot2 = d3.sum(d3.map(data, (d) => d[col[1]]));
    const link1 = d3.map(data, (d, i) => {
      const source = 0;
      const target = i + 1;
      const value = (d[col[0]] * 100) / tot1;
      const trueVal = d[col[0]];
      return {
        source,
        target,
        value,
        trueVal,
      };
    });
    const link2 = d3.map(data, (d, i) => {
      const source = i + 1;
      const target = 12;
      const value = (d[col[1]] * 100) / tot2;
      const trueVal = d[col[1]];
      return {
        source,
        target,
        value,
        trueVal,
      };
    });
    const links = [...link1, ...link2];

    // Append the svg object to the div with id #a5
    const svg = d3
      .select('#a5')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    // Set the Sankey diagram properties
    const sankey = d3
      .sankey()
      .nodeWidth(24)
      .nodePadding(12)
      .size([width, height])
      .linkSort((a, b) => b.value - a.value)
      .nodeAlign(d3.sankeyJustify);

    const colors = [
      'rgb(252, 132, 173)',
      'rgb(252, 136, 132)',
      'rgb(233, 150, 97)',
      'rgb(201, 166, 78)',
      'rgb(160, 179, 81)',
      'rgb(111, 189, 107)',
      'rgb(40, 194, 147)',
      'rgb(0, 195, 191)',
      'rgb(0, 191, 230)',
      'rgb(47, 183, 255)',
      'rgb(135, 170, 255)',
      'rgb(193, 154, 247)',
      'rgb(233, 139, 215)',
    ];
    const color = d3.scaleOrdinal(colors);

    const sankeyData = JSON.parse(JSON.stringify({ nodes, links }));
    const graph = sankey(sankeyData);

    const tooltip = d3.select('#a5').append('div').attr('class', 'tooltip');

    const mouseover = function () {
      tooltip.style('z-index', 1);
      tooltip.transition().style('opacity', 0.9);
      d3.select(this).transition().attr('stroke-opacity', 0.4);
    };

    const mouseout = function () {
      tooltip.style('z-index', -1);
      tooltip.transition().style('opacity', 0);
      d3.select(this).transition().attr('stroke-opacity', 0.2);
    };

    function level(name) {
      if (name === col[0]) return ['Carbon Storage', 'kg'];
      return ['Total saving', '€'];
    }
    const mousemove = function (event, d) {
      tooltip
        .html(`<b>${level(d.source.name)[0]}</b><br>${d.trueVal} ${level(d.source.name)[1]}`)
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    };

    const node = svg
      .append('g')
      .selectAll('.node')
      .data(graph.nodes)
      .join('g')
      .attr('class', 'node');
    node
      .append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('fill', (d) => color(d.value))
      .attr('class', 'node')
      .attr('stroke', 'black')
      .attr('stroke-width', '0.5');

    // Add the links
    svg
      .append('g')
      .selectAll('.link')
      .data(graph.links)
      .join('path')
      .attr('class', 'link')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', (d) => Math.max(1, d.width))
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', mousemove);

    // Add the title for the nodes
    node
      .append('text')
      .attr('x', (d) => d.x0 - 5)
      .attr('y', (d) => (d.y1 + d.y0) / 2)
      .attr('dy', 2)
      .text((d) => d.name)
      .attr('text-anchor', 'end')
      .attr('font-size', '0.6rem')
      .filter((d) => d.x0 < width / 2)
      .attr('x', (d) => d.x1 + 5)
      .attr('text-anchor', 'start');
  })
  .catch((e) => {
    console.log(e);
  });
