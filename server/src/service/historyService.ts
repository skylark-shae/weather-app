import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  city_name: string;
  city_id: string;

  constructor(city_name:string, city_id:string) {
    this.city_name = city_name;
    this.city_id = city_id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json',{
      flag: 'a+',
      encoding: 'utf8',
    })
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    try {
      const cities = await this.read();
      let parsedCities: City[];

      try {
        parsedCities = JSON.parse(cities);
        if (!Array.isArray(parsedCities)) {
          throw new Error('Parsed data is not an array');
        }
      } catch (err) {
        console.error('Error parsing JSON:', err);
        parsedCities = [];
      }
      return parsedCities;
    } catch (err) {
      console.error('Error reading file:', err);
      return [];
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('Please enter a valid city');
    }

    const cities = await this.getCities();
    const cityExists = cities.some(c => c.city_name.toLowerCase() === city.toLowerCase());

    if (cityExists) {
      return
    }

    const newCity: City = {
      city_name: city,
      city_id: uuidv4(),
    };

    return await this.write([...cities, newCity])
      .then(() => newCity);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return await this.getCities()
    .then((cities) => cities.filter(city => city.city_id != id))
    .then((updatedCities) => this.write(updatedCities))
    .then(() => `City with ID ${id} has been removed`)
  }
}

export default new HistoryService();
