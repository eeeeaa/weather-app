class currentWeatherUiModel {
  constructor(
    iconUrl,
    weatherText,
    tempCelcius,
    tempFahrenheit,
    cloudDensity,
    humidity,
    windSpeedKph,
    date,
    location
  ) {
    this.iconUrl = iconUrl;
    this.weatherText = weatherText;
    this.tempCelcius = tempCelcius;
    this.tempFahrenheit = tempFahrenheit;
    this.cloudDensity = cloudDensity;
    this.humidity = humidity;
    this.windSpeedKph = windSpeedKph;
    this.date = date;
    this.location = location;
  }

  getCelciusText = () => `${this.tempCelcius} ℃`;

  getFahrenheitText = () => `${this.tempFahrenheit} ℉`;

  getCloudText = () => `${this.cloudDensity} %`;

  getHumidityText = () => `${this.humidity} %`;

  getWindSpeedText = () => `${this.windSpeedKph} KPH`;
}
