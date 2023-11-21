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
const currentUiState = uiState.CONTENT;

export function fetchAndMapData(searchQuery) {
  fetchForecast(searchQuery)
    .then((json) => {
      const uiModel = handleData(json);

      currentWeatherUiModelMapper(uiModel.currentWeatherUiModel);
      forecastUiModelMapper(uiModel.forecastUiModels);
    })
    .catch((error) => {
      errorMapper(error);
    });
}

function errorMapper(error) {
  console.log(error);
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

  location.textContent = currentWeatherUiModel.location;
  iconImg.src = currentWeatherUiModel.iconUrl;
  text.textContent = currentWeatherUiModel.weatherText;
  tempCelcius.textContent = currentWeatherUiModel.getCelciusText();
  tempFahrenheit.textContent = currentWeatherUiModel.getFahrenheitText();
  cloud.textContent = currentWeatherUiModel.getCloudText();
  humidity.textContent = currentWeatherUiModel.getHumidityText();
  windSpeed.textContent = currentWeatherUiModel.getWindSpeedText();
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
    avgTempCelcius.textContent = model.getCelciusText();

    const avgTempFahrenheit = document.createElement("div");
    avgTempFahrenheit.classList.toggle("temp-fahrenheit");
    avgTempFahrenheit.textContent = model.getFahrenheitText();

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
