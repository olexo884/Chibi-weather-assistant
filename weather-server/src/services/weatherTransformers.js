import WeatherModel from "../models/weatherModel.js";
const SESSION_ID = "60c72b21c43f33013d52485a";

// 4. Трансформація поточної погоди
export const transformCurrentData = (apiData, units) => {
  if (!apiData || !apiData.main) {
    return null;
  }

  const main = apiData.main;
  const weather = apiData.weather?.[0] || {};
  const wind = apiData.wind || {};

  return {
    location: {
      name: apiData.name,
      country: apiData.sys?.country,
    },
    times: {
      timestamp: apiData.dt,
      sunrise: apiData.sys?.sunrise,
      sunset: apiData.sys?.sunset,
      timezone: apiData.timezone
    },
    current: {
      temperature: Math.round(main.temp),
      condition: weather.description,
      icon: weather.icon,

      humidity: main.humidity,
      pressure: main.pressure,
      feelsLike: Math.round(main.feels_like * 10) / 10,
      windSpeed: Math.round(wind.speed * 10) / 10,
      windDeg: wind.deg,
    },
    units,
  };
};

// 5. Трансформація погодиних даних
export const transformHourlyForecast = (apiData, units) => {
  if (!apiData || !apiData.hourly) {
    return null;
  }

  const limitedData = apiData.hourly.slice(0, 12);

  const transformedHourly = limitedData.map((hour) => ({
    timestamp: hour.dt,
    temp: Math.round(hour.temp),
    windSpeed: Math.round(hour.wind_speed),
    icon: hour.weather?.[0]?.icon,
    timezone: apiData.timezone_offset,
    units,
  }));

  return {
    hourly: transformedHourly,
  };
};

export async function transformAndSaveWeather({
  currentApiData,      
  hourlyApiData,      
  settings,          
}) {
  const current = transformCurrentData(currentApiData, settings.units);
  const hourly = transformHourlyForecast(hourlyApiData, settings.units);

  if (!current || !hourly) {
    throw new Error("Weather transform returned null (bad API payload).");
  }

  const updatedDoc = await WeatherModel.findOneAndUpdate(
    { sessionId: SESSION_ID, key: "weather_config" },
    {
      $set: {
        sessionId: SESSION_ID,
        key: "weather_config",
        settings: {
          lat: String(settings.lat),
          lon: String(settings.lon),
          units: String(settings.units),
        },

        lastWeather: {
          current,
          hourly: hourly.hourly,
          fetchedAt: new Date(),
        },
      },
    },
    { upsert: true, new: true }
  );

  return updatedDoc;
}
