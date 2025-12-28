import React from 'react';

import styles from "../../styles/main-info__styles/MainInfo.module.css";

import type { WeatherCurrentData } from "../../types/weather.types"
import MainWeather from './main-weather/MainWeather';
import MainWeatherWidgets from './main-weatherWidgets/MainWeatherWidgets';

const MainInfo: React.FC<WeatherCurrentData> = (data: WeatherCurrentData) => {
    if (!data) {
        return null;
    }

    const { location, times, current, units } = data;

    return (
        <article className={styles.main}>
            <MainWeather
                location={location}
                timestamp={times.timestamp}
                timezone={times.timezone}
                temperature={current.temperature}
                icon={current.icon}
                condition={current.condition}
                units={units}
            />
            <MainWeatherWidgets
                humidity={current.humidity}
                pressure={current.pressure}
                feelsLike={current.feelsLike}
                windSpeed={current.windSpeed}
                windDeg={current.windDeg}
                sunrise={times.sunrise}
                sunset={times.sunset}
                timezone={times.timezone}
                units={units}
            />
        </article>
    )
}


export default MainInfo