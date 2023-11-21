export class ForecastCardUiModel {
  constructor({
    iconUrl,
    weatherText,
    avgTempCelcius,
    avgTempFahrenheit,
    date,
    tempHours,
  }) {
    this.iconUrl = iconUrl;
    this.weatherText = weatherText;
    this.avgTempCelcius = avgTempCelcius;
    this.avgTempFahrenheit = avgTempFahrenheit;
    this.date = date;
    this.tempHours = tempHours;
  }

  getCelciusText = () => `${this.avgTempCelcius} ℃`;

  getFahrenheitText = () => `${this.avgTempFahrenheit} ℉`;
}
