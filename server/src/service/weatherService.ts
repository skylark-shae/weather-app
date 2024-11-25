import dotenv from "dotenv";
dotenv.config();

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: number;
  desc: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string,date: string, icon: number,desc: string, temp: number, humidity: number, wind: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.desc = desc;
    this.tempF = temp;
    this.windSpeed = wind;
    this.humidity = humidity;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;

  private apiKey?: string;

  private city_name: string;

  constructor(city_name: string = "") {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
    this.city_name = city_name;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      const response = await fetch(`${query}&appid=${this.apiKey}`);
      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }
      const data = await response.json();
      return {
        lat: data[0].lat,
        lon: data[0].lon,
      };
    } catch (error) {
      console.error("Error fetching location data:", error);
      throw error;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    const baseURL = "https://api.openweathermap.org/geo/1.0/direct?";
    const query = `q=${city}&limit=1`;
    return `${baseURL}${query}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const cords = 
    
    `lat=${coordinates.lat}&lon=${coordinates.lon}`;
    

    return `${this.baseURL}${cords}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    try {
      const query = this.buildGeocodeQuery(city);

      const locationData = await this.fetchLocationData(query);

      return this.destructureLocationData(locationData);
    } catch (error) {
      console.error(`Error in fetchAndDestructureLocationData:${error}`);
      throw error;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));

      if (!response.ok) {
        throw new Error('Failed to get weather data');
      }
      const data = await response.json();
      const parsedWeather = this.parseCurrentWeather(data.list);
    
      return parsedWeather
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const uniqueDays = new Set();
  const fiveDay = response.filter((data: any) => {
    const date = data.dt_txt.split(' ')[0];
    if (!uniqueDays.has(date)) {
      uniqueDays.add(date);
      return true;
    }
    return false;
  }).slice(0, 6);

    const weatherData: Weather[] = fiveDay.map((data: any) => {
      const weatherObject: Weather = {
        city: this.city_name,
        date: formatDate(data.dt_txt),
        icon: data.weather[0].icon,
        desc: data.weather[0].description,
        tempF: parseInt(data.main.temp),
        windSpeed: parseInt(data.wind.speed),
        humidity: data.main.humidity,
      }
      return weatherObject;
    })
    return weatherData;
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city_name = city;
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return weatherData;
  }
}
export default new WeatherService();
