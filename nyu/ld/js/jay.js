let data;

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
var svg = d3.select("#dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
  var x = d3.scaleLinear()
  .domain([0, 25])
  .range([ 0, width ]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 5])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

d3.json("data.json")
.then(function(allData){
    data = allData.lowResData;
    console.log(data);

    svg.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.words); } )
        .attr("cy", function (d) { return y(d.articles); } )
        .attr("r", 5)
        .style("fill", "#69b3a2")

});


var pieData = [2,3,1,8,2,1,1,3,1,1,1,1];
var pieColors = [
    "white",
    "blue",
    "gold",
    "black",
    "orange",
    "brown",
    "yellow",
    "gray",
    "salmon",
    "darkblue",
    "purple",
    "beige",
]

// Selecting SVG using d3.select() 
var svgPie = d3.select("#pieviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom); 
  
let g = svgPie.append("g") 
       .attr("transform", "translate(150,120)"); 
  
// Creating Pie generator 
var pie = d3.pie(); 

// Creating arc 
var arc = d3.arc() 
            .innerRadius(0) 
            .outerRadius(100); 

// Grouping different arcs 
var arcs = g.selectAll("arc") 
            .data(pie(pieData)) 
            .enter() 
            .append("g"); 

// Appending path  
arcs.append("path") 
    .attr("fill", (data, i)=>{ 
        let value=data.data; 
        return pieColors[i]; 
    }) 
    .attr("d", arc); 