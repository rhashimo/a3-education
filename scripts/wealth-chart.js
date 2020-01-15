// Set dataset
var wealth_status = 'data/wealth_status.csv'
var wealth_int_type = 'data/wealth_int-type.csv'

function update(input_data){

  d3.selectAll("svg > *").remove();

  var formatLabel = function(d) { return d3.format('.0f')(d * 100); };

  var margin = { top: 30, right: 10, bottom: 10, left: 65 },
      width = 1000 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  var graphic = d3.select('.graphic')
      .style('width', width + 'px');

  var svg = graphic.select('svg.chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
      .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var x = function(d) { return d.share; },
      xScale = d3.scaleLinear(),
      xValue = function(d) { return xScale(x(d)); };

  var y = function(d) { return d.social_network; },
      yScale = d3.scaleBand().range([height, 0]).padding(0.1),
      yValue = function(d) { return yScale(y(d)); },
      yAxis = d3.axisLeft(yScale);

  var column = function(d) { return d.usage; },
      columnScale = d3.scaleBand().range([0, width]).paddingInner(0.075),
      columnValue = function(d) { return columnScale(column(d)); };

  var color = column,
      colorScale = d3.scaleOrdinal(),
      colorValue = function(d) { return colorScale(color(d)); };

  function row(d) {
      return {
          usage: d.usage,
          social_network: d.social_network,
          share: +d.share
      };
  }

  d3.csv(input_data, row, function(error, dataFlat) {
      if (error) throw error;

      var data = d3.nest()
          .key(function(d) { return d.usage; })
          .entries(dataFlat)
          .map(function(d) { return { usage: d.key, values: d.values }; });
      
      yScale.domain(dataFlat.map(y).reverse());
      columnScale.domain(dataFlat.map(column));
      xScale.range([0, columnScale.bandwidth()]);

      // Excluding the light colors from the color scheme
      var colorRange = d3.schemeBuPu[columnScale.domain().length + 2].reverse();
      colorScale
          .domain(dataFlat.map(color))
          .range(colorRange);

      svg.append('g').attr('class', 'axis axis--y')
          .call(yAxis);

      var gColumn = svg.append('g').attr('class', 'columns')
              .selectAll('.column').data(data)
          .enter().append('g')
              .attr('class', 'column')
              .attr('transform', function(d) { return 'translate(' + columnValue(d) + ',0)'; });

      gColumn.append('text').attr('class', 'title')
          .attr('dy', '-0.34em')
          .text(column);
      
      var bars = gColumn.append('g').attr('class', 'bars');

      bars.selectAll('.bar--underlying').data(function(d) { return d.values; })
          .enter().append('rect')
              .attr('class', 'bar bar--underlying')
              .attr('x', 0)
              .attr('y', function(d) { return yScale(y(d)); })
              .attr('width', xScale.range()[1])
              .attr('height', yScale.bandwidth());

      bars.selectAll('.bar--overlying').data(function(d) { return d.values; })
          .enter().append('rect')
              .attr('class', 'bar bar--overlying')
              .attr('x', 0)
              .attr('y', function(d) { return yScale(y(d)); })
              .attr('width', function(d) { return xScale(x(d)); })
              .attr('height', yScale.bandwidth())
              .style('fill', colorValue);

      function positionLabel(d) {
          var xValue = xScale(x(d));
          var xMax = xScale.range()[1];
          if (xValue < (0.25 * xMax)) {
              d3.select(this)
                  .classed('label--white', false)
                  .attr('x', xValue)
                  .attr('dx', 2);
          } else {
              d3.select(this)
                  .classed('label--white', true)
                  .attr('x', 0)
                  .attr('dx', 4);
          }
          d3.select(this)
              .attr('y', yScale(y(d)) + (yScale.bandwidth() / 2))
              .attr('dy', '0.33em');
      }

      gColumn.append('g').attr('class', 'labels')
              .selectAll('.label').data(function(d) { return d.values; })
          .enter().append('text') 
              .attr('class', 'label')
              .text(function(d) { return formatLabel(x(d)); })
              .each(positionLabel);

  });

}

update(wealth_status)
