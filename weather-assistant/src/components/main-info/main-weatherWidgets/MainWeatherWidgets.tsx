import React from 'react';

import HumidityIcon from '../../../assets/icon/widget-icon/precipitation_icon.svg';
import SunriseIcon from '../../../assets/icon/widget-icon/sunrise.svg';
import SunsetIcon from '../../../assets/icon/widget-icon/sunset.svg';
import PressuretIcon from '../../../assets/icon/widget-icon/pressure_icon.svg';
import TemperatureIcon from '../../../assets/icon/widget-icon/temperature.svg';

import styles from "../../../styles/main-info__styles/MainWeatherWidgets.module.css";
import Widget from './widgets/Widget';
import WindWidget from './widgets/WindWidget';
import type { WidgetsCurrentData } from '../../../types/weather.types';
import { formatTimeSeparator } from '../../../utils/dateUtils';

const MainWeatherWidgets: React.FC<WidgetsCurrentData> = ({
    humidity,
    pressure,
    feelsLike,
    windSpeed,
    windDeg,
    sunrise,
    sunset,
    timezone,
    units
}) => {
    return (
        <article className={styles.main}>
            <div className={styles.header}>
                <Widget
                    title="FEELS LIKE"
                    mainValue={`${feelsLike > 0 ? "+" : ""}${feelsLike}`}
                    iconSrc={TemperatureIcon}
                    signUnits={units === 'metric' ? "°C" : "°F"}
                />
                <WindWidget
                    mainValue={windSpeed}
                    angle={windDeg}
                    units={units}
                />
            </div>
            <div className={styles.bottom}>
                <Widget
                    title="HUMIDITY"
                    mainValue={humidity.toString()}
                    iconSrc={HumidityIcon}
                    signUnits={"%"}
                />
                <Widget
                    title="SUNSET"
                    mainValue={formatTimeSeparator(sunset, timezone)}
                    iconSrc={SunsetIcon}
                    signUnits={"PM"}
                />
                <Widget
                    title="PRESSURE"
                    mainValue={pressure.toString()}
                    iconSrc={PressuretIcon}
                    signUnits={"HPA"}
                />
                <Widget
                    title="SUNRISE"
                    mainValue={formatTimeSeparator(sunrise, timezone)}
                    iconSrc={SunriseIcon}
                    signUnits={"AM"}
                />
            </div>
        </article>
    )
}


export default MainWeatherWidgets