d3.json("/api/chart2/").then(function(data) {
    const avgSales = data.avg_sales;

    const width = 300;
    const height = 200;

    const svg = d3.select("#chart2")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "32px")
        .style("font-weight", "bold")
        .text(`$${d3.format(",.2f")(avgSales)}`);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Doanh số trung bình");
}).catch(error => {
    console.error("Error loading Chart 2:", error);
    d3.select("#chart2")
        .append("div")
        .attr("class", "error-message")
        .text("Không thể tải dữ liệu biểu đồ");
});