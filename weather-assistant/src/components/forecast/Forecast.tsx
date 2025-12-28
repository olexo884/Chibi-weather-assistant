import React from 'react';
import {
    LineChart,
    Line,
    YAxis
} from 'recharts';

import { WeatherIconMap } from '../../types/weatherMap.types';
import { formatTimeSeparator } from '../../utils/dateUtils';

import styles from "../../styles/forecast__styles/Forecast.module.css";

import CustomWeatherDot from './CustomWeatherDot'
import type { ForecastProps } from '../../types/forecast.types';

const Forecast: React.FC<ForecastProps> = ({ forecastItems }) => {

    return (
        < article className={styles.forecast} >
            <h3 className={styles.forecastTitle}>FORECAST</h3>
            <hr />
            <div className={styles.graph}>
                <LineChart className={styles.chart}
                    style={{ width: '100%', height: '100%' }}
                    responsive
                    data={forecastItems}
                    margin={{
                        top: 30,
                        right: 30,
                        left: 30,
                        bottom: 60,
                    }}
                >
                    <YAxis hide={true} domain={['dataMin-2', 'dataMax+2']} />
                    <Line type="monotone" dataKey="temp" stroke="#ffffffff" strokeWidth={2} activeDot={{ r: 5 }} dot={<CustomWeatherDot />} isAnimationActive={false}/>
                </LineChart>
            </div>
            <div className={styles.forecastMobileItems}>
                {
                    forecastItems.map((item) => (
                        <div className={styles.forecastMobileItem} key={item.timestamp}>
                            <img src={WeatherIconMap[item.icon.slice(0, 2)]} alt="" />
                            <div className={styles.forecastMobileInfo}>
                                <h2>{item.temp > 0 ? "+" : ""}{item.temp}{item.units === 'metric' ? "°C" : "°F"}</h2>
                                <div>|</div>
                                <h3>{item.windSpeed}{item.units === 'metric' ? "m/sec" : "mils/h"}</h3>
                            </div>
                            <h3 className={styles.forecastMobileTime}>{formatTimeSeparator(item.timestamp, item.timezone)}</h3>
                        </div>
                    ))
                }
            </div>

        </article>
    )
}


export default Forecast