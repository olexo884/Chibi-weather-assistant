export type WeatherSettingsPayload = {
  lat: string;
  lon: string;
  units: "metric" | "imperial";
};

export type WeatherSettingsResponse = {
  status: "success";
  settings: WeatherSettingsPayload;
};

export interface WeatherCurrentData {
    location: {
        name: string,
        country?: string
    };
    times: {
        timestamp: number,
        sunrise: number,
        sunset: number,
        timezone: number
    };
    current: {
        temperature: number,
        condition: string,
        icon: string,
        humidity: number,
        pressure: number,
        feelsLike: number,
        windSpeed: number,
        windDeg: number
    };
    units: 'metric' | 'imperial';
}

export interface MainCurrentData {
    location: {
        name: string,
        country?: string
    };
    timestamp: number,
    timezone: number,
    temperature: number,
    condition: string,
    icon: string,
    units: 'metric' | 'imperial';
}

export interface WidgetsCurrentData {
    humidity: number,
    pressure: number,
    feelsLike: number,
    windSpeed: number,
    windDeg: number,
    sunrise: number,
    sunset: number,
    timezone: number,
    
    units: 'metric' | 'imperial';
}

export interface APIWeatherCurrentData {
    status: 'success' | 'error';
    data: WeatherCurrentData
}


