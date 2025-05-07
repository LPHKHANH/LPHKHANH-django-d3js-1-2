d3.json("/api/chart1/").then(function(data) {
    const totalSales = data.total_sales;

    const width = 300;
    const height = 200;

    const svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "32px")
        .style("font-weight", "bold")
        .text(`$${d3.format(",.2f")(totalSales)}`);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Tổng doanh số");
}).catch(error => {
    console.error("Error loading Chart 1:", error);
    d3.select("#chart1")
        .append("div")
        .attr("class", "error-message")
        .text("Không thể tải dữ liệu biểu đồ");
});