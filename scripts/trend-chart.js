// Set dataset
var trend_enrollment = 'data/trend_enrollment.csv'
var trend_reading = 'data/trend_reading.csv'
var trend_arith = 'data/trend_arith.csv'
var trend_eng = 'data/trend_eng.csv'

// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 30, left: 150},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var graphic = d3.select('.graphic')
    .style('width', '900px');

var xmin = {enrollment: 70, others: 1}
    xmax = {enrollment: 100, others: 5}

function update(input_data){

  d3.select("#my_dataviz > *").remove();

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  // Parse the Data
  d3.csv(input_data, function(data) {

    // Add X axis
    if(input_data == 'data/trend_enrollment.csv'){
      [xmin, xmax] = [70, 100]
    }else if(input_data == 'data/trend_arith.csv'){
      [xmin, xmax] = [1, 6]
    }else{
      [xmin, xmax] = [1, 5]
    }

    var x = d3.scaleLinear()
      .domain([xmin, xmax])
      .range([ 0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .attr("font-size", "13px");

    // Y axis
    var y = d3.scaleBand()
      .range([ 0, height ])
      .domain(data.map(function(d) { return d.rname; }))
      .padding(1);
    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("font-size", "13px");

    // Lines
    svg.selectAll("myline")
      .data(data)
      .enter()
      .append("line")
        .attr("x1", function(d) { return x(d.year1); })
        .attr("x2", function(d) { return x(d.year2); })
        .attr("y1", function(d) { return y(d.rname); })
        .attr("y2", function(d) { return y(d.rname); })
        .attr("stroke-width", "1.5px")
        .style("stroke", function(d){
          if(d.diff >= 0){
            return "deepskyblue";
          } else {return "brown";}
        });

    // Circles of variable 1
    svg.selectAll("mycircle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.year1); })
        .attr("cy", function(d) { return y(d.rname); })
        .attr("r", "6")
        .style("Fill", "#69b3a2")

    // Circles of variable 2
    svg.selectAll("mycircle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.year2); })
        .attr("cy", function(d) { return y(d.rname); })
        .attr("r", "6")
        .style("fill", "#4C4082")

    // Labels
    if(input_data == 'data/trend_enrollment.csv'){
      suffix = "%"}else{suffix = "P"}
    svg.selectAll("mytext")
      .data(data)
      .enter()
      .append("text")
        .attr("x", function(d) { if(d.diff >= 0){
          return x(d.year2) + 10; }else{ return x(d.year2) - 45;}})
        .attr("y", function(d) { return y(d.rname) + 5; })
        .text( function (d) { return d3.format(".1f")(d.diff) + suffix; })
        .style("font-size", "12px")
        .style("Fill", function(d){
          if(d.diff >= 0){
            return "midnightblue";
          }else{return "brown";}
        });

    // Add X axis unit:
    if(input_data == 'data/trend_enrollment.csv'){
      xlabel = "(%)"}else{xlabel = "(Point)"}
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 20)
      .text(xlabel)
      .attr("font-size", "13px");

    // Add Y axis unit:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", -10)
      .attr("y", 5)
      .text("(Province)")
      .attr("font-size", "13px");

    // Handmade legend
    svg.append("circle")
      .attr("cx",100)
      .attr("cy",40)
      .attr("r", 5)
      .style("fill", "#69b3a2")
    
    svg.append("circle")
      .attr("cx",100)
      .attr("cy",60)
      .attr("r", 5)
      .style("fill", "#4C4082")

    svg.append("text")
      .attr("x", 110)
      .attr("y", 44)
      .text("2016")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

    svg.append("text")
      .attr("x", 110)
      .attr("y", 64)
      .text("2018")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

  })


  //key takeaways from each graph 
  if(input_data == 'data/trend_enrollment.csv'){
    takeaways = "Balochistan had significantly improved its enrollment ratio, but still room for improvement."
  }else if (input_data == 'data/trend_reading.csv'){
    takeaways = "Reading level in local/national language had stayed at almost the same level."
  }else if (input_data == 'data/trend_arith.csv'){
    takeaways = "All provinces had achieved remarkable improvement on Arithmatic level."
  }else{
    takeaways = "English level also stucks; rather, top two provinces observed relatively large decline."
  }
  document.getElementById("dek-takeaway").innerHTML = takeaways;

}



update(trend_enrollment)
