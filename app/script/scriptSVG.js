function main_draw(date = 2015) {
    const red_to_green_degraded = [
      "#ff0000",
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
  const colorblind_degraded = [
    "#900c00",
    "#c2270a",
    "#fe6e1a",
    "#feb927",
    "#c0ee3d",
    "#6afd6a",
    "#2ee5ae",
    "#2aabee",
    "#4860e6",
    "#23171b",
  ];

// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

svg.selectAll("g").remove();

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(170)
  .center([-50,50])
  .translate([width/3, height/3]);

// Zooming
var svg = d3.select("#my_dataviz")
.call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
}))
.append("g");


let color = red_to_green_degraded;
if(isColorBlindness){
  document.getElementById("my_scale").src="../../data/img/colorblind_scale.jpeg"
  color = colorblind_degraded;
} else {
  document.getElementById("my_scale").src="../../data/img/red_to_green_scale.jpeg"
  color = red_to_green_degraded;
}
// Data and color scale
var data = d3.map();
var emmigration = {};
var immigration = {};
var colorScale = d3.scaleThreshold()
  .domain([-10000, -1000, -100, -10, 0, 10, 100, 1000, 10000])
  .range(color);

let dataset = "https://raw.githubusercontent.com/lucasbueche/VI-migration-map/main/data/CSV/migration_" + date +".csv"
// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/lucasbueche/VI-migration-map/main/data/map/custom.geojson")
  .defer(d3.csv, dataset, function(d) { 
    data.set(d.code, +d.norm_sold); 
    emmigration[d.code] = new Array(d.country_emm, d.max_emm)
    immigration[d.code] = new Array(d.country_imm, d.max_imm)
  })
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
            .style("opacity", 1);
        div	.html((data.get(d.id) == undefined) ? d.properties.name + "<br/>"  + "No data" : d.properties.name + "<br/>"  + data.get(d.id) + " people" + "<br/>" +"per 100'000 inhab.")
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 30) + "px");
      };
    let mouseLeave = function(d) {
        d3.selectAll(".Country")
            .transition()
            .duration(2)
            .style("opacity", .8)
        d3.select(this)
            .transition()
            .duration(2)
            .style('opacity', .8)
            .style("stroke", "black")
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
            if(d.total == 0) return "grey"
            return colorScale(d.total);
        })
        .style("stroke", "black")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
        .on("click", function(d) {
          //console.log(emmigration[d.id])
          vm.model.$modal(d.properties.name, date, emmigration[d.id], immigration[d.id]) 
        })
    }
}
// Function and boolean for color blindness mode
var isColorBlindness = Boolean(false);
function toggle(button){
  if(document.getElementById("1").value=="OFF"){
    isColorBlindness = true;
    main_draw();
    document.getElementById("1").value="ON";}
  else if(document.getElementById("1").value=="ON"){
    isColorBlindness = false;
    main_draw();
    document.getElementById("1").value="OFF";}
}

// Function for determination the CSS property and size of the svg according to width of the screen
window.addEventListener("resize", function() {
  if (window.matchMedia("(min-width: 1000px)").matches) {
    document.getElementById("my_dataviz").style.height = "60%";
  } else {
    document.getElementById("my_dataviz").style.height = "90%";
  }
})
main_draw();