d3.json("/api/chart4/").then(function(data) {
    const parseTime = d3.timeParse("%Y-%m");
    data.forEach(d => {
        d.month = parseTime(d.month);
        d.sales = +d.sales;
    });

    const margin = {top: 30, right: 20, bottom: 50, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#chart4")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.month))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)])
        .range([height, 0]);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#007acc")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d.month))
            .y(d => y(d.sales)));

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
}).catch(error => {
    console.error("Error loading Chart 4:", error);
    d3.select("#chart4")
        .append("div")
        .attr("class", "error-message")
        .text("Không thể tải dữ liệu biểu đồ");
});