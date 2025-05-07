d3.json("/api/chart8/").then(function(data) {
    const margin = {top: 20, right: 30, bottom: 30, left: 150};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart8")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand()
        .domain(data.map(d => d.city))
        .range([0, height])
        .padding(0.3);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)])
        .range([0, width]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", d => y(d.city))
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("width", d => x(d.sales))
        .attr("fill", "mediumseagreen");

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
}).catch(error => {
    console.error("Error loading Chart 8:", error);
    d3.select("#chart8")
        .append("div")
        .attr("class", "error-message")
        .text("Không thể tải dữ liệu biểu đồ");
});