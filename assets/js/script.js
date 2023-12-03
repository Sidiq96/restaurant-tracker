mapboxgl.accessToken =
  "pk.eyJ1Ijoia3JheXppZWphbWFhIiwiYSI6ImNsbTk3N3liNzBoOXgzcHFxcnYxbzFlZGoifQ.CFAObEgH4I_ADDAdhMOR1Q";

  let map;
  let geocoder;
let markers=[];

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
        .setPopup(
          new mapboxgl.Popup().setText(event.result.text)
        )
        .addTo(map);

    });



    // Function to perform Mapbox Search API request

    $("#searchform").submit(function (e) {
        markers.slice()
        e.preventDefault();
        const restaurant = $("#restaurant_name").val().trim();

        if (location === "") return;

        geocoder.query(restaurant);
      });
      function performSearch(query) {
        const londonBbox = [-0.510375, 51.28676, 0.334015, 51.691874]; // Bounding box for London
        const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&bbox=${londonBbox.join(',')}`;

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            markers.forEach((marker) => marker.remove());
            markers = [];

            // Filter results to only include places within the London bounding box
            const filteredFeatures = data.features.filter((place) => {
              const coordinates = place.geometry.coordinates;
              return (
                coordinates[0] >= londonBbox[0] &&
                coordinates[0] <= londonBbox[2] &&
                coordinates[1] >= londonBbox[1] &&
                coordinates[1] <= londonBbox[3]
              );
            });

            // Display markers for each place found within the London bounding box
            filteredFeatures.forEach((place) => {
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


    // Event listener for your form submission
    $("#searchform").submit(function (e) {

      e.preventDefault();
      geocoder.clear()
      const location = $("#restaurant_name").val().trim();

      if (location === "") return;

      // Perform a search when the form is submitted
      performSearch(`restaurants in ${location}, London`);
    });

  });