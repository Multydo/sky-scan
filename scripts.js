const api_key = "b62c832a0d2d4a7abd3110509240602";
var api_url = "http://api.weatherapi.com/v1";
var cach_key = "stored-data";
var cach_data = { cachperm: false, search_history: ["london"] };

cachManager();
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
  cach_data = JSON.parse(localStorage.getItem(cach_key));
  console.log("in");

  for (let i = 0; i < cach_data.search_history.length; i++) {
    console.log(i);
    generated_output += `<button class="search_history" onclick="forcast('${cach_data.search_history[i]}')">${cach_data.search_history[i]}</button>`;
  }
  console.log("out");
  output.innerHTML = generated_output;
}
/* #############################################  MANAGING THE SEARCH  ########################################## */

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
      forcast(location);
    }
  }
  let size = cach_data.search_history.length;
  cach_data.search_history[size] = location;
  forcast(location);
}

/* #############################################  MANAGING THE FORCASTING DATA  ########################################## */

function forcast(location) {
  const protocol = "/forecast.json";

  let output = document.getElementById("display");
  let constructe_output = ``;

  let constructe_api =
    api_url + protocol + "?key=" + api_key + "&q=" + location + "&days=14";
  fetch(constructe_api)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      output.innerHTML = constructe_output;
    });
}
