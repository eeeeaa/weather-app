export class ForecastCardUiModel {
  constructor({
    iconUrl,
    weatherText,
    avgTempCelcius,
    avgTempFahrenheit,
    weekday,
    date,
    tempHours,
  }) {
    this.iconUrl = iconUrl;
    this.weatherText = weatherText;
    this.avgTempCelcius = avgTempCelcius;
    this.avgTempFahrenheit = avgTempFahrenheit;
    this.weekday = weekday;
    this.date = date;
    this.tempHours = tempHours;
  }

  getCelciusText = () => `${this.avgTempCelcius} ℃`;

  getFahrenheitText = () => `${this.avgTempFahrenheit} ℉`;
}
