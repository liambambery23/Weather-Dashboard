
let searchHistory = [];
let APIKey = "2291d60c5831d852804e78e42871c5c8";

//load any previous searches from local storage
//grab lastSearch from ls
let lastCity=localStorage.getItem("lastSearch");
loadSearch();
//if you hve data from ls use it
if(lastCity!=null){
    displayCurrentWeather(lastCity)
    fiveDay(lastCity)
}else{
    //else default with greenville
    displayCurrentWeather("Greenville");
    fiveDay("Greenville")
}

// on click of search button, get the value of the search and save it 
$("#searchBtn").on("click", function(event) {
    
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
        $(".uv").text("");
        displayCurrentWeather($(this).text());
        fiveDay($(this).text());
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
    
    $(".city").html("<h2>" + response.name + " (" + (currentDate) + ")" + "</h2>");
    let windMPH = (response.wind.speed) * 2.237;
    $(".wind").text("Wind Speed: " + windMPH.toFixed(1) + " MPH");
    $(".humidity").text("Humidity: " + response.main.humidity);
    let tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(".temp").text("Temperature (F): " + tempF.toFixed(2));
    
    //this grabs the proper weather icon
    let iconHtml = "https://openweathermap.org/img/wn/";
    let imageName = (response.weather[0].icon);
    console.log(imageName);
    let imageURL = iconHtml + imageName + "@2x.png";
    $("#currentIcon").attr("src", imageURL);
    //uv: lon and lat
    let lon= response.coord.lon;
    let lat= response.coord.lat;
 

    var uvURL="https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+APIKey;
    console.log(uvURL)
    

    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function(uvObj){
        $(".uv").text("UV Index: ");
        console.log(uvObj.value);
        let uvIndex = $("<div>");
        uvIndex.text(uvObj.value);
        uvIndex.attr("class", "uv-text");
        $(".uv").append(uvIndex);
        //$(".uv").text("UV Index: " + uvObj.value);
        if (uvObj.value <= 2 ) {
            $(".uv-text").attr("class", "favorable");
            $(".uv-text").removeAttr("class", "moderate");
            $(".uv-text").removeAttr("class", "high");
        } else if (uvObj.value <= 5 ) {
            $(".uv-text").attr("class", "moderate");
            $(".uv-text").removeAttr("class", "favorable");
            $(".uv-text").removeAttr("class", "high");
        } else if (uvObj.value > 5 ) {
            $(".uv-text").attr("class", "high");
            $(".uv-text").removeAttr("class", "moderate");
            $(".uv-text").removeAttr("class", "favorable");
        }
    });
    

})
}



function fiveDay(city) {
    

    var fiveURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    console.log(fiveURL);

    let startingDate = moment().format("YYYY-MM-DD");
    console.log(startingDate);
    console.log(moment().add(1, 'days').format("YYYY-MM-DD"));

    $.ajax({
        url: fiveURL,
        method: "GET"
    }) 
    .then(function(forecast){
        $(".card-row").empty();
        console.log(forecast);
        let counter = 1;
        for (let i=0; i < forecast.list.length; i++) {
        
            let forecastObj = {
                date: forecast.list[i].dt_txt,
                icon: forecast.list[i].weather[0].icon,
                temp: forecast.list[i].main.temp,
                humidity: forecast.list[i].main.humidity
            }
            let tempF = (forecastObj.temp - 273.15) * 1.80 + 32;
            let date = forecastObj.date;
            let trimmedDate = date.substr(0,10);
            let forecastIcon = "https://openweathermap.org/img/wn/";
            let iconURL = forecastIcon + forecastObj.icon + "@2x.png";
            
            

            if (trimmedDate === moment().add(counter, 'days').format("YYYY-MM-DD")) {
                i = i+8;
                counter++;
                let dayDiv = $("<div>");
                let dateEl = $("<div>");
                let iconEl = $("<img>");
                let tempEl = $("<div>");
                let humidityEl = $("<div>");

                dateEl.text(trimmedDate);
                tempEl.text(Math.floor(tempF) + " F");
                humidityEl.text(forecastObj.humidity + "%");
                iconEl.attr("src", iconURL);
                
                dayDiv.attr("class", "forecast-day");

                dayDiv.append(dateEl, iconEl, tempEl, humidityEl);
                $(".card-row").append(dayDiv);
            }
            
        }
    });
}

// function for clear button
$("#clearBtn").on("click", function() {
    localStorage.removeItem("searchHistory");
    location.reload();
})