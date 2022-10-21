var myAPIKey =  "ba9ea14c2a8aeed674bb0ecf23b1bb52"

var searchArray = []

// var userInput = ""

var cityName = ""

//https://openweathermap.org/forecast5
//`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${myApiKey


var handleSubmit = function(){
    cityName = $("#searchCity").val()
    console.log(cityName)


fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${myAPIKey}`)
.then (function (response){
    return response.json()
}) .then (function(data){
    if(data.length > 0 ){
        var latitude = data[0].lat;
        var longitude = data[0].lon;

fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${myAPIKey}`
)
.then (function (response){
    return response.json()
}).then (function(data){
    console.log(data)
    })

    }
})
}

