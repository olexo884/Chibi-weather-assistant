export interface WeatherForecastData {
    temp: number;
    windSpeed: number;
    timestamp: number;
    timezone: number;
    icon: string;
    units: 'metric' | 'imperial';
}

export interface APIWeatherForecastData {
    status: 'success' | 'error';
    data: {
        hourly: WeatherForecastData[];
    }
}

export interface CustomWeatherDotProps {
  cx?: number;
  cy?: number;
  payload?: WeatherForecastData;
}

export interface ForecastProps {
  forecastItems: WeatherForecastData[];
}