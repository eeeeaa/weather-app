export class WeatherApiError extends Error {
  constructor({ code, message }) {
    super(message);
    this.name = "WeatherApiError";
    this.code = code;
  }
}
