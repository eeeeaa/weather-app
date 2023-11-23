import { CurrentWeatherUiModel } from "../uiModel/currentWeatherUiModel";
import { ForecastCardUiModel } from "../uiModel/forecastCardUiModel";

export function handleData(jsonData) {
  return {
    currentWeatherUiModel: handleCurrentWeatherData(jsonData),
    forecastUiModels: handleForecastData(jsonData),
  };
}

function handleCurrentWeatherData(jsonData) {
  return new CurrentWeatherUiModel({
    iconUrl: jsonData.current.condition.icon,
    weatherText: jsonData.current.condition.text,
    tempCelcius: jsonData.current.temp_c,
    tempFahrenheit: jsonData.current.temp_f,
    cloudDensity: jsonData.current.cloud,
    humidity: jsonData.current.humidity,
    windSpeedKph: jsonData.current.wind_kph,
    date: handleCurrentDate(jsonData.current.last_updated).mainDate,
    time: handleCurrentDate(jsonData.current.last_updated).time,
    location: jsonData.location.region,
  });
}

function handleForecastData(jsonData) {
  let forecastList = Array.from(jsonData.forecast.forecastday);
  let uiModels = [];

  for (const forecast of forecastList) {
    const tempHours = getTempHours(forecast.hour);
    uiModels.push(
      new ForecastCardUiModel({
        iconUrl: forecast.day.condition.icon,
        weatherText: forecast.day.condition.text,
        avgTempCelcius: forecast.day.avgtemp_c,
        avgTempFahrenheit: forecast.day.avgtemp_f,
        date: handleForecastDate(forecast.date).mainDate,
        weekday: handleForecastDate(forecast.date).weekday,
        tempHours: tempHours,
      })
    );
  }

  return uiModels;
}

function handleCurrentDate(date) {
  const mainDate = date.split(" ")[0];
  const time = date.split(" ")[1];
  return {
    mainDate,
    time,
  };
}

function handleForecastDate(date) {
  const newDate = new Date(date);
  const weekday = newDate.toLocaleString("default", {
    weekday: "long",
  });
  const mainDate = newDate.toLocaleString("default", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return {
    weekday,
    mainDate,
  };
}

function getTempHours(hours) {
  const result = [];
  for (const hour of hours) {
    const temp = hour.temp_c;
    const time = hour.time.split(" ")[1];
    result.push({
      temp,
      time,
    });
  }
  return result;
}
