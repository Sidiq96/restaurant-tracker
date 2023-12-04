mapboxgl.accessToken = "pk.eyJ1Ijoia3JheXppZWphbWFhIiwiYSI6ImNsbTk3N3liNzBoOXgzcHFxcnYxbzFlZGoifQ.CFAObEgH4I_ADDAdhMOR1Q";

let map;
let geocoder;
let markers = [];

$(document).ready(function () {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-0.127647, 51.507322],
    zoom: 9,
  });

  // Mapbox Geocoder
  geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    placeholder: "Search restaurants in London",
    bbox: [-0.351708, 51.384527, 0.153177, 51.669993],
    countries: "gb",
  });

  // Add geocoder to the map
  map.addControl(geocoder);

  map.once("load", function () {
    map.removeControl(geocoder);
  });

  // Event listener for geocoder result
  geocoder.on("result", function (event) {
    const coordinates = event.result.geometry.coordinates;

    map.setCenter(coordinates);
    map.setZoom(12);

    // Add a marker at the selected coordinates
    new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setText(event.result.text))
      .addTo(map);

    // Fetch restaurant details when a location is selected
    fetchRestaurant(event.result.text);
  });

  // Function to perform Mapbox Search API request
  function performSearch(query) {
    const londonBbox = [-0.510375, 51.28676, 0.334015, 51.691874];
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&bbox=${londonBbox.join(',')}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        markers.forEach((marker) => marker.remove());
        markers = [];

        const filteredFeatures = data.features.filter((place) => {
          const coordinates = place.geometry.coordinates;
          return (
            coordinates[0] >= londonBbox[0] &&
            coordinates[0] <= londonBbox[2] &&
            coordinates[1] >= londonBbox[1] &&
            coordinates[1] <= londonBbox[3]
          );
        });

        filteredFeatures.forEach((place) => {
          const placeCoordinates = place.geometry.coordinates;
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

  // Event listener for your form submission
  $("#searchform").submit(function (e) {
    e.preventDefault();
    geocoder.clear();
    const location = $("#restaurant_name").val().trim();

    if (location === "") return;

    // Perform a search when the form is submitted
    performSearch(`restaurants in ${location}, London`);
  });

  // Function to fetch restaurant details
  function fetchRestaurant(restaurantName) {
    const url = `https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/getRestaurantDetails?restaurantsId=${encodeURIComponent(restaurantName)}&currencyCode=GBR&rapidapi-key=73a6b7e941msh7b32adeb46d86d8p18b277jsn70c5ae8fc490`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        updateRestaurantCard(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Function to update restaurant card UI
  function updateRestaurantCard(details) {
    // Select the container where the restaurant card will be appended
    const restaurantCard = $('#restaurant_section');

    // Clear previous content in the container
    restaurantCard.empty();

    // Check if details object has necessary properties
    if (details && details.overview && details.location) {
      const restaurantName = details.overview.name;
      const restaurantDes = details.location.neighborhood_info[0];

      // Append a new restaurant card to the container
      restaurantCard.append(`
        <div class="container">
          <div class="row">
            <div class="col-4">
              <div class="restaurant_card">
                <div class="restaurant_body">
                  <h3 class="rest_name">${restaurantName}</h3>
                  <p class="rest_des">${restaurantDes}</p>
                  <p class="feedback_text">FeedBack</p>
                  <input type="text" id="feedback" class="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
    } else {
      console.error("Invalid details object:", details);
    }
  }
});