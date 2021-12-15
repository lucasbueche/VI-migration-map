function main_draw() {
    const red_to_green_degraded = ["#ff0000",
	"#fe4400",
	"#f86600",
	"#ee8200",
	"#df9b00",
	"#cdb200",
	"#b6c700",
	"#98db00",
	"#6fed00",
	"#00ff00"
	];

// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

svg.selectAll("g").remove();

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(120)
  .center([0,height/40])
  .translate([width/2, height/2]);

// Zooming
var svg = d3.select("#my_dataviz")
.call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
}))
.append("g");

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([-1000000, -10000, -100, 0, 100, 10000, 1000000])
  .range(red_to_green_degraded);

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/lucasbueche/VI-migration-map/main/data/map/custom.geo.json")
  .defer(d3.csv, "https://raw.githubusercontent.com/lucasbueche/VI-migration-map/main/data/CSV/migration_2015.csv", function(d) { data.set(d.code, +d.sold); })
  .await(ready);

// Define the div for the tooltip
var div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

function ready(error, topo) {
    let mouseOver = function(d) {
        d3.selectAll(".Country")
          .transition()
          .duration(2)
          .style("opacity", .5)
        d3.select(this)
          .transition()
          .duration(2)
          .style("opacity", 1)
          .style("stroke", "black")
        div.transition()
            .duration(2)
            .style("opacity", .5);
        div	.html("data.get(d.id)" + "<br/>"  + "data.get(d.id)")
            .style("left", (d3.mouse(this)[0]) + "px")
            .style("top", (d3.mouse(this)[1]) + "px");
      };
    let mouseLeave = function(d) {
        d3.selectAll(".Country")
            .transition()
            .duration(2)
            .style("opacity", .8)
        d3.select(this)
            .transition()
            .duration(2)
            .style("stroke", "transparent")
        div.transition()
            .duration(2)
            .style("opacity", 0);
    }

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        })
        .style("stroke", "black")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
    }
}
main_draw();