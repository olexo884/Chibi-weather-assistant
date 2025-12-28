import React, { useRef, useEffect } from 'react';

import type { CustomWeatherDotProps } from "../../types/forecast.types"
import { WeatherIconMap } from '../../types/weatherMap.types';

import styles from "../../styles/forecast__styles/Forecast.module.css";
import { formatTimeSeparator } from '../../utils/dateUtils';

const CustomWeatherDot: React.FC<CustomWeatherDotProps> = ({
  cx, cy, payload
}) => {
  if (cx === undefined || cy === undefined || !payload) {
    return null;
  }

  const { temp, icon, windSpeed, timestamp, units, timezone } = payload;

  return (
    <>
      <image x={cx - 12} y={cy + 12} href={WeatherIconMap[icon.slice(0, 2)]} height="24" width="24" />

      <text
        className={styles.forecastTemp}
        x={cx}
        y={cy - 12}
        fontSize={20}
        textAnchor="middle"
        fill="#fff">
        {temp > 0 ? "+" : ""}{temp}{units === 'metric' ? "°C" : "°F"}
      </text>

      <text
        x={cx}
        y={cy + 50}
        textAnchor="middle"
        fill="#fff"
        fontSize={12}
        className={styles.forecastbottomData}
      >
        <tspan >
          {windSpeed}{units === 'metric' ? "m/sec" : "mils/h"}
        </tspan>
        <tspan x={cx} dy="14">
          {formatTimeSeparator(timestamp, timezone)}
        </tspan>
      </text>
    </>
  );
};

export default CustomWeatherDot