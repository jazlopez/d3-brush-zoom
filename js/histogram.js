var seed = 8;

var series = function(max){

    data = [];

    if(!max) {

        max = 90;
    }

    var startAt = new Date('2015-12-01');

    for(var i = 0 ; i < max; i++) {

        data.push(Object.create({

            x: startAt.setDate(startAt.getDate() + 1),

            y: rand(seed),

            dot: 'dot '
        }));
    }

    return data;

};

var data = series();

var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var plot = function(container, data, prefix) {

    if(!prefix){

        prefix  = 'svg';
    }

    var x = d3.scaleTime().domain(d3.extent(data, function (d) {

        return d.x;

    })).range([0, width]);

    var y = d3.scaleLinear().domain([0, d3.max(data, function (d) {
        return d.y;
    }) + seed]).range([height, 0]);




    // add the tooltip area to the webpage
    var tooltip = d3.select(container).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    function avg() {

        svg.selectAll('line.visible').remove();
    }




    var svg = d3.select(container).append("svg")
        .datum(data)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", prefix + '_' + container.replace('#', ''))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /**
     * plot lines
     * a) dot union
     * b) horizontal minimum value
     * c) horizontal minimum value
     */

    /**
     * a) dot union
     */

    var line = d3.line()
        .x(function (d) {
            return x(d.x);
        })
        .y(function (d) {
            return y(d.y);
        });

    svg.append("path")
        .attr("class", "line")
        .attr("d", line);

    /**
     * b) horizontal minimum value
     */

    var minY = d3.line()
        .x(function (d) {
            return x(d.x);
        })
        .y(function (d) {
            return y(d.min);
        });

    svg.append("path")
        .attr("class", "line orange-dotted")
        .attr("d", minY);

    /**
     * c) horizontal minimum value
     */

    var maxY = d3.line()
        .x(function (d) {
            return x(d.x);
        })
        .y(function (d) {
            return y(d.max);
        });

    svg.append("path")
        .attr("class", "line orange-dotted")
        .attr("d", maxY);

    /**
     * axis section
     * a) plot x-axis
     * b) plot y-axis
     */

    /**
     * a) plot x-axis
     */
    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).
        tickPadding(10).
        tickSizeOuter(0).tickFormat(d3.timeFormat('%d/%b')));

    /**
     * b) plot y-axis
     */
    var yAxis = d3.axisRight(y)
        .ticks(5)
        .tickSize(width);

    var customYAxis = function(g){
        g.call(yAxis);
        g.select('.domain').remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "0");
        g.selectAll(".tick text").attr("x", -25).attr("dy", 0);
    };

    svg.append("g").call(customYAxis).attr("class", "axis axis--y");


    for (var j = 0, yy = 1; j <= 500; j += 95, yy++) {

        //Draw the Rectangle
        svg.append("rect")
            .attr("x", j + ( 85 * yy))
            .attr("y", 20)
            .attr("width", 90)
            .attr("height", height - 20)
            .attr('fill', 'lightgray')
            .attr('class', 'opaque');
    }

    svg.selectAll(".dot")
        .data(data.filter(function (d) {
            return d
        }))
        .enter().append("circle")
        .attr("class", function (d) {
            return d.dot
        })
        .attr("cx", line.x())
        .attr("cy", line.y())
        .attr("r", 5)
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("You are at: <br/>(" + d.x + "," + d.y + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    var key = svg.append("g")
        .attr("class", "plot-legend bold")
        .attr("transform","translate(" + 700 + ","+70+")");
    key.append("text").text("FSC");

    var column = svg.append("g")
        .attr("class", "plot-legend")
        .attr("transform","translate(" + 735 + ","+70+")");

    column.append("text").text("Delta PMTV");

    return svg;
};

/**
 *
 */
var usort = function(left, right){

    if(left.y === right.y) {
        return 0;
    }

    return left.y > right.y ? 1 : -1;
};


for(var j = 1; j < 3; j++){

    var dataset = series();
    var cloned  = dataset.slice();

    cloned.sort(usort);

    var min = cloned[0].y;
    var max = cloned[cloned.length - 1 ].y;

    var plotstdev = 2.50;

    // document.write('<pre>');

    dataset.forEach(function(item){

        var minline = cloned[0].y + plotstdev;
        var maxline = cloned[cloned.length - 1 ].y  - plotstdev;

        item['min'] = minline;
        item['max'] = maxline;
        // item['x'] = item.x;
        item['y'] = item.y;
        item['dot'] += item.y < minline || item.y > maxline ?

            'red' : 'green';


    });

    var svg = plot('#container' + j.toString(), dataset);
}