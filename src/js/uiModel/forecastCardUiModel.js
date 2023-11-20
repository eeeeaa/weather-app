export class ForecastCardUiModel {
  constructor({ iconUrl, weatherText, avgTempCelcius, avgTempFahrenheit }) {
    this.iconUrl = iconUrl;
    this.weatherText = weatherText;
    this.avgTempCelcius = avgTempCelcius;
    this.avgTempFahrenheit = avgTempFahrenheit;
  }

  getCelciusText = () => `${this.avgTempCelcius} ℃`;

  getFahrenheitText = () => `${this.avgTempFahrenheit} ℉`;
}
