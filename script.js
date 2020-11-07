// WHEN I search for a city
// THEN I am presented with current and future conditions for that city 
// and that city is added to the search history
let searchHistory = [];
let APIKey = "2291d60c5831d852804e78e42871c5c8";

//load any previous searches from local storage
//grab lastSearch from ls
let lastCity=localStorage.getItem("lastSearch");
loadSearch();
//if you hve data from ls use it
if(lastCity!=null){
    displayCurrentWeather(lastCity)
    // fiveDay(lastCity)
}else{
    //else default with greenville
    displayCurrentWeather("Greenville");
    // fiveDay("Greenville")
}

// on click of search button, get the value of the search and save it 
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    let city = $("#city-input").val().trim();
    if (city === "") {
        return; 
    }
    displayCurrentWeather(city);
    fiveDay(city);
    $("#city-input").val("");
    console.log(city);
    let isDone=false;
    //check if you already have it in the array
    for(var i=0; i<searchHistory.length&&!isDone;i++){
        //error check remove all spaces and lowercase everything to compare userinput with current array
        if(city.toLowerCase().replace(/\s+/g, '') == searchHistory[i].toLowerCase().replace(/\s+/g, '')){
            isDone=true;
        }
    }
    //if not push the city
    //if there is no match
    if(!isDone){
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    
    localStorage.setItem("lastSearch", city);

    saveSearch();
   
});

// add the search input to the search history section of the page
function saveSearch() {
    $("#history").empty();
    for (let i=0;( i < searchHistory.length && i<5); i++) {
        let history = $("<li>");
        history.text(searchHistory[i]);
        history.attr("class", "usercity");
        $("#history").prepend(history);
    }

    //onclick for usercity needs to be here due to scoping issues
    $(".usercity").on("click", function() {
        displayCurrentWeather($(this).text());
        //fiveDay($(this).text());
    })
    //grab city
    //call 5days
    //calloneday
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


let currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;



$.ajax({
    url: currentWeatherURL,
    method: "GET"
})



.then(function(response) {
    console.log(currentWeatherURL);
    // console.log(response);
    $(".city").html("<h2>" + response.name + " (" + (currentDate) + ")" + "</h2>");
    let windMPH = (response.wind.speed) * 2.237;
    $(".wind").text("Wind Speed: " + windMPH.toFixed(1) + " MPH");
    $(".humidity").text("Humidity: " + response.main.humidity);
    let tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(".temp").text("Temperature (F): " + tempF.toFixed(2));
    //uv: lon and lat
    let lon= response.coord.lon;
    let lat= response.coord.lat;
    // console.log(lon);
    // console.log(lat)

    var uvURL="http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+APIKey;
    console.log(uvURL)

    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function(uvObj){
        console.log(uvObj.value);
        $(".uv").text(uvObj.value);
        if (uvObj.value <= 2 ) {
            $(".uv").attr("class", "favorable");
            $(".uv").removeAttr("class", "moderate");
            $(".uv").removeAttr("class", "high");
        } else if (uvObj.value <= 5 ) {
            $(".uv").attr("class", "moderate");
            $(".uv").removeAttr("class", "favorable");
            $(".uv").removeAttr("class", "high");
        } else if (uvObj.value > 5 ) {
            $(".uv").attr("class", "high");
            $(".uv").removeAttr("class", "moderate");
            $(".uv").removeAttr("class", "favorable");
        }
    });
    

})
}



function fiveDay(city) {
    console.log(city);
    //5days run every 3 hr, make a for loop 5 times and mult it by 8 so each day is 24 hrs
    //3*8=24 hours
    var fiveURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    console.log(fiveURL);

    let startingDate = moment().format("YYYY-MM-DD");
    console.log(startingDate);
    console.log(moment().add(1, 'days').format("YYYY-MM-DD"));

    $.ajax({
        url: fiveURL,
        method: "GET"
    }) 
    .then(function(forecast){
        console.log(forecast);
        let counter = 1;
        for (let i=0; i < forecast.list.length; i++) {
        
            let forecastObj = {
                date: forecast.list[i].dt_txt,
                icon: forecast.list[i].weather[0].icon,
                temp: forecast.list[i].main.temp,
                humidity: forecast.list[i].main.humidity
            }
           
            let date = forecastObj.date;
            let trimmedDate = date.substr(0,10);
            console.log(trimmedDate);

            // go into forecast and get data for specific day
            // once we  get the data, create new html 
            // put data into proper html element 
            // display/append new html to the page

            // potential issues: might get more data than we need 
            // data we get is either going to be start or end of day 

            if (trimmedDate === moment().add(counter, 'days').format("YYYY-MM-DD")) {
                i = i+8;
                counter++;
                let dayDiv = $("<div>");
                let dateEl = $("<div>");
                let iconEl = $("<div>");
                let tempEl = $("<div>");
                let humidityEl = $("<div>");

                dateEl.text(trimmedDate);
                tempEl.text(forecastObj.temp);
                humidityEl.text(forecastObj.humidity);

                dayDiv.append(dateEl, tempEl, humidityEl);
                console.log(dayDiv);
                $(".card-row").append(dayDiv);
            }
            
        }
    });






}

//fiveDay("greenville")

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
    // let imageName = (response.weather[0].icon);
    // imageURL = iconHtml + imageName + ".png";
    // let icon = 