mapboxgl.accessToken =
  "pk.eyJ1Ijoia3JheXppZWphbWFhIiwiYSI6ImNsbTk3N3liNzBoOXgzcHFxcnYxbzFlZGoifQ.CFAObEgH4I_ADDAdhMOR1Q";

let geocoder;
let map;

$(document).ready(function () {
  geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    placeholder: "Search restaurants in London",
    bbox: [-0.351708, 51.384527, 0.153177, 51.669993],
    countries: "gb",
  });

// geocoder.hide();

  geocoder.on("result", function (event) {
    const coordinates = event.result.geometry.coordinates;

    map.setCenter(coordinates);
    map.setZoom(12);

    // Add a marker at the selected coordinates
  new mapboxgl.Marker()
  .setLngLat(coordinates)
  .setPopup(
    popup.setText(event.result.text)
  )
  .addTo(map);

// Open the popup
popup.setLngLat(coordinates).setText(event.result.text).addTo(map);
  });

  $("#searchform").submit(function (e) {
    e.preventDefault();
    const location = $("#restaurant_name").val().trim();

    if (location === "") return;

    geocoder.query(location);
  });

  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-0.127647, 51.507322],
    zoom: 9,
  });

  //since we are using mapbox geocoder, we need to add it
  map.addControl(geocoder);

    // once it the map is loaded we hide the co
    map.once("load", function () {
        map.removeControl(geocoder);
      });

  const popup = new mapboxgl.Popup({
    offset: 25,
  });
});
