/* MIGRATION 2015 */
/* eslint-disable no-undef */

// Adding basic elements
const body = d3.select('body');

// Buttons
const buttons = d3.select('#buttons')

// Adding svg
const zoom = d3.zoom().scaleExtent([1, 40]).on('zoom', zoomed);
const height = 650;
const svg = d3
  .select('#map')
  .append('svg')
  .attr('width', '100%')
  .attr('height', height)
  .call(zoom);


// moveToBack function: move an element from the front to the back
d3.selection.prototype.moveToBack = function () {
  return this.each(function () {
    let firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
};

d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

// Main const for world map creation
const projection = d3
  .geoNaturalEarth1()
  .scale(250)
  .translate([0.5 * window.innerWidth, 375]);
const pathGenerator = d3.geoPath().projection(projection);

const worldMapDiasplay = svg.append('g');
const map = worldMapDiasplay.append('g').attr('id', 'map');



// Creation of the world map
d3.json('../../data/map/world_map.json').then((data) => {
  let features = data.features;

  // Gathering country centroids
  let centroids = [];
  features.forEach((f) => {
    let centroid = pathGenerator.centroid(f);
    centroids.push([centroid[0], centroid[1], f.properties.name]);
  });

  // Generate map

  map
    .selectAll('path')
    .data(features)
    .enter()
    .append('path')
    .attr('class', 'map')
    .attr('d', pathGenerator)
    .style('fill', '#273147')
    .style('stroke', 'rgb(0, 0, 0)')
    .style('stroke-opacity', '0.25')
    .on('mouseover', () => d3.select(event.target).style('fill', '#485470'))
    .on('mouseout', () => d3.select(event.target).style('fill', '#273147'))
    .on('click', (clicked) => {
      legend.moveToFront();
      generateDataDisplay(clicked, centroids);
    });
});

function generateDataDisplay(element, centroids) {
        // Return CSV promise
        let csv_data = getData();
        const country = element.properties.name.split(' ').join('_');
      
      
        // Call the data gathering function
        //getMigration(csv_data, country, center, centroids);
}      
      
      
// Data loading function
function getData() {
        return d3.csv('../../data/CSV/dataset_2015.csv');
}
      
function zoomed() {
        worldMapDiasplay.attr('transform', d3.event.transform);
}