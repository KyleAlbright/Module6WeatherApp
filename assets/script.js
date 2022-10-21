//Global Variables stored to use later... will add as we go
var myAPIKey = "ba9ea14c2a8aeed674bb0ecf23b1bb52";
var savedLocations = [];

// make list of previously searched cities
var handleCityList = function (city) {
  $(".previous-search:contains('" + city + "')").remove();

  // create entry with city name
  var searchHistory = $("<p>");
  searchHistory.addClass("previous-search");
  searchHistory.text(city);

  // create container for entry
  var searchHistoryContainer = $("<div>");
  searchHistoryContainer.addClass("previous-search-container");

  // append entry to container
  searchHistoryContainer.append(searchHistory);

  // append entry container to search history container
  var searchContainerEl = $("search-container");
  searchContainerEl.append(searchHistoryContainer);


  if (savedLocations.length > 0) {
    var prevSavedLocations = localStorage.getItem("savedLocations");
    savedLocations = JSON.parse(prevSavedLocations);
  }

  savedLocations.push(city);
  localStorage.setItem("savedLocations", JSON.stringify(savedLocations));

  $("#search-input").val("");
  
};

var loadSearchHistory = function () {
  var savedSearchHistory = localStorage.getItem("savedLocations");

  if (!savedSearchHistory) {
    return false;
  }
  savedSearchHistory = JSON.parse(savedSearchHistory);

  for (i = 0; i < savedSearchHistory.length; i++) {
    handleCityList(savedSearchHistory[i]);
  }
};

var currentWeather = function (city) {
  fetch
  (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIKey}`)
    .then(function (response) {
      return response.json();
    })

    .then(function (response) {
      var longitude = response.coord.lon;
      var latitude = response.coord.lat;

      fetch
      (`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${myAPIKey}`)
        .then(function (response) {
          return response.json();
        })

        .then(function (response) {
          handleCityList(city);


          var currentWeatherContainer = $("#current-weather-container");
          currentWeatherContainer.addClass("current-weather-container");

          var currentTitle = $("#current-title");
          var currentDay = moment().format("M/D/YYYY");
          currentTitle.text(`${city} (${currentDay})`);
          var currentIcon = $("#current-weather-icon");
          currentIcon.addClass("current-weather-icon");
          var currentIconCode = response.current.weather[0].icon;
          currentIcon.attr("src",`http://openweathermap.org/img/w/${currentIconCode}.png`);

          var currentTemperature = $("#current-temperature");
          currentTemperature.text (response.current.temp + " \u00B0");

          var currentHumidity = $("#current-humidity");
          currentHumidity.text (response.current.humidity + " %");

           var currentWindSpeed = $("#current-wind-speed");
           currentWindSpeed.text(response.current.wind_speed + " MPH");

         });
    })

        .catch(function(err) {
        $("#search-input").val("");

        alert("Invalid Location");

    });

    var fiveDayForcast = function(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var longitude = response.coord.lon;
            var latitude = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${myAPIKey}`)
            .then(function(response) {
                return response.json();
            })
            .then (function(response) {
                console.log(response);

                var fiveDayTitle = $("#five-day-title");
                fiveDayTitle.text("Five Day Forecast:")

                for(i=1; i<=5; i++) {
                    var forecastCard = $(".forecast-card");
                    forecastCard.addClass("forecast-card-details");

                    var forecastDate = $("#forecast-date-" + i);
                    date = moment().add(i, "d").format("M/D/YYYY");
                    forecastDate.text(date);

                    var forecastIcon = $("#forecast-icon-" + i);
                    forecastIcon.addClass("future-icon");
                    var forecastIconCode = response.daily[i].weather[0].icon;
                    forecastIcon.attr("src", `http://openweathermap.org/img/w/${currentIconCode}.png`);

                    var forecastTemp = $("#forecast-temp-" + i);
                    forecastTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0");
                    
                    var forecastHumid = $("#forecast-humid-" + i);
                    forecastHumid.text("Temp: " + response.daily[i].temp.day + " \u00B0");

                }
            })
        })
    }


    $("search-form").on("submit", function(event) {
        event.preventDefault();

        var city = $("search-input").val();

        if (city === "" || city == null) {
            alert("Invalid Entry");
            event.preventDefault();
        } else {
            fiveDayForcast(city);
            currentWeather(city);

        }

    });

    $("#search-container").on("click", "p", function(){
        var lastCity = $(this).text();
        fiveDayForcast(lastCity);
        currentWeather(lastCity);

        var lastCityClicked = $(this);
        lastCityClicked.remove();

    });
    loadSearchHistory();
};


