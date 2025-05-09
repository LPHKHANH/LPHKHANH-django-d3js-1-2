d3.json("/api/chart3/").then(function(data) {
    const sales = data.sales;

    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#chart3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain(d3.extent(sales))
        .nice()
        .range([0, width]);

    const histogram = d3.bin()
        .domain(x.domain())
        .thresholds(x.ticks(40));

    const bins = histogram(sales);

    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => height - y(d.length))
        .attr("fill", "#69b3a2");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
}).catch(error => {
    console.error("Error loading Chart 3:", error);
    d3.select("#chart3")
        .append("div")
        .attr("class", "error-message")
        .text("Không thể tải dữ liệu biểu đồ");
});