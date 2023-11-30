
mapboxgl.accessToken = 'pk.eyJ1Ijoia3JheXppZWphbWFhIiwiYSI6ImNsbTk3N3liNzBoOXgzcHFxcnYxbzFlZGoifQ.CFAObEgH4I_ADDAdhMOR1Q';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: [-0.127647, 51.507322], // starting position [lng, lat]
  zoom: 9 // starting zoom
});
const searchmap = new mapboxgl.Map({
  container: 'searchmap', // Container ID
  style: 'mapbox://styles/mapbox/streets-v12', // Map style to use
  center: [-0.127647, 51.507322], // Starting position [lng, lat]
  zoom: 12, // Starting zoom level
});

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: 'Search restaurants in London', // Placeholder text for the search bar
  bbox: [
    -0.351708,
    51.384527,
    0.153177,
    51.669993
  ],
  // restricting country locations
  countries: 'gb'
});
// Add the geocoder to the map
map.addControl(geocoder);
// After the map style has loaded on the page,
// add a source layer and default styling for a single point
map.on('load', () => {
  map.addSource('single-point', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  });
  map.addLayer({
    'id': 'point',
    'source': 'single-point',
    'type': 'circle',
    'paint': {
      'circle-radius': 10,
      'circle-color': '#448ee4'
    }
  });

      // // create the popup
const popup = new mapboxgl.Popup({
  offset: 25
})
  // Listen for the `result` event from the Geocoder // `result` event is triggered when a user makes a selection
  //  Add a marker at the result's coordinates
  geocoder.on('result', (event) => {
    map.getSource('single-point').setData(event.result.geometry);
    const coordinates = event.result.geometry.coordinates;

    const marker = new mapboxgl.Marker() // Initialize a new marker
  .setLngLat([-0.127647, 51.507322]) // Marker [lng, lat] coordinates
  .setPopup(popup.setText(event.result.text)) // sets a popup on this marker
  .addTo(map); // Add the marker to the map
// create DOM element for the marker
const el = document.createElement('div');
el.id = 'marker';

// Set popup content and coordinates
$('#map').on('click', function popUpLink(event){
var url = event.target.text();
// var anything = url.text;
console.log(url)
})


popup.setLngLat(coordinates)
  .setText(event.result.text)
  .setHTML('<h3><a href="http://www.shakeshack.co.uk"></a></h3>')
  .addTo(map);

  });
});

$("#map").on("click",function(even){

});

