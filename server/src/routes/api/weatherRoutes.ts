import { Router, type Request, type Response } from 'express';
const router = Router();

import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  try {
    const city_name = req.body.cityName;
    if (!city_name) {
      return res.status(400).send('City name is required');
    }
    const weatherData = await weatherService.getWeatherForCity(city_name.replace(/"/g, ''));
    
    // TODO: save city to search history
    await historyService.addCity(city_name.replace(/"/g, ''));
    
    return res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).send(error);
    throw error;
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await historyService.getCities();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).send('Error retrieving search history')
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  
  try {
    if (!req.params.id) {
      res.status(400).json({msg: 'city id is required'})
    }
    await historyService.removeCity(req.params.id);
    res.json({success: 'city successfully removed from history'});
  } catch (err) {
    console.log(err);
      res.status(500).json(err);

  }
});

export default router;
