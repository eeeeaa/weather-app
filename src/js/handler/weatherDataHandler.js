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
    date: jsonData.current.last_updated,
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
        date: forecast.date,
        tempHours: tempHours,
      })
    );
  }

  return uiModels;
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
