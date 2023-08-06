const api_key = "f98d144a88b6162e91941c01d386a272";

const cityList = [];

class CityComponent {
  constructor(city_name) {
    this.city_name = city_name.toLowerCase().trim().replace(" ", "+");
    this.uri =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      this.city_name +
      "&appid=" +
      api_key +
      "&units=metric";
  }

  async init() {
    let city_info = await this.fetchData();
    if (city_info.cod == 404) alert("City Not Found/Spelled Wrong");

    return city_info.cod;
  }

  async fetchData() {
    let response = await fetch(this.uri);
    let data = await response.json(response);
    return data;
  }

  async update() {
    let city_info = await this.fetchData();
    let template = this.buildCard(city_info);
    let temp = city_info.main.temp;

    return { temp, template };
  }

  buildCard(city_info) {
    // let card = `
    //         <fieldset>
    //             <legend>${city_info.name}</legend>
    //             <h1>${city_info.main.temp}°C</h1>
    //             <h2>
    //                 Condition Name: ${city_info.weather[0].main}
    //                 <img src="./images/${city_info.weather[0].main}.png" width="60" height="60" />
    //             </h2>
    //             <h2>High: ${city_info.main.temp_max}°C</h2>
    //             <h2>Low: ${city_info.main.temp_min}°C</h2>
    //         </fieldset>`;

    let card = `
    
    <section id="card">
    <svg xmlns="http://www.w3.org/2000/svg" id="mySvg" width="343" height="175" viewBox="0 0 343 175" fill="none">
  <path d="M0.42749 66.4396C0.42749 31.6455 0.42749 14.2484 11.7535 5.24044C23.0794 -3.76754 40.0301 0.147978 73.9315 7.97901L308.33 62.1238C324.686 65.9018 332.864 67.7909 337.646 73.8031C342.427 79.8154 342.427 88.2086 342.427 104.995V131C342.427 151.742 342.427 162.113 335.984 168.556C329.54 175 319.169 175 298.427 175H44.4275C23.6857 175 13.3148 175 6.87114 168.556C0.42749 162.113 0.42749 151.742 0.42749 131V66.4396Z" fill="url(#paint0_linear_1439_26)"/>
  <defs>
    <linearGradient id="paint0_linear_1439_26" x1="0.42749" y1="128" x2="354.57" y2="128" gradientUnits="userSpaceOnUse">
      <stop stop-color="#5936B4"/>
      <stop offset="1" stop-color="#362A84"/>
    </linearGradient>
  </defs>
</svg>
    <div id="details">
      <div id="myDetails">
        <h1 id="deg">${city_info.main.temp}°C</h1>
        <div id="others">
          <h6 id="highLow">H:${city_info.main.temp_max}°C L:${city_info.main.temp_min}°C   </h6>
          <h4 id="city">${city_info.name}</h4>
        </div>
      </div>
      <div id="myimg">
        <img src="./Assets/${city_info.weather[0].main}.png" alt="" />
        <h4 id="type">${city_info.weather[0].main} </h4>
      </div>
    </div>
  </section>
    
    `;

    return card;
  }
}

// Selectors
const container = document.querySelector("#cards");
const locationInput = document.querySelector("#location");
const add = document.querySelector("#add");

const refreshApplication = async () => {
  const sortedCityList = [];
  for (let i = 0; i < cityList.length; i++)
    sortedCityList.push(await cityList[i].update());
  sortedCityList.sort((a, b) => a.temp - b.temp);
  container.innerHTML = "";
  sortedCityList.forEach((city) => (container.innerHTML += city.template));
};
setInterval(() => {
  refreshApplication();
}, 15000 * 60);

const addToCityList = async (city_name) => {
  city = new CityComponent(city_name);

  // Check if the city is already in List
  if (cityList.filter((c) => c.city_name == city.city_name).length > 0) {
    alert("City already in the list");
    return;
  }

  let response = await city.init();
  if (response != 404) cityList.push(city);
  refreshApplication();
};

function addLocation() {
  let newcity = locationInput.value;
  locationInput.value = "";
  addToCityList(newcity);
}

add.onclick = (e) => {
  e.preventDefault();
  addLocation();
};
