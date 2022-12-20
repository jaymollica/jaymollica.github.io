function stackedHorizontalBarChart(pieData, divName, title) {

    // Draw for the first time to initialize.
    resized();

    window.addEventListener("resize", resized);

    function resized() {
        //remove previously rendered svg
        d3.select(divName + " svg").remove();

        chartData = calculateChartData(pieData, divName);

        var widths = chartData.widths;
        var keys = chartData.keys;
        var lineLabels = chartData.labels;
        var p = 0;

        var colors = ["#1DACE8", "#1C366B", "#F24D29", "#E5C4A1", "#C4CFD0", "#d0743c", "#ff8c00"];

        var svg = d3.select(divName)
        .append('svg')
        .attr('width', $(divName).width())
        .attr('height', 300);

        var g = svg.append("g")
                .attr("transform", "translate(" + 0 + "," + -16 + ")")
                .attr("class", "labels");

        svg.append("text")
            .attr("x", $(divName).width() - 180 )
            .attr("y", 170)
            .style("text-anchor", "start")
            .text(title)
            .attr("class", "horizontal-chart-title");

        svg.append("g")
            .attr("class", "lines");


        svg.selectAll('rect')
            .data(widths)
            .enter()
            .append('rect')
            .attr('width', function(d){return d;})
            .attr('x',function(d, i){return sum(widths, 0, i); })
            .attr('fill', function(d, i){ return colors[i]; })
            .attr('y',120)
            .attr('height', 100);

        var labels = g.selectAll(".labels")
            .data(chartData.keys)
            .enter();

        labels.append("text")
            .attr("text-anchor",function(index,value) {return "start";})
            .text( function(d, i) { return lineLabels[i]; })
            .attr("class", function(d,i) {
                className = d.toLowerCase();
                className =className.split(' ').join('-');
                return "text-"+className+"-label";
            })
            .attr("transform", function(d, i) {
                coefficient = 0;
                h = 120;
                allWidth = 0
                if (i > 0) {
                    $.each(widths, function(index, value) {
                        allWidth += value;
                        if(i>index) {
                            coefficient += value / 1;
                        }

                    });
                }

                totalWidth = coefficient + this.getBBox().width;
                elWidth = $(divName).width() - 200;

                if (totalWidth > elWidth) {
                    // diff = totalWidth - elWidth;
                    // coefficient = allWidth - (this.getBBox().width + widths[i]/2);
                    // p = p + 1;
                    h = h - (12 * p);
                    p = p - 1;
                }
                return "translate("+ coefficient + "," + h + ")";
            });

        labels.append("line")
            .attr("x1", function(d, i){ return sum(chartData.widths, 0, i) })
            .attr("x2", function(d, i){ return sum(chartData.widths, 0, i) })
            .attr("y1", function(d, i){
                return 125;
            })
            .attr("y2", 180)
            .attr("stroke-width", 1)
            .attr("stroke", "gray")
            .attr("stroke-dasharray", "1,1");

    }

}

function calculateChartData(data, divName) {

    var elWidth = $(divName).width() - 200;
    var keys = new Array();
    var values = new Array();
    var widths = new Array();
    var labels = new Array();
    var totalValues = 0;
    $.each( data.items, function( key, value ) {
        keys.push(value.description);
        values.push(value.count);
        totalValues += value.count;
    });

    var percent = 0;
    $.each(values, function(index, value) {
        percent = (value / totalValues);
        labels.push(keys[index] + ' ' + Math.round(percent * 100)+"%");
        width = percent * elWidth;
        width = Math.round(width);
        widths.push(width);
    });

    var chartData = {'widths': widths, 'keys': keys, 'values': values, 'labels': labels}
    return chartData;
}

function sum(array, start, end) {
    var total = 0;
    for(var i=start; i<end; i++) total += array[i];
  return total;
}

function stackedBarChart(data, divName) {
    //Draw Stack Chart
    var marginStackChart = { top: 20, right: 20, bottom: 50, left: 40 },
            widthStackChart = $(divName).width() - marginStackChart.left - marginStackChart.right,
            heightStackChart = 200 - marginStackChart.top - marginStackChart.bottom;

    var xStackChart = d3.scaleBand()
            .range([0, widthStackChart - 170])
            .padding(0.1);
    var yStackChart = d3.scaleLinear()
            .range([heightStackChart, 0]);


    var colorStackChart = d3.scaleOrdinal(["#C7CEF6", "#E6A2C5"]);


    var canvasStackChart = d3.select(divName).append("svg")
        .attr("width", widthStackChart + marginStackChart.left + marginStackChart.right)
        .attr("height", heightStackChart + marginStackChart.top + marginStackChart.bottom)
        .append("g")
        .attr("transform", "translate(" + marginStackChart.left + "," + marginStackChart.top + ")");


    var stackData = prepareStackData(data);

    colorStackChart.domain(d3.keys(stackData[0]).filter(function (key) { return key !== "Year"; }));

    stackData.forEach(function (d) {
        var y0 = 0;
        d.ages = colorStackChart.domain().map(function (name) { return { name: name, y0: y0, y1: y0 += +d[name] }; });
        d.total = d.ages[d.ages.length - 1].y1;
    });

    xStackChart.domain(stackData.map(function (d) { return d.Year; }));
    yStackChart.domain([0, d3.max(stackData, function (d) { return d.total; })]);

    canvasStackChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightStackChart + ")")
        .call(d3.axisBottom(xStackChart))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    canvasStackChart.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yStackChart))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    var state = canvasStackChart.selectAll(".Year")
        .data(stackData)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function (d) { return "translate(" + xStackChart(d.Year) + ",0)"; });

    state.selectAll("rect")
        .data(function (d) { return d.ages; })
        .enter().append("rect")
        .attr("width", xStackChart.bandwidth())
        .attr("y", function (d) { return yStackChart(d.y1); })
        .attr("height", function (d) { return yStackChart(d.y0) - yStackChart(d.y1); })
        .style("fill", function (d) { return colorStackChart(d.name); });

    var legend = canvasStackChart.selectAll(".legend")
        .data(colorStackChart.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 30 + ")"; });

    legend.append("rect")
        .attr("x", widthStackChart - 148)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorStackChart);

    legend.append("text")
        .attr("x", widthStackChart - 124)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) { return d; });

}

function prepareStackData(data) {

    var stackData = [];

    $.each( data.items, function( key, value ) {

        date = value.date
        gifts = value.values.Gifts;
        purchases = value.values.Purchases;

        total = gifts + purchases;

        giftsPercent = Math.round( (gifts / total) * 100);
        purchasesPercent = Math.round( (purchases / total) * 100);

        stackDataItem = {
                        "Year": date,
                        "Gifts": giftsPercent,
                        "Purchases": purchasesPercent
                        };

        stackData.push(stackDataItem);

    });

    return stackData;
}

function multiLinesChart(data, divName) {
    var margin = {top: 20, right: 31, bottom: 30, left: 31};
    var data = data.items;
    var height = 400;
    var width = $(divName).width();
    var outerWidth = 100;
    // parse the date / time to year
    var parseTime = d3.timeParse("%Y");
    var maxValue = getMaxHeight(data);

    // set the ranges
    var x = d3.scaleTime().range([0, (width - 200) - 2*margin.left]);
    var y = d3.scaleLinear().range([height - 100, 0]);

    var adCollections = $.map(data[0].values, function(element,index) {return index})
    var graphLines = {};
    $.each(adCollections, function(index, collection) {
        graphLines[collection] = d3.line()
            .x(function(data, index) { return x(data.date); })
            .y(function(data) {
                return y(data.values[collection]);
            });
    });

    var svg = d3.select(divName)
        .append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom + outerWidth)
        .attr("style", "padding-left: 30px; padding-right: 30px; padding-top: 15px;");

    var colorPalette = ["#E6A2C5", "#C7CEF6", "#D8A49B", "#7496D2", "#B62A3D" , "#EDCB64", "#76A08A"];

    // COLORS: map keys to colors for legends (and lines)
    var color = d3.scaleOrdinal()
        .domain(d3.keys(data[0].values).filter(function(key) { return key; }))
        .range(colorPalette);


    // formatting data
    var categories = color.domain().map(function(type) {
        return {
            type: type,
            values: data.map(function(d) {
                return {
                    date: d.date,
                    count: d.values[type]
                };
            })
        };
    });

    // LEGENDS
    var legend = svg.selectAll('g')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'legend');

    legend.append('rect')
        .attr('x', 700)
        .attr('y', function(d, i) {
            return (height - 400) + 40 + i * 30;
        })
        .attr('width', 20)
        .attr('height', 20)
        .attr('rx', 0) //svg's rounded corner. Complete circle if rx = ry = width = height
        .attr('ry', 0)
        .style('fill', function(d) {
            return color(d.type);
        });

    legend.append('text')
        .attr('x', 725)
        .attr('y', function(d, i) {
            return (height - 400) + 40 + (i * 30) + 15;
        })
        .text(function(d) {
            return (d.type);
        });

    // format the data
    data.forEach(function(data) {
      data.date = parseTime(data.date);
    });

    // sort years ascending
    data.sort(function(a, b){
        return a["date"]-b["date"];
    });

    // Scale the domain of the data
    x.domain(d3.extent(data, function(data) {
        return data.date; }));
    y.domain([0, d3.max(data, function(data) {
      return Math.max(0, maxValue); })]);

    $.each(graphLines, function(index, line) {
        className = index.toLowerCase();
        className =className.split(' ').join('-')
        svg.append("path")
        .data([data])
        .attr("class", "line collection-"+className+"-line")
        .attr("d", graphLines[index])
        .attr("stroke", function(d) {
            return color(index);
        });
    });

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + (height - 100) + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

}

function getMaxHeight(data) {
    var maxHeight = 0;
    $.each(data, function(index, value) {
        $.each(value.values, function(i, v) {
            if(v > maxHeight) {
                maxHeight = v;
            }
        });
    });
    return maxHeight;
}

function sunburstChart(dataCsv, divName) {

    // Dimensions of sunburst.
    var width = $(divName).width();
    var height = 600;
    var radius = Math.min(width, height) / 2;

    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    var b = {
      w: 75, h: 30, s: 3, t: 10
    };

    // Mapping of step names to colors.
    var colors = new Array();

    // Total size of all segments; we set this later, after loading the data.
    var totalSize = 0;

    var vis = d3.select(divName).append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.partition()
        .size([2 * Math.PI, radius * radius]);

    var arc = d3.arc()
        .startAngle(function(d) { return d.x0; })
        .endAngle(function(d) { return d.x1; })
        .innerRadius(function(d) { return Math.sqrt(d.y0); })
        .outerRadius(function(d) { return Math.sqrt(d.y1); });

    // Use d3.text and d3.csvParseRows so that we do not need to have a header
    // row, and can receive the csv as an array of arrays.
    d3.text(dataCsv, function(text) {
      var csv = d3.csvParseRows(text);
      var uniqueTerms = new Array();
      $.each(csv, function(index, value){
        var cat = value[0];
        var parts = cat.split("-");
        $.each(parts, function(i,d) {
            if($.inArray(d, uniqueTerms) == -1) {
                uniqueTerms.push(d);
            }
        });
      });


      $.each(uniqueTerms, function(i, term) {
        hex = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        colors[term] = hex;
      });
      console.log(colors);

      var json = buildHierarchy(csv);
      createVisualization(json);

    });

    // Main function to draw and set up the visualization, once we have the data.
    function createVisualization(json) {

      // Basic setup of page elements.
      initializeBreadcrumbTrail();
      drawLegend();
      d3.select("#togglelegend").on("click", toggleLegend);

      // Bounding circle underneath the sunburst, to make it easier to detect
      // when the mouse leaves the parent g.
      vis.append("svg:circle")
          .attr("r", radius)
          .style("opacity", 0);

      // Turn the data into a d3 hierarchy and calculate the sums.
      var root = d3.hierarchy(json)
          .sum(function(d) { return d.size; })
          .sort(function(a, b) { return b.value - a.value; });

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = partition(root).descendants()
          .filter(function(d) {
              return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
          });

      var path = vis.data([json]).selectAll("path")
          .data(nodes)
          .enter().append("svg:path")
          .attr("display", function(d) { return d.depth ? null : "none"; })
          .attr("d", arc)
          .attr("fill-rule", "evenodd")
          .style("fill", function(d) { return colors[d.data.name]; })
          .style("stroke", "white")
          .style("opacity", 1)
          .on("mouseover", mouseover);

      // Add the mouseleave handler to the bounding circle.
      d3.select("#container").on("mouseleave", mouseleave);

      // Get total size of the tree = value of root node from partition.
      totalSize = path.datum().value;
     };

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {

      var percentage = (100 * d.value / totalSize).toPrecision(3);
      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }

      d3.select("#percentage")
          .text(percentageString);

      d3.select("#explanation")
          .style("visibility", "");

      var sequenceArray = d.ancestors().reverse();
      sequenceArray.shift(); // remove root node from the array
      updateBreadcrumbs(sequenceArray, percentageString);

      // Fade all the segments.
      d3.selectAll("path")
          .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment.
      vis.selectAll("path")
          .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                  })
          .style("opacity", 1);
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d) {

      // Hide the breadcrumb trail
      d3.select("#trail")
          .style("visibility", "hidden");

      // Deactivate all segments during transition.
      d3.selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      d3.selectAll("path")
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .on("end", function() {
                  d3.select(this).on("mouseover", mouseover);
                });

      d3.select("#explanation")
          .style("visibility", "hidden");
    }

    function initializeBreadcrumbTrail() {
      // Add the svg area.
      var trail = d3.select("#sequence").append("svg:svg")
          .attr("width", width)
          .attr("height", 50)
          .attr("id", "trail");
      // Add the label at the end, for the percentage.
      trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d, i) {
      var points = [];
      points.push("0,0");
      points.push(b.w + ",0");
      points.push(b.w + b.t + "," + (b.h / 2));
      points.push(b.w + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
      }
      return points.join(" ");
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray, percentageString) {

      // Data join; key function combines name and depth (= position in sequence).
      var trail = d3.select("#trail")
          .selectAll("g")
          .data(nodeArray, function(d) { return d.data.name + d.depth; });

      // Remove exiting nodes.
      trail.exit().remove();

      // Add breadcrumb and label for entering nodes.
      var entering = trail.enter().append("svg:g");

      entering.append("svg:polygon")
          .attr("points", breadcrumbPoints)
          .style("fill", function(d) { return colors[d.data.name]; });

      entering.append("svg:text")
          .attr("x", (b.w + b.t) / 2)
          .attr("y", b.h + 12)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.data.name; });

      // Merge enter and update selections; set position for all nodes.
      entering.merge(trail).attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
      });

      // Now move and update the percentage at the end.
      d3.select("#trail").select("#endlabel")
          .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail")
          .style("visibility", "");

    }

    function drawLegend() {

      // Dimensions of legend item: width, height, spacing, radius of rounded rect.
      var li = {
        w: 75, h: 30, s: 3, r: 3
      };

      var legend = d3.select("#legend").append("svg:svg")
          .attr("width", li.w)
          .attr("height", d3.keys(colors).length * (li.h + li.s));

      var g = legend.selectAll("g")
          .data(d3.entries(colors))
          .enter().append("svg:g")
          .attr("transform", function(d, i) {
                  return "translate(0," + i * (li.h + li.s) + ")";
               });

      g.append("svg:rect")
          .attr("rx", li.r)
          .attr("ry", li.r)
          .attr("width", li.w)
          .attr("height", li.h)
          .style("fill", function(d) { return d.value; });

      g.append("svg:text")
          .attr("x", li.w / 2)
          .attr("y", li.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.key; });
    }

    function toggleLegend() {
      var legend = d3.select("#legend");
      if (legend.style("visibility") == "hidden") {
        legend.style("visibility", "");
      } else {
        legend.style("visibility", "hidden");
      }
    }

    // Take a 2-column CSV and transform it into a hierarchical structure suitable
    // for a partition layout. The first column is a sequence of step names, from
    // root to leaf, separated by hyphens. The second column is a count of how
    // often that sequence occurred.
    function buildHierarchy(csv) {
      var root = {"name": "root", "children": []};
      for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];
        if (isNaN(size)) { // e.g. if this is a header row
          continue;
        }
        var parts = sequence.split("-");
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
          var children = currentNode["children"];
          var nodeName = parts[j];
          var childNode;
          if (j + 1 < parts.length) {
           // Not yet at the end of the sequence; move down the tree.
            var foundChild = false;
            for (var k = 0; k < children.length; k++) {
              if (children[k]["name"] == nodeName) {
                childNode = children[k];
                foundChild = true;
                break;
              }
            }
          // If we don't already have a child node for this branch, create it.
            if (!foundChild) {
              childNode = {"name": nodeName, "children": []};
              children.push(childNode);
            }
            currentNode = childNode;
          } else {
            // Reached the end of the sequence; create a leaf node.
            childNode = {"name": nodeName, "size": size};
            children.push(childNode);
          }
        }
      }
      return root;
    };
}

