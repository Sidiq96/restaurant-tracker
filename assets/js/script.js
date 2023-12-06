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
    zoom: 11,
  });

  // Initializes the Mapbox Geocoder
  geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    placeholder: "Search restaurants in London",
    bbox: [-0.351708, 51.384527, 0.153177, 51.669993],
    countries: "gb",
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

    // // Add new markers
    // const newMarker = new mapboxgl.Marker()
    //   .setLngLat(coordinates)
    //   .setPopup(new mapboxgl.Popup().setText(event.result.text))
    //   .addTo(map);

    // markers.push(newMarker);
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
      apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        name
      )}.json?access_token=${mapboxgl.accessToken}&bbox=${londonBbox.join(
        ","
      )}`;
    } else if (!name && category) {
      // Search by category
      apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        category
      )}.json?access_token=${mapboxgl.accessToken}&bbox=${londonBbox.join(
        ","
      )}`;
    } else if (name && category) {
      // Search by name and category
      apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        name
      )}.json?access_token=${
        mapboxgl.accessToken
      }&types=${category}&bbox=${londonBbox.join(",")}`;
    } else {
      console.error("Invalid search criteria");
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
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<a href="#restaurant-card">${place.text}</a>`
            )
          )
          .addTo(map);

        markers.push(newMarker);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }





});


// Suhaim Code
  // Function to fetch restaurant details
  // fetchRestaurant();
  function fetchRestaurant() {

  var apiKey="9e74ecab5amshd82c9fc57f9997dp126f51jsnfe476470f337";

  var url = "https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/getRestaurantDetails?restaurantsId=Restaurant_Review-g304554-d8010527-Reviews-Saptami-Mumbai_Maharashtra&currencyCode=USD&rapidapi-key="+apiKey;


  fetch(url).then(function(response){
  return response.json();
  })
  .then(function(data){
  console.log(data);
    display_restaurant_html(data);
  })
  .catch(function(error){
  console.error(error)
  });
  }


  // Suhaim Code
  // function to get value from input field
  $("#search_btn").on("click",function(){
    var restaurant_name = $("#restaurant_name").val().trim();
    fetch_restaurant_details(restaurant_name);
  });

  // Function to fetch data on the base of place id
  function fetch_restaurant_details(restaurant_name){
  var apiKey="9e74ecab5amshd82c9fc57f9997dp126f51jsnfe476470f337";

  var url = "https://local-business-data.p.rapidapi.com/search?query="+restaurant_name+"&language=en&rapidapi-key="+apiKey;


  fetch(url).then(function(response){
  return response.json();
  })
  .then(function(data){
    var result = data.data[0];
    console.log(result);
    
    display_restaurant_html(result);
  })
  .catch(function(error){
  console.error(error)
  });
  }

  // Suhaim Code
  // Function to update restaurant card UI
  function display_restaurant_html(details) {
  var restaurant = details;

  // Select the container where the restaurant card will be appended
  var restaurantsection = $('.restaurant_section');

  // Clear previous content in the container
  restaurantsection.empty();

  // Getting value from the api
  var restaurantName = restaurant.name;
  var restaurant_address = restaurant.full_address;
  var restaurantDes = restaurant.about.summary;

  // For In hours string remove today
  var restaurant_hours = restaurant.working_hours.Friday[0];


// Replace "Today" with an empty string

  var restaurant_hours = "Hours " + restaurant_hours;;
  var restaurant_number = restaurant.phone_number;
  var restaurant_website =  restaurant.website;


 var restaurant_photo = restaurant.photos_sample[0].photo_url_large;


 


  // Append a new restaurant card to the container
  restaurantsection.append(`
  <div class="container">
  <h2 class="rest_title">Restaurant Details</h2>
    <!-- Restaurant card -->
    <div class="restaurant_card">
      <div class="row">
        <div class="col-lg-8 col-md-12">
          <div class="restaurant_left_side">
            <!-- Restaurant name -->
            <h3 class="restaurant_name">${restaurantName}</h3>
            <p class="restaurant_address">${restaurant_address}</p>
            <p class="restaurant_description">${restaurantDes}</p>
            <ul class="restaurant_ul">
                <li><p class="restaurant_hours">${restaurant_hours}</p></li>
                <li><p class="restaurant_number">${restaurant_number}</p></li>
                <li><p class="restaurant_website"><a href="${restaurant_website}" class="restaurant_website_link">Website</a></p></li>
            </ul>
            <div class="resturant_feedback_Section">
              <h4 class="FeedBack_title">Feedback</h4>
              <textarea name="" id="FeedBack_text"></textarea>
              <button class="btn btn-lg" id="submit_feedback">Submit</button>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-12 ">
          <div class="restaurant_right_side">
            <img src="${restaurant_photo}" class="restaurant_photo" alt="Restaurant Image" />
          </div>
        </div>
      </div>
    </div>
  </div>
  `);

  }


  // Suhaim Code
  // =============================== Local Storage on Submit Button Code ====================
  // Function TO save data in local Storage
  $(".restaurant_section").on("click","#submit_feedback",function(event){
  event.preventDefault();
  console.log("submit");
  var restaurant_name = $(".restaurant_name").text();
  var restaurant_description = $(".restaurant_description").text();
  var restaurant_hours = $(".restaurant_hours").text();
  var restaurant_website = $(".restaurant_website_link").attr("href");
  var restaurant_photo = $(".restaurant_photo").attr("src");

  var FeedBack_text= $("#FeedBack_text").val();

  $("#FeedBack_text").val("");
  // Create an object to represent the current feedback
  var feedbackData = {
  name: restaurant_name,
  description: restaurant_description,
  hours: restaurant_hours,
  website: restaurant_website,
  photo: restaurant_photo,
  feedback: FeedBack_text,
  };

  // Retrieve existing data from local storage
  var existingData = localStorage.getItem("Restaurants");

  // If there is existing data, parse it; otherwise, create an empty array
  var feedbackArray;

  if (existingData) {
  try {
  feedbackArray = JSON.parse(existingData);

  // Make sure feedbackArray is an array
  if (!Array.isArray(feedbackArray)) {
    feedbackArray = [];
    console.error("existingData is not a valid array.");
  }
  } catch (error) {
  feedbackArray = [];
  console.error("Error parsing existingData:", error);
  }
  } else {
  feedbackArray = [];
  }

  // Add the current feedback to the array
  feedbackArray.push(feedbackData);

  // Convert the array back to JSON and store it in local storage
  localStorage.setItem("Restaurants", JSON.stringify(feedbackArray));

  });