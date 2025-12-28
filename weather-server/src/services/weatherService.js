import axios from 'axios';
import AppError from '../utils/appError.js';
import WeatherModel from '../models/weatherModel.js';

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;
const API_KEY = process.env.EXTERNAL_API_KEY;

// Бекові дефолти на всякий випадок
const FALLBACK_UNITS = 'metric';
const FALLBACK_LAT = '50';
const FALLBACK_LON = '30';

const SESSION_ID = "60c72b21c43f33013d52485a";

// 1. Дістаємо дефолтні налаштування з БД (або створюємо документ)
const getDefaultWeatherConfig = async () => {
  const configDoc = await WeatherModel.findOneAndUpdate(
    { key: 'weather_config' },
    { $setOnInsert: { key: 'weather_config' } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  ).exec();

  if (!configDoc) {
    throw new AppError('Database configuration not initialized.', 500);
  }

  const settings = configDoc.settings || {};

  return {
    lat: settings.lat ?? FALLBACK_LAT,
    lon: settings.lon ?? FALLBACK_LON,
    units: settings.units ?? FALLBACK_UNITS,
  };
};

// 2. Змішування: query > БД > .env fallback
export const resolveWeatherConfig = async (query = {}) => {
  const dbConfig = await getDefaultWeatherConfig();

  return {
    lat: query.lat ?? dbConfig.lat,
    lon: query.lon ?? dbConfig.lon,
    units: query.units ?? dbConfig.units,
  };
};

// 3. Виклик зовнішнього API з вже готовою конфігурацією
export const fetchApi = async (endpoint, { lat, lon, units }) => {
  if (!API_KEY) {
    throw new AppError('Server configuration error: API Key is missing.', 500);
  }

  if (!EXTERNAL_API_URL) {
    throw new AppError('Server configuration error: EXTERNAL_API_URL is missing.', 500);
  }

  const url = `${EXTERNAL_API_URL}/${endpoint}`;

  try {
    const response = await axios.get(url, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units,
      },
    });

    return response.data;
  } catch (err) {
    console.error('External API Error:', err.response?.data || err.message);
    throw new AppError('Failed to fetch weather data from external service.', 503);
  }
};

export function validateWeatherSettings({ lat, lon, units }) {
  if (lat === undefined || lon === undefined || units === undefined) {
    return { ok: false, message: "lat, lon and units are required" };
  }

  const latNum = Number(lat);
  const lonNum = Number(lon);

  if (!Number.isFinite(latNum) || latNum < -90 || latNum > 90) {
    return { ok: false, message: "Latitude must be a number between -90 and 90" };
  }

  if (!Number.isFinite(lonNum) || lonNum < -180 || lonNum > 180) {
    return { ok: false, message: "Longitude must be a number between -180 and 180" };
  }

  if (!["metric", "imperial"].includes(units)) {
    return { ok: false, message: "Units must be 'metric' or 'imperial'" };
  }

  return {
    ok: true,
    data: {
      lat: String(lat),
      lon: String(lon),
      units,
    },
  };
}

export async function updateWeatherSettings({ lat, lon, units }, sessionId = SESSION_ID) {
  const validation = validateWeatherSettings({ lat, lon, units });
  if (!validation.ok) {
    const err = new Error(validation.message);
    err.statusCode = 400;
    throw err;
  }

  const clean = validation.data;

  const updatedConfig = await WeatherModel.findOneAndUpdate(
    { sessionId, key: "weather_config" },
    {
      $set: {
        "settings.lat": clean.lat,
        "settings.lon": clean.lon,
        "settings.units": clean.units,
      },
    },
    { upsert: true, new: true }
  ).lean();

  return updatedConfig?.settings;
}