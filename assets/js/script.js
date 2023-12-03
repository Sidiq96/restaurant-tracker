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
      .setPopup(popup.setText(event.result.text))
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
// Function to fetch restaurant details
function fetchRestaurant() {
  let restaurantName = 'Saptami-Mumbai_Maharashtra';
  const url = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/getRestaurantDetails?restaurantsId=Restaurant_Review-g304554-d8010527-Reviews-' + restaurantName + '&currencyCode=GBR&rapidapi-key=73a6b7e941msh7b32adeb46d86d8p18b277jsn70c5ae8fc490';

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