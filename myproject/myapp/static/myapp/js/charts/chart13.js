d3.json("/api/chart13/").then(function(data) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#chart13")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.count);
    const data_ready = pie(data);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll('path')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.ship_mode))
        .style("stroke", "white")
        .style("stroke-width", "2px");

    svg.selectAll("text")
        .data(data_ready)
        .enter()
        .append("text")
        .text(d => `${d.data.ship_mode}: ${d.data.count}`)
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px");
}).catch(error => {
    console.error("Error loading Chart 13:", error);
    d3.select("#chart13")
        .append("div")
        .attr("class", "error-message")
        .text("Không thể tải dữ liệu biểu đồ");
});