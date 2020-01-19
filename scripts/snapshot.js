var margin = {top: 20, right: 20, bottom: 140, left: 70},
	width = 800 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var xscale = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);
	
var yscale = d3.scale.linear()
	.rangeRound([height, 0]);

var colors = d3.scale.ordinal()
	.range(["#284067", "#2469AB", "#509FD7", "#7CB7D7", "#BFD8EC"]);
	
var xaxis = d3.svg.axis()
	.scale(xscale)
	.orient("bottom");
	
var yaxis = d3.svg.axis()
	.scale(yscale)
	.orient("left")
	.tickFormat(d3.format(".0%")); // **

var graphic = d3.select('.graphic')
  .style('width', '900px');
	
var svg = graphic.select("svg.chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load and handle the data
d3.tsv("data/snapshot.tsv", function(error, data) {
	
	// rotate the data
	var categories = d3.keys(data[0]).filter(function(key) { return key !== "Absolutes"; });
	var parsedata = categories.map(function(name) { return { "Absolutes": name }; });
	data.forEach(function(d) {
		parsedata.forEach(function(pd) {
			pd[d["Absolutes"]] = d[pd["Absolutes"]];
		});
	});
	
	// map column headers to colors (except for 'Absolutes' and 'Base: All Respondents')
	colors.domain(d3.keys(parsedata[0]).filter(function(key) { return key !== "Absolutes" && key !== "Base: All Respondents"; }));
	
	// add a 'responses' parameter to each row that has the height percentage values for each rect
	parsedata.forEach(function(pd) {
		var y0 = 0;
		// colors.domain() is an array of the column headers (text)
		// pd.responses will be an array of objects with the column header
		// and the range of values it represents
		pd.responses = colors.domain().map(function(response) {
			var responseobj = {response: response, y0: y0, yp0: y0};
			y0 += +pd[response];
			responseobj.y1 = y0;
			responseobj.yp1 = y0;
			return responseobj;
		});
		// y0 is now the sum of all the values in the row for this category
		// convert the range values to percentages
		pd.responses.forEach(function(d) { d.yp0 /= y0; d.yp1 /= y0; });
		// save the total
		pd.totalresponses = pd.responses[pd.responses.length - 1].y1;
	});
	
	// sort by the value in 'Right Direction'
	// parsedata.sort(function(a, b) { return b.responses[0].yp1 - a.responses[0].yp1; });
	
	// ordinal-ly map categories to x positions
	xscale.domain(parsedata.map(function(d) { return d.Absolutes; }));
	
	// add the x axis and rotate its labels
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xaxis)
		.selectAll("text")
		.attr("y", 5)
		.attr("x", 7)
		.attr("dy", ".35em")
		.attr("transform", "rotate(65)")
		.style("text-anchor", "start");

	// add the y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yaxis);
	
	// create svg groups ("g") and place them
	var category = svg.selectAll(".category")
		.data(parsedata)
		.enter().append("g")
		.attr("class", "category")
		.attr("transform", function(d) { return "translate(" + xscale(d.Absolutes) + ",0)"; });
	
	// draw the rects within the groups
	category.selectAll("rect")
		.data(function(d) { return d.responses; })
		.enter().append("rect")
		.attr("width", xscale.rangeBand())
		.attr("y", function(d) { return yscale(d.yp1); })
		.attr("height", function(d) { return yscale(d.yp0) - yscale(d.yp1); })
		.style("fill", function(d) { return colors(d.response); });
	
	// position the legend elements
	var legendVals = ["Beginner", "Reads letters", "Reads words", "Reads sentences","Reads stories"] ;
	var color = d3.scale.ordinal()
	.range(["#284067", "#2469AB", "#509FD7", "#7CB7D7", "#BFD8EC"]);

	var legend = graphic.select("svg.legend-div")
	  .attr("width", 800)
	  .attr("height", 30)
	  .selectAll('g')
		.data(legendVals)
		.enter()
	  .append('g')
		.attr("class", "legends")
		;

	legend.append('rect') 
		.attr("x", 0)
		.attr("y", 10)
		.attr("width", 10)
		.attr("height", 10)
		.style("fill", function (d, i) { return color(i); })

	legend.append('text')
		.attr("x", 20)
		.attr("y", 20)
		.text(function (d, i) {	return d ; })
		.attr("class", "textselected")
		.style("text-anchor", "start")
		.style("font-size", 15)
	  ;
	  
	var padding = 20 ;  
	legend.attr("transform", function (d, i) {
	          {
	            return "translate("+(d3.sum(legendVals, function(e,j) {
	    					if (j < i) { 
	              	return legend[0][j].getBBox().width;
	              } else {
	              	return 0; 
	                } 
	              }) + padding * i) + ",0)";
	          }
		});  
		
	});

d3.select(self.frameElement).style("height", (height + margin.top + margin.bottom) + "px");