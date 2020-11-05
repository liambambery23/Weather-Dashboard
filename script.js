// WHEN I search for a city
// THEN I am presented with current and future conditions for that city 
// and that city is added to the search history
let searchHistory = [];

//load any previous searches from local storage
loadSearch();

// on click of search button, get the value of the search and save it 
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    let city = $("#city-input").val().trim();
    if (city === "") {
        return; 
    }
    displayCurrentWeather(city);
    console.log(city);
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    saveSearch();
   
});

// add the search input to the search history section of the page
function saveSearch() {
    $("#history").empty();
    for (let i=0; i < searchHistory.length; i++) {
        let history = $("<li>");
        history.text(searchHistory[i]);
        $("#history").prepend(history);
    }
};
//function to load local storage
function loadSearch() {
    let storedHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedHistory !== null) {
        searchHistory = storedHistory
    }
    saveSearch();
};

//function to call api for current weather of searched city 
function displayCurrentWeather(city) {
let currentDate = moment().format('L');
let APIKey = "2291d60c5831d852804e78e42871c5c8";

let currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;



$.ajax({
    url: currentWeatherURL,
    method: "GET"
})



.then(function(response) {
    console.log(currentWeatherURL);
    console.log(response);
    $(".city").html("<h2>" + response.name + " (" + (currentDate) + ")" + "</h2>");
    let windMPH = (response.wind.speed) * 2.237;
    $(".wind").text("Wind Speed: " + windMPH.toFixed(1) + " MPH");
    $(".humidity").text("Humidity: " + response.main.humidity);
    let tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(".temp").text("Temperature (F): " + tempF.toFixed(2));
})
}
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city


//code for icons
// let iconHtml = "http://openweathermap.org/img/wn";
//     let imageName = (response.weather[0].icon);
//     imageURL = iconHtml + imageName + ".png";
//     let icon = 