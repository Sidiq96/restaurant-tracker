  
  // Header logo Function
  $(".main_icon").on("click",function(){
    window.location.href = "index.html";
});

// Function to retrive data from local Storage
var restaurant = JSON.parse(localStorage.getItem("Restaurants"));
console.log(restaurant)

console.log(restaurant.length)
display_restaurant_data(restaurant);

// Function to update restaurant card UI
function display_restaurant_data(restaurant) {

for(var i=0; i<restaurant.length; i++)
{

// Select the container where the restaurant card will be appended
var rest_row = $('.rest-row');

// Getting value from the api
var restaurantName = restaurant[i].name;

var restaurantDes = restaurant[i].description;

var restaurant_hours = restaurant[i].hours;

var restaurant_website =  restaurant[i].website;
var restaurant_photo = restaurant[i].photo;
var restaurant_feedback = restaurant[i].feedback;


// Append a new restaurant card to the container
rest_row.append(`
<div class="col-lg-4 col-md-6 col-12">
<!-- Restaurant card -->
<div class="restaurant_card">
<img src="${restaurant_photo}" class="rest_list_img" alt="Restaurant Image" />
<div class="restaurant_body">
<!-- Restaurant name -->
<h3 class="rest_name">${restaurantName}</h3>
<!-- Restaurant description -->
<p class="rest_des">${restaurantDes}</p>
<ul class="rest_ul">
<li><p class="rest_hours">${restaurant_hours}</p></li>
<li><a href="${restaurant_website}">Website</a></li>
</ul>
<!-- Feedback section -->
<p class="feedback_text">FeedBack</p>
<p class="Get_feedback">${restaurant_feedback}</p>
</div>
</div>
</div>
`);

}
}
