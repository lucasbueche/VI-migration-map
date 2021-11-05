const width = 1920;
const height = 1080;

color = d3.scaleLinear()
        .domain([-1,0,1])
        .range(["red", "yellow","green"]);

var svg = d3.select("svg")

svg.append("rect").attr("x",12).attr("y",20).attr("width",300).attr("height",500)