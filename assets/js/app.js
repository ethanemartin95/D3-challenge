// @TODO: YOUR CODE HERE!

// create big function to make the entire webpage responsive to change
function makeResponsive() {
    //Locate an existing SVG Canvas
    var svgArea = d3.select(".scatter").select("svg");

    //Remove it if it is there
    if (!svgArea.empty()) {
        svgArea.remove();
    };

    //determine the width of the canvas be looking at window size
    var svgWidth = window.innerWidth;
    //arbitrary hieght
    var svgHeight = 500;

    //give the chart in the svg some margin
    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };
    //Use algebra to determine the chart size within the SVG
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    //Add the svg to the html
    var svg = d3
        .select(".scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    //add the chart area to the SVG
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    //read in the data used for visualization
    d3.csv("/assets/data/data.csv").then(function(stateData) {

        //clean up the data used for analysis
        // Obesity vs Income
        stateData.forEach(function(data) {
            data.income = +data.income;
            data.obesity = +data.obesity;
        });

        //create x scaler
        var xLinearScale = d3.scaleLinear()
            .domain([0, d3.max(stateData, d => d.income)])
            .range([0, width]);
        //create y scaler
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(stateData, d => d.obesity)])
            .range([height, 0]);
        //construct axis based on the scaled values
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        //place the axis on the chart
        //note: push the x axis down the height of the chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

            chartGroup.append("g")
            .call(leftAxis);

        //create grid of data points with scaled data
        //add it to the chart group
        var circlesGroup = chartGroup.selectAll("circle")
            .data(stateData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.income))
            .attr("cy", d => yLinearScale(d.obesity))
            .attr("r", 10)
            .attr("fill", "red")
            .attr("opacity", ".5");

        //add a tool tip for each data point
        var toolTip = d3.tip()
            .attr("class", "tooltip d3-tip")
            .offset([80, -60])
            .html(function(d) {
              return (`<strong>${d.state}<strong><hr>${d.obesity}<hr>${d.income}`);
            });
        //add tool tip feature to chart
        chartGroup.call(toolTip);
        //add event functions to open and close tool tips
        circlesGroup
            .on("mouseover", function(d) {
                toolTip.show(d, this);
            })
            .on("mouseout", function(d) {
                toolTip.hide(d);
            })
    //catch the errors     
    }).catch(function(error) {
        console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
