import React from 'react';

import LocationIcon from '../../../assets/icon/mainInfo-icon/location.svg';

import styles from "../../../styles/main-info__styles/MainWeather.module.css";
import { WeatherDayMap, WeatherIconMap, WeatherMonthMap } from '../../../types/weatherMap.types';
import type { MainCurrentData } from '../../../types/weather.types';

import LiveApiTime from '../../time/LiveApiTime';

const MainWeather: React.FC<MainCurrentData> = ({
    location,
    timestamp,
    timezone,
    temperature,
    icon,
    condition,
    units
}) => {
    const currentDateTime = new Date((timestamp + timezone) * 1000);
    
    return (
        <article className={styles.main}>
            <img className={styles.weatherIcon} src={icon && WeatherIconMap[icon.slice(0, 2)]} alt={condition} />
            <div>
                <div className={styles.header}>
                    <h1>{temperature > 0 ? "+" + temperature : temperature}{units === 'metric' ? "°C" : "°F"}</h1>
                    <h3>{condition.toUpperCase()}</h3>
                </div>
                <hr />
                <div className={styles.bottomInfo}>
                    <div className={styles.location}>
                        <img src={LocationIcon} alt="loaction icon" />
                        <p>{location.name} <br /> {location.country}</p>
                    </div>
                    <div className={styles.date}>
                        {timestamp && timezone && (
                            <div>
                                <p>
                                    {WeatherDayMap[currentDateTime.getDay()]} | {currentDateTime.getDate()} {WeatherMonthMap[currentDateTime.getMonth()]} {currentDateTime.getFullYear()}
                                </p>
                                <h3><LiveApiTime dt={timestamp} timezone={timezone} /></h3>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        </article>
    )
}


export default MainWeather