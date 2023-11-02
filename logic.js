// Define the map and its initial settings
const myMap = L.map("map", {
    center: [0, 0], // Default center coordinates
    zoom: 2, // Default zoom level
    layers: [] // Initial layer
  });
  
  // Add a base layer (you can choose from different options)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  }).addTo(myMap);
  
  // Create a function to set marker size based on earthquake magnitude
  function getMarkerSize(magnitude) {
    return magnitude * 5; // You can adjust the multiplier as needed
  }
  
  // Create a function to set marker color based on earthquake depth
  function getMarkerColor(depth) {
    // You can define your own color scale based on depth levels
    if (depth < 10) {
      return "#00FF00"; // Green for shallow earthquakes
    } else if (depth < 30) {
      return "#FFFF00"; // Yellow for intermediate depth earthquakes
    } else {
      return "#FF0000"; // Red for deep earthquakes
    }
  }
  
  // Fetch earthquake data from the USGS GeoJSON Feed
  const earthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  
  d3.json(earthquakeDataURL).then(function (data) {
    // Create a GeoJSON layer with markers for each earthquake
    L.geoJSON(data.features, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: getMarkerSize(feature.properties.mag),
          fillColor: getMarkerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`<strong>Magnitude:</strong> ${feature.properties.mag}<br><strong>Location:</strong> ${feature.properties.place}<br><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`);
      }
    }).addTo(myMap);
  });
  
   // Legend 
    
   const legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  const div = L.DomUtil.create("div", "info legend");
  const depths = [-10, 10, 30]; // You can adjust depth levels
  const colors = ["#00FF00", "#FFFF00", "#FF0000"];
  const labels = ["Shallow (< 10 km)", "Intermediate (10 - 29 km)", "Deep (30+ km)"];

  let legendHTML = '<div><strong>Earthquake Depth</strong></div>';
  
  // Loop through depth levels and create labels with colors
  for (let i = 0; i < depths.length; i++) {
    legendHTML +=
      `<div>
        <i style="background:${colors[i]}"></i> ${labels[i]}
      </div>`;
  }

  div.innerHTML = legendHTML;

  return div;
};

legend.addTo(myMap);