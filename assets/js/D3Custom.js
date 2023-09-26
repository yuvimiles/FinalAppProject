  const data = [];
  const d3BarsAmount = Number(document.getElementById('d3amount').innerText);
  for(let j = 0; j < d3BarsAmount; j ++){
    let fetchData = document.getElementById(j+'d3').innerText;
    const dataJson = JSON.parse(fetchData);
    data.push({
      id: dataJson.id,
      value: dataJson.value,
      region: dataJson.region
    });
  }

  const MARGINS = {top: 20, bottom: 30};
  const CHART_WIDTH = 600;
  const CHART_HEIGHT = 200 - MARGINS.top - MARGINS.bottom;
  
  const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
  const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);
  
  const chartContainer = d3
    .select('#generalStats')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);
  
  x.domain(data.map((d) => d.region));;
  y.domain([0, d3.max(data, (d) => d.value) + 3])

  const chart = chartContainer.append('g');

  chart
    .append('g')
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .attr('transform', `translate(0, ${CHART_HEIGHT})`)
    .attr('color', '#4f009e');



  chart
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width', x.bandwidth())
    .attr('height', (data) => CHART_HEIGHT - y(data.value))
    .attr('x', (data) => x(data.region))
    .attr('y', (data) => y(data.value));

    chart.selectAll('.lable')
      .data(data)
      .enter()
      .append('text')
      .text((data) => data.value + " Orders")
      .attr('x', (data) => x(data.region) + x.bandwidth() / 2)
      .attr('y', (data) => y(data.value) - 20)
      .attr('text-anchor', 'middle')
      .classed('lable', true);

      function renderPieChart() {
        const data = [];
        const pieAmount = Number(document.getElementById('d3pieamount').innerText);
        for(let j = 0; j < pieAmount; j ++){
          let fetchData = document.getElementById(j+'pie').innerText;
          const dataJson = JSON.parse(fetchData);
          data.push({
            _id: dataJson._id,
            count: dataJson.count
          });
        }
        const width = 900;
        const height = 900;
        const margins = { left: 200, right: 200};
        const radius = Math.min(width - margins.left - margins.right , height) / 2;
    
        // Calculate the total count of all segments
        const total = data.reduce((sum, d) => Number(sum) + Number(d.count), 0);
    
        const svg = d3.select("#categoryProductsPieChart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
        const color = d3.scaleOrdinal(["#4daf4a", "#377eb8", "#ff7f00", "#984ea3", "#e41a1c"]);
    
        const pie = d3.pie().value(d => d.count);
    
        const path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);
    
        const label = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 80);
    
        const arc = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");
    
        arc.append("path")
            .attr("d", path)
            .attr("fill", d => color(d.data._id));
    
        arc.append("text")
            .attr("transform", d => `translate(${label.centroid(d)})`)
            .attr("dy", "0.35em")
            .classed("arc-text", true)
            .text(d => {
                // Calculate the percentage for this slice
                const percent = (d.data.count / total * 100).toFixed(2) + "%";
                return d.data._id + ": " + percent;
            });
    }
    const pieGraphData = document.getElementById('pieGraphData').innerText;
    renderPieChart(pieGraphData);