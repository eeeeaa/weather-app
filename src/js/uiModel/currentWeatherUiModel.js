export class CurrentWeatherUiModel {
  constructor({
    iconUrl,
    weatherText,
    tempCelcius,
    tempFahrenheit,
    cloudDensity,
    humidity,
    windSpeedKph,
    date,
    time,
    location,
  }) {
    this.iconUrl = iconUrl;
    this.weatherText = weatherText;
    this.tempCelcius = tempCelcius;
    this.tempFahrenheit = tempFahrenheit;
    this.cloudDensity = cloudDensity;
    this.humidity = humidity;
    this.windSpeedKph = windSpeedKph;
    this.date = date;
    this.time = time;
    this.location = location;
  }

  getCelciusText = () => `${this.tempCelcius} ℃`;

  getFahrenheitText = () => `${this.tempFahrenheit} ℉`;

  getCloudText = () => `${this.cloudDensity} %`;

  getHumidityText = () => `${this.humidity} %`;

  getWindSpeedText = () => `${this.windSpeedKph} KPH`;

  getDateText = () => {
    const newDate = new Date(this.date).toLocaleString("default", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return newDate;
  };
}
