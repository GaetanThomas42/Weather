function httpGet(url) {
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    return request;
}

function formatTemp(t) {
    return (t - 273.15).toString().slice(0, 5) + " °C"
}

function formatSpeed(s) {
    return (s * 3.6).toString().slice(0, 5) + " km/h"
}

function getWeaterFromCity() {
    var city = document.getElementById("citySearch").value;
    console.log(city);
    if (city != "") {
        let r = httpGet('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=7aa32cc4b173f17805891e587182a64b');
        r.send();
        r.onload = function () {
            data = r.response;
            setWeatherBar(data);
            myMap.removeLayer(marker)
            setupMap(data);
        }
    } else {
        document.getElementById("citySearch").placeholder = "Veuillez indiquer une ville";
    }

}

function getWeaterFromPos(lat, long) {
    let r = httpGet('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=7aa32cc4b173f17805891e587182a64b');
    r.send();
    r.onload = function () {
        let data = r.response;
        setWeatherBar(data);
        setupMap(data);
    }
}


function setupMap(data) {
    myMap.setView([data.coord.lat, data.coord.lon], 10);
    marker = L.marker([data.coord.lat, data.coord.lon], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.2,
        radius: 2000
    }).bindPopup("<b>" + data.name + "</b>").openPopup().addTo(myMap);

}

function setWeatherBar(data) {
    temp = formatTemp(data.main.temp);
    minTemp = formatTemp(data.main.temp_min);
    maxTemp = formatTemp(data.main.temp_max);
    speed = formatSpeed(data.wind.speed);
    document.getElementById("acTemp").innerHTML = temp;
    document.getElementById("lowTemp").innerHTML = minTemp;
    document.getElementById("maxTemp").innerHTML = maxTemp;
    document.getElementById("pressure").innerHTML = "pression: " + data.main.pressure + " hPa ";
    document.getElementById("humidity").innerHTML = "humidité: " + data.main.humidity + " %";
    document.getElementById("windSpeed").innerHTML = "vent: " + speed;
    document.getElementById("windArrow").style.transform = "rotate(" + data.wind.deg + "deg)";
    document.getElementById("weatherIcon").src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    document.getElementById("weatherIcon").alt = "weatherIcon"
    document.getElementById("windArrow").src = "assets/windArrow.png";
    document.getElementById("windArrow").alt = "windArrow";
    document.getElementById("windArrow").style.width = "2%";
    document.getElementById("windArrow").style.height = "2%";
    document.getElementById("lowTemp").style.height = "50%";
    document.getElementById("maxTemp").style.height = "50%";
}

let myMap;
let marker;
navigator.geolocation.getCurrentPosition(function (position) {
    myMap = L.map('map').setView([position.coords.latitude, position.coords.longitude], 10);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZ2F6ei1kZXYiLCJhIjoiY2tlazl5aHh4Mm8xczJ6bWl0eTY1YTg3cCJ9.Hs_2dNA80s9gQaYiqsMXpw'
    }).addTo(myMap);
    getWeaterFromPos(position.coords.latitude, position.coords.longitude);

});
