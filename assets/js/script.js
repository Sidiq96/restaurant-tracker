mapboxgl.accessToken =
  "pk.eyJ1Ijoia3JheXppZWphbWFhIiwiYSI6ImNsbTk3N3liNzBoOXgzcHFxcnYxbzFlZGoifQ.CFAObEgH4I_ADDAdhMOR1Q";

// Initialize a single map
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // Map style to use
  center: [-0.127647, 51.507322], // Starting position [lng, lat]
  zoom: 9, // Starting zoom
});

// Initialize a single geocoder
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search restaurants in London", // Placeholder text for the search bar
  bbox: [-0.351708, 51.384527, 0.153177, 51.669993], // Bounding box
  countries: "gb", // Restricting country locations
});

// Add the geocoder to the map
map.addControl(geocoder);

// Create a popup
const popup = new mapboxgl.Popup({
  offset: 25,
});

// Listen for the `result` event from the Geocoder
geocoder.on("result", (event) => {
  const coordinates = event.result.geometry.coordinates;

  // Set the map center to the selected location
  map.setCenter(coordinates);
  map.setZoom(12);

  // Add a marker at the selected coordinates
  new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
      popup.setHTML(
        `<h3><a href="http://www.shakeshack.co.uk">${event.result.text}</a></h3>`
      )
    )
    .addTo(map);

  // Open the popup
  popup.setLngLat(coordinates).setText(event.result.text).addTo(map);
});





// Suhaim Code JS

// Function for the Logo

$(".main_icon").on("click",function(){
  window.location.href = "index.html";
})


// Search Button Function

// var search_btn = $("#search_btn");

// search_btn.on("click",function(event){
//   event.preventDefault();

// var restaurant_input_name = $("#restaurant_name").val().trim();

// var mapbox_input= $(".mapboxgl-ctrl-geocoder--input");
// mapbox_input.val(restaurant_input_name);
// mapbox_input.on("keydown",function(){
//   mapbox_input.val(restaurant_input_name);
// })
// console.log(mapbox_input.text());
// })



//  Keydown Function
var restaurant_input_name = $("#restaurant_name").val().trim();

$("#restaurant_name").on("keydown",function(){
  var restaurant_input_name = $("#restaurant_name").val().trim();
  var mapbox_input= $(".mapboxgl-ctrl-geocoder--input");
  mapbox_input.val(restaurant_input_name);
  console.log(restaurant_input_name)
})