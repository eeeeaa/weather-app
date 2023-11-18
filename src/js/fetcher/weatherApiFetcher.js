const baseUrl = "https://api.weatherapi.com/v1";
const key = process.env.API_KEY;

export async function fetchForecast(cityName) {
  try {
    const searchNameQuery = `&q=${cityName}`;

    //got current + 3 days data
    let response = await fetch(
      `${baseUrl}/forecast.json?key=${key}${searchNameQuery}&days=3`
    );
    let json = await response.json();

    console.log(json);
  } catch (error) {
    console.log(error);
  }
}
