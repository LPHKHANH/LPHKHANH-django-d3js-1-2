d3.json("/api/chart5/").then(function(data) {
    const margin = {top: 30, right: 20, bottom: 50, left: 60};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#chart5")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.quarter))
        .range([0, width])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)])
        .range([height, 0]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.quarter))
        .attr("y", d => y(d.sales))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.sales))
        .attr("fill", "steelblue");

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).selectAll("text").attr("transform", "rotate(45)").style("text-anchor", "start");
}).catch(error => {
    console.error("Error loading Chart 5:", error);
    d3.select("#chart5")
        .append("div")
        .attr("class", "error-message")
        .text("Không thể tải dữ liệu biểu đồ");
});