import { fetchForecast } from "../fetcher/weatherApiFetcher";
import { CurrentWeatherUiModel } from "../uiModel/currentWeatherUiModel";
import { ForecastCardUiModel } from "../uiModel/forecastCardUiModel";
import { handleData } from "../handler/weatherDataHandler";
import Chart from "chart.js/auto";

const uiState = {
  LOADING: "LOADING",
  CONTENT: "CONTENT",
  ERROR: "ERROR",
};

let prevQuery = "";

export function initialize(query) {
  setupSearchListener();
  fetchAndMapData(query);
}

function updateUiState(newState, errorText = null) {
  const currentUiState = newState;

  const contentGridContainer = document.querySelector(".content");
  const loadingFlexContainer = document.querySelector(
    ".loading-page-container"
  );
  const errorFlexContainer = document.querySelector(".error-page-container");
  switch (currentUiState) {
    case uiState.CONTENT: {
      contentGridContainer.style.display = "grid";
      loadingFlexContainer.style.display = "none";
      errorFlexContainer.style.display = "none";
      break;
    }
    case uiState.LOADING: {
      contentGridContainer.style.display = "none";
      loadingFlexContainer.style.display = "flex";
      errorFlexContainer.style.display = "none";
      break;
    }
    case uiState.ERROR: {
      contentGridContainer.style.display = "none";
      loadingFlexContainer.style.display = "none";
      errorFlexContainer.style.display = "flex";
      if (errorText != null) {
        const errorTextElement = document.querySelector(".error-text");
        errorTextElement.textContent = errorText;
      }
      break;
    }
  }
}

function fetchAndMapData(searchQuery) {
  if (prevQuery === searchQuery) {
    return;
  }
  updateUiState(uiState.LOADING);

  fetchForecast(searchQuery)
    .then((json) => {
      const uiModel = handleData(json);

      currentWeatherUiModelMapper(uiModel.currentWeatherUiModel);
      forecastUiModelMapper(uiModel.forecastUiModels);
      updateUiState(uiState.CONTENT);
      prevQuery = searchQuery;
    })
    .catch((error) => {
      errorMapper(error);
    });
}

function errorMapper(error) {
  console.log(error);
  updateUiState(uiState.ERROR, error);
}

function setupSearchListener() {
  const searchBar = document.getElementById("city-name-search");
  const searchIcon = document.querySelector(".search-icon");
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
  searchIcon.addEventListener("click", (e) => {
    handleSearch();
  });
}

function handleSearch() {
  const searchBar = document.getElementById("city-name-search");
  if (searchBar.value != undefined && searchBar.value.length > 0) {
    fetchAndMapData(searchBar.value);
  }
}

/**
 *
 * @param {CurrentWeatherUiModel} currentWeatherUiModel
 */
function currentWeatherUiModelMapper(currentWeatherUiModel) {
  const location = document.querySelector(".search-location");

  const iconImg = document.querySelector(".current-day-content .weather-icon");
  const text = document.querySelector(".current-day-content .weather-text");
  const tempCelcius = document.querySelector(
    ".current-day-content .temp-celcius"
  );
  const tempFahrenheit = document.querySelector(
    ".current-day-content .temp-fahrenheit"
  );
  const cloud = document.querySelector(".current-day-content .cloud-density");
  const humidity = document.querySelector(".current-day-content .humidity");
  const windSpeed = document.querySelector(".current-day-content .wind-speed");
  const date = document.querySelector(".current-day-content .date");

  location.textContent = `Current location: ${currentWeatherUiModel.location}`;
  iconImg.src = currentWeatherUiModel.iconUrl;
  text.textContent = currentWeatherUiModel.weatherText;
  tempCelcius.textContent = `Temperature(C): ${currentWeatherUiModel.getCelciusText()}`;
  tempFahrenheit.textContent = `Temperature(F): ${currentWeatherUiModel.getFahrenheitText()}`;
  cloud.textContent = `Cloud density(percent): ${currentWeatherUiModel.getCloudText()}`;
  humidity.textContent = `Humidity(percent): ${currentWeatherUiModel.getHumidityText()}`;
  windSpeed.textContent = `Wind Speed (Kilometer/Hour): ${currentWeatherUiModel.getWindSpeedText()}`;
  date.textContent = currentWeatherUiModel.date;
}

/**
 *
 * @param {Array<ForecastCardUiModel>} uiModels
 */
function forecastUiModelMapper(uiModels) {
  const content = document.querySelector(".forecast-content");
  content.innerHTML = "";

  for (const model of uiModels) {
    const card = document.createElement("div");
    card.classList.toggle("forecast-card");

    //left side
    const leftSide = document.createElement("div");
    leftSide.classList.toggle("left-content");

    const icon = document.createElement("img");
    icon.classList.toggle("weather-icon");
    icon.src = model.iconUrl;

    const text = document.createElement("div");
    text.classList.toggle("weather-text");
    text.textContent = model.weatherText;

    leftSide.append(icon, text);

    //right side
    const rightSide = document.createElement("div");
    rightSide.classList.toggle("right-content");

    const avgTempCelcius = document.createElement("div");
    avgTempCelcius.classList.toggle("temp-celcius");
    avgTempCelcius.textContent = `Temperature(C): ${model.getCelciusText()}`;

    const avgTempFahrenheit = document.createElement("div");
    avgTempFahrenheit.classList.toggle("temp-fahrenheit");
    avgTempFahrenheit.textContent = `Temperature(F): ${model.getFahrenheitText()}`;

    const date = document.createElement("div");
    date.classList.toggle("date");
    date.textContent = model.date;

    const graph = createLineGraph(model.tempHours);

    rightSide.append(avgTempCelcius, avgTempFahrenheit, date, graph);

    card.append(leftSide, rightSide);
    content.append(card);
  }
}

/**
 *
 * @param {Array} hours
 */
function createLineGraph(hours) {
  const wrapper = document.createElement("div");
  wrapper.classList.toggle("graph-container");
  const graph = document.createElement("canvas");
  graph.classList.toggle("temp-graph");

  const tempList = hours.map((obj) => {
    return obj.temp;
  });
  const timeList = hours.map((obj) => {
    return obj.time;
  });

  const labels = timeList;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Temperature in Celcius",
        data: tempList,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  };

  new Chart(graph, config);
  wrapper.append(graph);
  return wrapper;
}
