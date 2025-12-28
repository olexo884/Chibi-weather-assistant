import catchAsync from '../utils/catchAsync.js';
import {
  resolveWeatherConfig,
  fetchApi,
  updateWeatherSettings,
} from '../services/weatherService.js';

import { transformAndSaveWeather, transformCurrentData, transformHourlyForecast } from '../services/weatherTransformers.js'

export const getCurrentWeather = catchAsync(async (req, res, next) => {
  const config = await resolveWeatherConfig(req.query);

  const apiData = await fetchApi('2.5/weather', config);

  const transformedData = transformCurrentData(apiData, config.units);

  res.status(200).json({
    status: 'success',
    data: transformedData,
  });
});

export const getHourlyForecast = catchAsync(async (req, res, next) => {
  const config = await resolveWeatherConfig(req.query);

  const apiData = await fetchApi('3.0/onecall', config);

  const transformedData = transformHourlyForecast(apiData, config.units);

  res.status(200).json({
    status: 'success',
    data: transformedData,
  });
});

export const updateWeatherController = async (query = {}) => {
  const config = await resolveWeatherConfig(query);

  const [currentApiData, forecastApiData] = await Promise.all([
    fetchApi("2.5/weather", config),
    fetchApi("3.0/onecall", config),
  ]);

  const savedWeather = await transformAndSaveWeather({
    currentApiData,
    hourlyApiData: forecastApiData,
    settings: config,
  });

  return savedWeather;
}

export const updateWeatherSettingsController = catchAsync(async (req, res, next) => {
  try {
    const settings = await updateWeatherSettings(req.body);
    res.status(200).json({
      status: "success",
      settings,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: "fail",
      message: err.message || "Something went wrong",
    });
  }
});

export default { getCurrentWeather, getHourlyForecast, updateWeatherController, updateWeatherSettingsController };
