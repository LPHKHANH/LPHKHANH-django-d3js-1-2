d3.json("/api/chart9/").then(function(data) {
    const margin = {top: 20, right: 30, bottom: 30, left: 150};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart9")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand()
        .domain(data.map(d => d.state))
        .range([0, height])
        .padding(0.2);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)])
        .range([0, width]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", d => y(d.state))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.sales))
        .attr("fill", "steelblue");

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
}).catch(error => {
    console.error("Error loading Chart 9:", error);
    d3.select("#chart9")
        .append("div")
        .attr("class", "error-message")
        .text("Không thể tải dữ liệu biểu đồ");
});