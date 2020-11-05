// WHEN I search for a city
// THEN I am presented with current and future conditions for that city 
// and that city is added to the search history
let searchHistory = [];

loadSearch();

$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    let city = $("#city-input").val().trim();
    console.log(city);
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    saveSearch();
});

function saveSearch() {
    $("#history").empty();
    for (let i=0; i < searchHistory.length; i++) {
        let history = $("<li>");
        history.text(searchHistory[i]);
        $("#history").prepend(history);
    }
};

function loadSearch() {
    let storedHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedHistory !== null) {
        searchHistory = storedHistory
    }
    saveSearch();
}
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city