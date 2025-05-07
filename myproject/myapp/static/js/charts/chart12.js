d3.json("/api/chart12/").then(function(data) {
    const margin = {top: 30, right: 30, bottom: 50, left: 60};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#chart12")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.ship_mode))
        .range([0, width])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.avg_days)])
        .range([height, 0]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.ship_mode))
        .attr("y", d => y(d.avg_days))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.avg_days))
        .attr("fill", "tomato");

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
}).catch(error => {
    console.error("Error loading Chart 12:", error);
    d3.select("#chart12")
        .append("div")
        .attr("class", "error-message")
        .text("Không thể tải dữ liệu biểu đồ");
});