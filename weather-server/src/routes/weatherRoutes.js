import express from 'express';
import weatherController from '../controllers/weatherController.js';

const router = express.Router(); 

router.get('/current', weatherController.getCurrentWeather);

router.get('/forecast', weatherController.getHourlyForecast);

router.post('/settings', weatherController.updateWeatherSettingsController);

export default router;