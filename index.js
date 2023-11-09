
/**Fetch Bitcoin prices using an API*/
const api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2020-12-31&end=2021-04-01'

/**Loading Data from API once DOM Content has been loaded*/
document.addEventListener('DOMContentLoaded', function (event) {
    fetch(api) //•	The fetch function returns a promise, so the code uses the .then method to handle the response when it is received
    .then(function(response) { return response.json(); }) //a callback function to extract the JSON data from the response using response.json(). 
    .then(function(data) {
        var parsedData = parseData(data);
        drawChart(parsedData);
    })
    .catch(function(err) { console.log(err); });
});


/** Parse it into key-value pairs*/
function parseData(data) {
    var arr = [];
    for ( var i in data.bpi) {
        arr.push({
            date: new Date(i), //date
            value: +data.bpi[i] //convert string to number
        });
    }
    return arr;
}

/**Draw Line Chart*/
function drawChart(data) {
    var svgWidth = 600, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 50};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //create space for x and y axis

/**Specifically, for the time scale (x):

The rounding is applied to horizontal positions (dates on the x-axis) to ensure 
they are whole numbers and precise coordinates on the screen.
And for the linear scale (y):

The rounding is applied to vertical positions (numeric data values on the y-axis) to ensure they are
whole numbers and precise coordinates on the screen. */

    var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date}))
            .rangeRound([0, width]);

    var y = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return d.value}))
            .rangeRound([height, 0]);   

    var line = d3.line() //line generator
                .x(function(d) { return x(d.date)})
                .y(function(d) { return y(d.value)})

// Append the x-axis to the chart
    g.append("g")
    .attr("transform", "translate(0," + height + ")") // Position it at the bottom
    .call(d3.axisBottom(x));

    g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy","0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");

    g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width",1.5)
    .attr("d", line);
}