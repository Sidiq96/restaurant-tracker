mapboxgl.accessToken =
  "pk.eyJ1Ijoia3JheXppZWphbWFhIiwiYSI6ImNsbTk3N3liNzBoOXgzcHFxcnYxbzFlZGoifQ.CFAObEgH4I_ADDAdhMOR1Q";

let map;
let geocoder;
let markers = [];

// Function to remove existing markers from the map
function removeMarkers() {
  markers.forEach((marker) => marker.remove());
  markers = [];
}

$(document).ready(function () {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-0.127647, 51.537322],
    zoom: 11
  });

  // Initializes the Mapbox Geocoder
  geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    placeholder: "Search restaurants in London",
    bbox: [-0.351708, 51.384527, 0.153177, 51.669993],
    countries: "gb"
  });

  // Adds geocoder to the map
  map.addControl(geocoder);

  map.once("load", function () {
    map.removeControl(geocoder);
  });

  geocoder.on("result", function (event) {
    const coordinates = event.result.geometry.coordinates;

    map.setCenter(coordinates);
    map.setZoom(11);

    // Clear existing markers
    removeMarkers();

    // Add new markers
    const newMarker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setText(event.result.text))
      .addTo(map);

    markers.push(newMarker);
  });

  // Event listener for your form submission
  $("#searchform").submit(function (e) {
    e.preventDefault();

    geocoder.clear();

    const location = $("#restaurant_name").val().trim();

    if (location === "") return;

    // Clear existing markers before adding new ones
    removeMarkers();

    // Perform a search when the form is submitted
    performSearch(`restaurants in ${location}, London`);
  });

  // fetch Map data from mapbox api

  function performSearch(name, category) {
    var londonBbox = [-0.510375, 51.50676, 0.334015, 51.691874]; // Bounding box for London
    let apiUrl;

    if (name && !category) {
      // Search by name
    apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(name)}.json?access_token=${mapboxgl.accessToken}&bbox=${londonBbox.join(',')}`;
    } else if (!name && category) {
      // Search by category
    apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(category)}.json?access_token=${mapboxgl.accessToken}&bbox=${londonBbox.join(',')}`;
    } else if (name && category) {
    //   // Search by name and category
     apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(name)}.json?access_token=${mapboxgl.accessToken}&types=${category}&bbox=${londonBbox.join(',')}`;
    } else {
      console.error('Invalid search criteria');
      return;
    }

    fetch(apiUrl)

      .then((response) => response.json())
      .then((data) => {
        // Filter results to only include places within the London bounding box
        const filteredPlaces = data.features.filter((place) => {
          const coordinates = place.geometry.coordinates;
          return (
            coordinates[0] >= londonBbox[0] &&
            coordinates[0] <= londonBbox[2] &&
            coordinates[1] >= londonBbox[1] &&
            coordinates[1] <= londonBbox[3]
          );
        });

        // Display markers for each place found within the London bounding box
        filteredPlaces.forEach((place) => {
          const placeCoordinates = place.geometry.coordinates;

          // Add markers for each place
          const newMarker = new mapboxgl.Marker()
            .setLngLat(placeCoordinates)
            .setPopup(new mapboxgl.Popup().setText(place.text))
            .addTo(map);

          markers.push(newMarker);


        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

});



