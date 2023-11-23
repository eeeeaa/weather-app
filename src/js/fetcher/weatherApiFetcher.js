import { WeatherApiError } from "./model/errorModel";

const baseUrl = "https://api.weatherapi.com/v1";
const key = process.env.API_KEY;

export async function fetchForecast(cityName) {
  const searchNameQuery = `&q=${cityName}`;

  //got current + 3 days data
  let response = await fetch(
    `${baseUrl}/forecast.json?key=${key}${searchNameQuery}&days=3`
  );
  let json = await response.json();

  if (!response.ok) {
    throw new WeatherApiError({
      code: json.error.code,
      message: json.error.message,
    });
  }

  console.log(json);
  return json;
}
