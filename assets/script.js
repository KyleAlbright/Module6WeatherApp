//global variables
var myAPIKey = "ba9ea14c2a8aeed674bb0ecf23b1bb52";

var cityName = "";

var handleSearch = function () {
  cityName = $("#searchCity").val();
  if (cityName) {
    handleSubmit(cityName);
  } else {
    alert("Invalid input");
  }
};

//everything that happens in the submit
var handleSubmit = function (cityName) {
  // cityName = $("#searchCity").val();

  //fetching the data based on the city name
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${myAPIKey}`
  )
    .then(function (response) {
      return response.json();
    })
    //displaying some of the variables in the container, and using the api to coordinate the city name to the lat and lon
    .then(function (data) {
      if (data.length > 0) {
        var currentCity = $("#currentCity");
        currentCity.text(data[0].name);
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        getFiveDayForecast(data[0].lat, data[0].lon);
        storeCities(data[0].lat, data[0].lon);

        //fetching and displaying the weather data based on the lat and lon
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${myAPIKey}`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);

            var currentDate = $("#currentCityDate");
            var currentTemp = $("#currentCityTemp");
            var currentWind = $("#currentCityWind");
            var currentHum = $("#currentCityHum");
            var currentIcon = $("#currentCityIcon");

            currentDate.text(moment().format("MM/DD/YYYY"));
            currentTemp.text("Temperature: " + data.list[0].main.temp + "°F");
            currentHum.text("Humidity: " + data.list[0].main.humidity + "%");
            currentWind.text("Wind: " + data.list[0].wind.speed + " MPH");
            currentIcon.html(
              `<img src="http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png">`
            );
          });
      }
    });

  //displaying the 5 day forecast using the lat and lon. A for loop to loop through the array, and grab every 8th weather data. (weather data is broken up into 3 hour increments) That data is then appended into the cards evenly (5 cards)
  var getFiveDayForecast = function (lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${myAPIKey}`;
    fetch(apiURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var fiveDayLabel = $("#fiveDayHeader");
        fiveDayLabel.text("5-Day Forecast:");
        var fiveDayForecast = $("#fiveDayForecast");
        fiveDayForecast.empty();
        $("#searchCity").trigger("reset");
        for (var i = 0; i < data.list.length; i += 8) {
          var html = ` 
            <div class="card" style="width: 11rem; background:linear-gradient(135deg, #65799b 0%,#5e2563 100%); margin-bottom: 1em;">
            <div class="card-body">
            <h5 class="card-title" style="color:white;">${moment
              .unix(data.list[i].dt)
              .format("MM/DD/YYYY")}</h5>
            <img src="http://openweathermap.org/img/wn/${
              data.list[i].weather[0].icon
            }.png">
            <p class="card-text" style="color:white;">Temp: ${
              data.list[i].main.temp
            }°F</p>
            <p class="card-text" style="color:white;">Wind: ${
              data.list[i].wind.speed
            } MPH</p>
            <p class="card-text" style="color:white;">Humidity: ${
              data.list[i].main.humidity
            }%</p>
            </div>
            </div>
            `;
          fiveDayForecast.append(html);
        }
      });
  };

  // adding the stored cities to our list of previously searched cities using jQuery / get item and set item. 
  var storeCities = function (lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${myAPIKey}`;
    fetch(apiURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        var city = data.name;
// if it's not already in our array, add it. 
        var searchArray = JSON.parse(localStorage.getItem("city"));
        if (!searchArray) {
          searchArray = [];
        }
        console.log(searchArray);
        if (!searchArray.includes(city)) {
          searchArray.push(city);
        }
        localStorage.setItem("city", JSON.stringify(searchArray));

        console.log(searchArray);

        $("#search-history").html("");

        for (var i = 0; i < searchArray.length; i++) {
          var storedCityEl = $('<button class="btn btn-secondary btn-lg btn-rounded m-3 ">');
          var storedCity = storedCityEl
            .text(searchArray[i])
            .val(searchArray[i]);
          storedCity.click(function () {
            console.log($(this).val());
            handleSubmit($(this).val());
          });
          $("#search-history").append(storedCity);
        }
      });
  };
};

