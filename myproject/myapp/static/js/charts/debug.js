// Utility functions
function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Đang tải dữ liệu</div>';
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Chart 1 Debug
function testChart1() {
    showLoading('chart1-debug');
    document.getElementById('chart1-data').textContent = 'Đang tải...';
    
    fetch('/api/chart1/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart1-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart1-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart1-data').textContent = 'Error: ' + error.message;
            showError('chart1-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart1Debug() {
    showLoading('chart1-debug');
    
    fetch('/api/chart1/')
        .then(response => response.json())
        .then(data => {
            const totalSales = data.total_sales;
            const width = 300;
            const height = 200;
            
            // Clear previous content
            const chartElement = document.getElementById('chart1-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart1-debug")
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
        })
        .catch(error => {
            showError('chart1-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 2 Debug
function testChart2() {
    showLoading('chart2-debug');
    document.getElementById('chart2-data').textContent = 'Đang tải...';
    
    fetch('/api/chart2/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart2-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart2-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart2-data').textContent = 'Error: ' + error.message;
            showError('chart2-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart2Debug() {
    showLoading('chart2-debug');
    
    fetch('/api/chart2/')
        .then(response => response.json())
        .then(data => {
            const avgSales = data.avg_sales;
            const width = 300;
            const height = 200;
            
            // Clear previous content
            const chartElement = document.getElementById('chart2-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart2-debug")
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
        })
        .catch(error => {
            showError('chart2-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 3 Debug
function testChart3() {
    showLoading('chart3-debug');
    document.getElementById('chart3-data').textContent = 'Đang tải...';
    
    fetch('/api/chart3/')
        .then(response => response.json())
        .then(data => {
            // Limit the data display to avoid overwhelming the UI
            const displayData = {...data};
            if (displayData.sales && displayData.sales.length > 20) {
                displayData.sales = displayData.sales.slice(0, 20);
                displayData.sales.push('... (truncated)');
            }
            document.getElementById('chart3-data').textContent = JSON.stringify(displayData, null, 2);
            document.getElementById('chart3-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart3-data').textContent = 'Error: ' + error.message;
            showError('chart3-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart3Debug() {
    showLoading('chart3-debug');
    
    fetch('/api/chart3/')
        .then(response => response.json())
        .then(data => {
            const sales = data.sales;
            
            const margin = {top: 20, right: 30, bottom: 30, left: 40};
            const width = 500 - margin.left - margin.right;
            const height = 250 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart3-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart3-debug")
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
                .thresholds(x.ticks(20));
            
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
                .call(d3.axisLeft(y))
                .attr("class", "axis");
            
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .attr("class", "axis");
        })
        .catch(error => {
            showError('chart3-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 4 Debug
function testChart4() {
    showLoading('chart4-debug');
    document.getElementById('chart4-data').textContent = 'Đang tải...';
    
    fetch('/api/chart4/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart4-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart4-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart4-data').textContent = 'Error: ' + error.message;
            showError('chart4-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart4Debug() {
    showLoading('chart4-debug');
    
    fetch('/api/chart4/')
        .then(response => response.json())
        .then(data => {
            const parseTime = d3.timeParse("%Y-%m");
            data.forEach(d => {
                d.month = parseTime(d.month);
                d.sales = +d.sales;
            });
            
            const margin = {top: 30, right: 20, bottom: 50, left: 60};
            const width = 500 - margin.left - margin.right;
            const height = 250 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart4-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart4-debug")
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
            
            // Add line
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#007acc")
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(d => x(d.month))
                    .y(d => y(d.sales)));
            
            // Add dots
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.month))
                .attr("cy", d => y(d.sales))
                .attr("r", 4)
                .attr("fill", "#007acc");
            
            // Add axes
            svg.append("g")
                .call(d3.axisLeft(y))
                .attr("class", "axis");
            
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .attr("class", "axis")
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)");
        })
        .catch(error => {
            showError('chart4-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 5 Debug
function testChart5() {
    showLoading('chart5-debug');
    document.getElementById('chart5-data').textContent = 'Đang tải...';
    
    fetch('/api/chart5/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart5-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart5-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart5-data').textContent = 'Error: ' + error.message;
            showError('chart5-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart5Debug() {
    showLoading('chart5-debug');
    
    fetch('/api/chart5/')
        .then(response => response.json())
        .then(data => {
            const margin = {top: 30, right: 20, bottom: 50, left: 60};
            const width = 500 - margin.left - margin.right;
            const height = 250 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart5-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart5-debug")
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
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(45)")
                .style("text-anchor", "start");
        })
        .catch(error => {
            showError('chart5-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 6 Debug
function testChart6() {
    showLoading('chart6-debug');
    document.getElementById('chart6-data').textContent = 'Đang tải...';
    
    fetch('/api/chart6/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart6-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart6-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart6-data').textContent = 'Error: ' + error.message;
            showError('chart6-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart6Debug() {
    showLoading('chart6-debug');
    
    fetch('/api/chart6/')
        .then(response => response.json())
        .then(data => {
            const margin = {top: 30, right: 20, bottom: 50, left: 60};
            const width = 400 - margin.left - margin.right;
            const height = 250 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart6-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart6-debug")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            const x = d3.scaleBand()
                .domain(data.map(d => d.year))
                .range([0, width])
                .padding(0.3);
            
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.sales)])
                .range([height, 0]);
            
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x(d.year))
                .attr("y", d => y(d.sales))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.sales))
                .attr("fill", "lightgreen");
            
            svg.append("g").call(d3.axisLeft(y));
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
        })
        .catch(error => {
            showError('chart6-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 7 Debug
function testChart7() {
    showLoading('chart7-debug');
    document.getElementById('chart7-data').textContent = 'Đang tải...';
    
    fetch('/api/chart7/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart7-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart7-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart7-data').textContent = 'Error: ' + error.message;
            showError('chart7-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart7Debug() {
    showLoading('chart7-debug');
    
    fetch('/api/chart7/')
        .then(response => response.json())
        .then(data => {
            const margin = {top: 30, right: 20, bottom: 50, left: 60};
            const width = 400 - margin.left - margin.right;
            const height = 250 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart7-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart7-debug")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            const x = d3.scaleBand()
                .domain(data.map(d => d.region))
                .range([0, width])
                .padding(0.3);
            
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.sales)])
                .range([height, 0]);
            
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x(d.region))
                .attr("y", d => y(d.sales))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.sales))
                .attr("fill", "coral");
            
            svg.append("g").call(d3.axisLeft(y));
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
        })
        .catch(error => {
            showError('chart7-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 8 Debug
function testChart8() {
    showLoading('chart8-debug');
    document.getElementById('chart8-data').textContent = 'Đang tải...';
    
    fetch('/api/chart8/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart8-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart8-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart8-data').textContent = 'Error: ' + error.message;
            showError('chart8-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart8Debug() {
    showLoading('chart8-debug');
    
    fetch('/api/chart8/')
        .then(response => response.json())
        .then(data => {
            const margin = {top: 20, right: 30, bottom: 30, left: 150};
            const width = 500 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart8-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart8-debug")
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
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
        })
        .catch(error => {
            showError('chart8-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 9 Debug
function testChart9() {
    showLoading('chart9-debug');
    document.getElementById('chart9-data').textContent = 'Đang tải...';
    
    fetch('/api/chart9/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart9-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart9-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart9-data').textContent = 'Error: ' + error.message;
            showError('chart9-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart9Debug() {
    showLoading('chart9-debug');
    
    fetch('/api/chart9/')
        .then(response => response.json())
        .then(data => {
            const margin = {top: 20, right: 30, bottom: 30, left: 150};
            const width = 500 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart9-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart9-debug")
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
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
        })
        .catch(error => {
            showError('chart9-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 10 Debug
function testChart10() {
    showLoading('chart10-debug');
    document.getElementById('chart10-data').textContent = 'Đang tải...';
    
    fetch('/api/chart10/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart10-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart10-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart10-data').textContent = 'Error: ' + error.message;
            showError('chart10-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart10Debug() {
    showLoading('chart10-debug');
    
    fetch('/api/chart10/')
        .then(response => response.json())
        .then(data => {
            const margin = {top: 30, right: 30, bottom: 40, left: 60};
            const width = 400 - margin.left - margin.right;
            const height = 250 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart10-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart10-debug")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            const x = d3.scaleBand()
                .domain(data.map(d => d.category))
                .range([0, width])
                .padding(0.3);
            
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.sales)])
                .range([height, 0]);
            
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x(d.category))
                .attr("y", d => y(d.sales))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.sales))
                .attr("fill", "orange");
            
            svg.append("g").call(d3.axisLeft(y));
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
        })
        .catch(error => {
            showError('chart10-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 11 Debug
function testChart11() {
    showLoading('chart11-debug');
    document.getElementById('chart11-data').textContent = 'Đang tải...';
    
    fetch('/api/chart11/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart11-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart11-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart11-data').textContent = 'Error: ' + error.message;
            showError('chart11-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart11Debug() {
    showLoading('chart11-debug');
    
    fetch('/api/chart11/')
        .then(response => response.json())
        .then(data => {
            const margin = {top: 20, right: 30, bottom: 30, left: 150};
            const width = 500 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart11-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart11-debug")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            const y = d3.scaleBand()
                .domain(data.map(d => d.sub_category))
                .range([0, height])
                .padding(0.2);
            
            const x = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.sales)])
                .range([0, width]);
            
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("y", d => y(d.sub_category))
                .attr("height", y.bandwidth())
                .attr("x", 0)
                .attr("width", d => x(d.sales))
                .attr("fill", "slateblue");
            
            svg.append("g").call(d3.axisLeft(y));
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
        })
        .catch(error => {
            showError('chart11-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 12 Debug
function testChart12() {
    showLoading('chart12-debug');
    document.getElementById('chart12-data').textContent = 'Đang tải...';
    
    fetch('/api/chart12/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart12-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart12-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart12-data').textContent = 'Error: ' + error.message;
            showError('chart12-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart12Debug() {
    showLoading('chart12-debug');
    
    fetch('/api/chart12/')
        .then(response => response.json())
        .then(data => {
            const margin = {top: 30, right: 30, bottom: 50, left: 60};
            const width = 400 - margin.left - margin.right;
            const height = 250 - margin.top - margin.bottom;
            
            // Clear previous content
            const chartElement = document.getElementById('chart12-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart12-debug")
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
        })
        .catch(error => {
            showError('chart12-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}

// Chart 13 Debug
function testChart13() {
    showLoading('chart13-debug');
    document.getElementById('chart13-data').textContent = 'Đang tải...';
    
    fetch('/api/chart13/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('chart13-data').textContent = JSON.stringify(data, null, 2);
            document.getElementById('chart13-debug').innerHTML = '<div style="padding: 20px; text-align: center;">API test thành công</div>';
        })
        .catch(error => {
            document.getElementById('chart13-data').textContent = 'Error: ' + error.message;
            showError('chart13-debug', 'Lỗi khi gọi API: ' + error.message);
        });
}

function renderChart13Debug() {
    showLoading('chart13-debug');
    
    fetch('/api/chart13/')
        .then(response => response.json())
        .then(data => {
            const width = 400;
            const height = 300;
            const radius = Math.min(width, height) / 2;
            
            // Clear previous content
            const chartElement = document.getElementById('chart13-debug');
            chartElement.innerHTML = '';
            
            const svg = d3.select("#chart13-debug")
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
        })
        .catch(error => {
            showError('chart13-debug', 'Lỗi khi render biểu đồ: ' + error.message);
        });
}