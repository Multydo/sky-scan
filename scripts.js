const api_key = "b62c832a0d2d4a7abd3110509240602";
var api_url = "https://api.weatherapi.com/v1";
var cach_key = "stored-data";
var cach_data = { cachperm: false, search_history: ["london"] };
var search_mod = "forcast";
var forcast_data = [];
var SIunits = ["c", "i"];
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

  for (let i = 0; i < cach_data.search_history.length; i++) {
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
  for (let i = 0; i < cach_data.search_history.length; i++) {
    if (cach_data.search_history[i] == location) {
      jobManager(location);
    }
  }
  let size = cach_data.search_history.length;
  cach_data.search_history[size] = location;
  jobManager(location);
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
    "&days=14&alerts=yes";
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
  }

  displayForcastData();
}

function displayForcastData() {
  let weather_icon = document.getElementById("weather_icon");
  let weather_content = document.getElementById("weather_content");
  let sub_content = document.getElementById("sub_content");

  weather_icon.innerHTML = `<img class="condition-icon" src="${forcast_data.current.condition.icon}">`;
  weather_content.innerHTML = data_for_display;
}
