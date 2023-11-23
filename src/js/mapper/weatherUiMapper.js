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
  console.log(`${error.code}, ${error.message}`);

  switch (error.code) {
    case 1006: {
      prevQuery = "";
      break;
    }
  }

  updateUiState(uiState.ERROR, error.message);
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
  location.textContent = `Current location: ${currentWeatherUiModel.location}`;

  const iconImg = document.querySelector(".current-day-content .weather-icon");
  iconImg.src = currentWeatherUiModel.iconUrl;

  const text = document.querySelector(".current-day-content .weather-text");
  text.textContent = currentWeatherUiModel.weatherText;

  currentWeatherUiModelRightContentMapper(currentWeatherUiModel);
}

function currentWeatherUiModelRightContentMapper(currentWeatherUiModel) {
  const rightContainer = document.querySelector(
    ".current-day-content .right-content"
  );

  const tempCelCard = createDataCard(
    currentWeatherUiModel.getCelciusText(),
    "Temperature(C)",
    "temp-celcius"
  );
  const tempFahCard = createDataCard(
    currentWeatherUiModel.getFahrenheitText(),
    "Temperature(F)",
    "temp-fahrenheit"
  );
  const cloudCard = createDataCard(
    currentWeatherUiModel.getCloudText(),
    "Cloud density",
    "cloud-density"
  );
  const humidCard = createDataCard(
    currentWeatherUiModel.getHumidityText(),
    "Humidity",
    "humidity"
  );
  const windSpeedCard = createDataCard(
    currentWeatherUiModel.getWindSpeedText(),
    "Wind Speed (Kilometer/Hour)",
    "wind-speed"
  );

  const dateCard = createDataCard(
    currentWeatherUiModel.time,
    currentWeatherUiModel.getDateText(),
    "current-time"
  );

  rightContainer.append(
    tempCelCard,
    tempFahCard,
    cloudCard,
    humidCard,
    windSpeedCard,
    dateCard
  );
}

function createDataCard(dataValue, dataLabel, dataClass) {
  const container = document.createElement("div");
  container.classList.toggle("data-card");
  container.classList.toggle(dataClass);

  const value = document.createElement("div");
  value.classList.toggle("data-card-value");
  value.textContent = dataValue;

  const label = document.createElement("div");
  label.classList.toggle("data-card-label");
  label.textContent = dataLabel;

  container.append(value, label);
  return container;
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

    const rightSideTop = document.createElement("div");
    rightSideTop.classList.toggle("right-side-top-content");

    const tempCelCard = createDataCard(
      model.getCelciusText(),
      "Avg temperature(C)",
      "temp-celcius"
    );

    const tempFahCard = createDataCard(
      model.getCelciusText(),
      "Avg temperature(F)",
      "temp-fahrenheit"
    );

    const dateCard = createDataCard(model.weekday, model.date, "date");

    const graph = createLineGraph(model.tempHours);

    rightSideTop.append(tempCelCard, tempFahCard, dateCard);

    rightSide.append(rightSideTop, graph);

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
        label: "Temperature in Celcius by hour",
        data: tempList,
        fill: true,
        backgroundColor: "rgba(52,211,153,1)",
        borderColor: "rgba(52,211,153,1)",
        borderWidth: 1,
        tension: 0.1,
        pointStyle: "cross",
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
        colors: {
          forceOverride: true,
        },
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "white",
          },
        },
        x: {
          ticks: {
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
