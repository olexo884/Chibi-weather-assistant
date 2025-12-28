import mongoose from 'mongoose';
import { weatherDBConnection } from '../database/db.config.js';

const weatherSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
      default: '60c72b21c43f33013d52485a',
    },

    key: {
      type: String,
      required: true,
      default: 'weather_config',
    },

    settings: {
      lat: { type: String, default: '49' },
      lon: { type: String, default: '28.5' },
      units: { type: String, default: 'metric' },
    },

    lastWeather: {
      current: {
        location: {
          name: String,
          country: String,
        },
        times: {
          timestamp: Number,
          sunrise: Number,
          sunset: Number,
          timezone: Number,
        },
        current: {
          temperature: Number,
          condition: String,
          icon: String,
          humidity: Number,
          pressure: Number,
          feelsLike: Number,
          windSpeed: Number,
          windDeg: Number,
        },
        units: String,
      },

      hourly: [
        {
          timestamp: Number,
          temp: Number,
          windSpeed: Number,
          icon: String,
          timezone: Number,
          units: String,
        },
      ],

      fetchedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { versionKey: false }
);

weatherSchema.index({ sessionId: 1, key: 1 }, { unique: true });

const WeatherModel = weatherDBConnection.model('WeatherConfig', weatherSchema);

export default WeatherModel;
