const api_key = "b62c832a0d2d4a7abd3110509240602";
var api_url = "https://api.weatherapi.com/v1";
var cach_key = "stored-data";
var cach_data = { cachperm: false, search_history: ["london"] };
var search_mod = "forcast";
var forcast_data = [];
var SIunits = ["c", "i"];
var alert_for_display = ``;
var data_for_display = ``;
var sub_data_for_display = ``;

cachManager();
/* #############################################  MANAGING THE NAVIGATION  ########################################## */

function navigation() {
  let nav = document.getElementById("navigation-menu");
  if (nav.style.display == "none") {
    nav.style.display = "flex";
  } else {
    nav.style.display = "none";
  }
}

/* #############################################  MANAGING THE JOBS  ########################################## */

function changeJob(mode) {
  document.getElementById("navigation-menu").style.display = "none";
  search_mod = mode;
  console.log(search_mod);
  document.getElementById(
    "main_content"
  ).innerHTML = ` <div class="head_content">
            <div id="weather_icon"></div>
            <div class="text_content">
              <div id="weather_content"></div>
            </div>
          </div>
          <div id="sub_content"></div>`;

  cachManager();
}
function jobManager(location) {
  data_for_display = ``;
  sub_data_for_display = ``;
  switch (search_mod) {
    case "forcast":
      forcast(location);
      break;
    case "history":
      history_forcast(location);
      break;
    case "marine":
      marine_forcast(location);
      break;
  }
}

/* #############################################  MANAGING THE CACH  ########################################## */
function cachManager() {
  if (!localStorage.getItem(cach_key)) {
    document.getElementById("cach-perm").style.display = "block";
  } else {
    cachDisplay();
  }
}
function hideCachPerm() {
  document.getElementById("cach-perm").style.display = "none";
  return;
}
function acceptCach() {
  hideCachPerm();
  cach_data.cachperm = true;
  localStorage.setItem(cach_key, JSON.stringify(cach_data));
}

function cachDisplay() {
  let output = document.getElementById("display");
  let generated_output = ``;
  let modeText = document.getElementById("search_bar_lable");
  cach_data = JSON.parse(localStorage.getItem(cach_key));
  console.log("in");

  switch (search_mod) {
    case "forcast":
      modeText.innerHTML = "Curent and Future Weather for : ";
      break;
    case "history":
      modeText.innerHTML = "Past Days Weather : ";
      break;
    case "marine":
      modeText.innerHTML = "Marine and Sailing weather : ";
      break;
  }

  let bound = 0;

  if (cach_data.search_history.length > 5) {
    bound = 5;
  } else {
    bound = cach_data.search_history.length;
  }
  for (let i = 0; i < bound; i++) {
    console.log(i);
    generated_output += `<button class="search_history" onclick="jobManager('${cach_data.search_history[i]}')">${cach_data.search_history[i]}</button>`;
  }
  console.log("out");
  output.innerHTML = generated_output;
}
/* #############################################  MANAGING THE SEARCH  ########################################## */

function lunshSearch() {
  let location = document.getElementById("search_bar").value;
  jobManager(location);
}

function search() {
  const protocol = "/search.json";

  let phrase = document.getElementById("search_bar").value;
  let output = document.getElementById("display");
  let constructe_output = ``;

  let constructe_api = api_url + protocol + "?key=" + api_key + "&q=" + phrase;
  fetch(constructe_api)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        constructe_output += `<button class="search_result" onclick="saveSearch('${data[i].name}')" > <h3> ${data[i].name} </h3></button>`;
        console.log(i);
      }

      output.innerHTML = constructe_output;
    });
}

function saveSearch(location) {
  let temp = cach_data.search_history.slice(location);
  let status = temp.includes(location);
  if (status) {
    jobManager(location);
  } else {
    console.log(cach_data.search_history);
    cach_data.search_history.unshift(location);
    localStorage.setItem(cach_key, JSON.stringify(cach_data));
    console.log(cach_data.search_history);
    jobManager(location);
  }
}

/* #############################################  MANAGING THE FORCASTING DATA  ########################################## */

function forcast(location) {
  const protocol = "/forecast.json";

  let output = document.getElementById("display");
  let constructe_output = ``;

  let constructe_api =
    api_url +
    protocol +
    "?key=" +
    api_key +
    "&q=" +
    location +
    "&days=14&alerts=yes&aqi=yes";
  fetch(constructe_api)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      forcast_data = data;
      output.innerHTML = constructe_output;
      biuldForcastData();
    });
}

function biuldForcastData() {
  data_for_display += `<h3>Curent Weather for :</h3>
    <h4>${forcast_data.location.name}/${forcast_data.location.country}</h4>
    <div class="sub-info-1">
        <h4>${forcast_data.current.condition.text}</h4>`;
  if (SIunits[0] == "c") {
    data_for_display += `
          <h4>Temperature : ${forcast_data.current.temp_c} C </h4>
          </div>
    <div class="sub-info-1">
        <h4>Clouds : ${forcast_data.current.cloud} %</h4>
        <h4>Feels Like : ${forcast_data.current.feelslike_c} C </h4>
    </div>
          `;
  } else {
    data_for_display += `
          <h4>Temperature : ${forcast_data.current.temp_f} F </h4>
          </div>
    <div class="sub-info-1">
        <h4>Clouds : ${forcast_data.current.cloud} %</h4>
        <h4>Feels Like : ${forcast_data.current.feelslike_f} F </h4>
    </div>
          `;
  }

  if (SIunits[1] == "m") {
    sub_data_for_display += `
    <div class="sub_content_data">
      <h4>Gust :${forcast_data.current.gust_kph} kph</h4>
      <h4>Humidity :${forcast_data.current.humidity}%</h4>
      <h4>Precipitation :${forcast_data.current.precip_mm} mm</h4>
    </div>
    <div class="sub_content_data">
      <h4>Wind Degree :${forcast_data.current.wind_degree}</h4>
      <h4>Wind Direction :${forcast_data.current.wind_dir}</h4>
      <h4>Wind Speed :${forcast_data.current.wind_kph} kph</h4>
    </div>
    <div class="sub_content_data">
      <h4>Pressure :${forcast_data.current.pressure_mb} mb</h4>
      <h4>Visibility :${forcast_data.current.vis_km} km</h4>
      <h4>UV Index :${forcast_data.current.uv}</h4>
    </div>
    
    `;
  } else {
    sub_data_for_display += `
    <div class="sub_content_data">
      <h4>Gust :${forcast_data.current.gust_mph} mph</h4>
      <h4>Humidity :${forcast_data.current.humidity}%</h4>
      <h4>Precipitation :${forcast_data.current.precip_in} in</h4>
    </div>
    <div class="sub_content_data">
      <h4>Wind Degree :${forcast_data.current.wind_degree}</h4>
      <h4>Wind Direction :${forcast_data.current.wind_dir}</h4>
      <h4>Wind Speed :${forcast_data.current.wind_mph} mph</h4>
    </div>
    <div class="sub_content_data">
      <h4>Pressure :${forcast_data.current.pressure_in} in</h4>
      <h4>Visibility :${forcast_data.current.vis_miles} mile(s)</h4>
      <h4>UV Index :${forcast_data.current.uv}</h4>
    </div>
    `;
  }
  let size = forcast_data.alerts.alert.length;
  if (size > 0) {
    for (let i = 0; i < size; i++) {
      alert_for_display += `
  
  <div class="alert_header">
        <h2>Warning !!</h2>
        <h3>Presence of weather alerts:</h3>
      </div>
<h3>Headline: ${forcast_data.alerts.alert[i].headline}</h3>
<h3>Description: ${forcast_data.alerts.alert[i].desc}</h3>
      <h3>Area: ${forcast_data.alerts.alert[i].areas}</h3>
<h3>Severity: ${forcast_data.alerts.alert[i].severity}</h3>

      <h3>Urgency: ${forcast_data.alerts.alert[i].urgency}</h3>
      <h3>Category: ${forcast_data.alerts.alert[i].category}</h3>

      <h3>Certainty: ${forcast_data.alerts.alert[i].certainty}</h3>

      

      <h3>Effective: ${forcast_data.alerts.alert[i].effective}</h3>

      <h3>Event Start: ${forcast_data.alerts.alert[i].effective}</h3>

      <h3>Event End: ${forcast_data.alerts.alert[i].expires}</h3>

      

      <h3>Instruction: ${forcast_data.alerts.alert[i].instruction}</h3>

      <h3>Msgtype: ${forcast_data.alerts.alert[i].msgtype}</h3>

      <h3>Note: ${forcast_data.alerts.alert[i].note}</h3>

      <hr>
  
  `;
    }
  }

  displayForcastData();
}

function displayForcastData() {
  let weather_icon = document.getElementById("weather_icon");
  let weather_content = document.getElementById("weather_content");
  let sub_content = document.getElementById("sub_content");
  let alert_output = document.getElementById("alerts_display");

  weather_icon.innerHTML = `<img class="condition-icon" src="${forcast_data.current.condition.icon}">`;
  weather_content.innerHTML = data_for_display;
  sub_content.innerHTML = sub_data_for_display;

  if (forcast_data.alerts.alert.length > 0) {
    alert_output.style.display = "block";
    alert_output.innerHTML = `
    <button class="alerts_btn" onclick="showAlerts()">
    Warning !  Their are ${forcast_data.alerts.alert.length} alert(s) for this location click to show
    </button>
    `;
  } else {
    alert_output.style.display = "none";
  }
}
