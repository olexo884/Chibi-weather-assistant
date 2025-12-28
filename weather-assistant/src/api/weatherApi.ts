import axios, { AxiosError } from 'axios';
import type { APIWeatherCurrentData, WeatherSettingsPayload, WeatherSettingsResponse } from '../types/weather.types';
import type { APIWeatherForecastData } from '../types/forecast.types';

const API_URL = "http://localhost:3001/api/v1/weather"

export const fetchGetCurrent = async (
  urlSuffix: string
): Promise<APIWeatherCurrentData> => {
  try {
    const response = await axios.get<APIWeatherCurrentData>(
      API_URL + urlSuffix
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError<{ message?: string }>;
    throw new Error(
      error.response?.data?.message ??
      error.message ??
      "Failed to fetch current weather"
    );
  }
};

export const fetchGetForecast = async (
  urlSuffix: string
): Promise<APIWeatherForecastData> => {
  try {
    const response = await axios.get<APIWeatherForecastData>(
      API_URL + urlSuffix
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError<{ message?: string }>;
    throw new Error(
      error.response?.data?.message ??
      error.message ??
      "Failed to fetch weather forecast"
    );
  }
};

export const fetchUpdateWeatherSettings = async (
  payload: WeatherSettingsPayload
): Promise<WeatherSettingsResponse> => {
  try {
    const response = await axios.post<WeatherSettingsResponse>(
      API_URL + "/settings",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (e) {
    const error = e as AxiosError<{ message?: string }>;

    throw new Error(
      error.response?.data?.message ??
      error.message ??
      "Failed to update weather settings"
    );
  }
};