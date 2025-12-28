import React from 'react';

import CompassIcon from '../../../../assets/icon/widget-icon/compass_icon.svg';
import DirectionsIcon from '../../../../assets/icon/widget-icon/directions_icon.svg';

import type { WindSpeedProps } from "../../../../types/widget.types"

import styles from "../../../../styles/main-info__styles/MainWeatherWidgets.module.css";


const WindWidget: React.FC<WindSpeedProps> = (
    {
        mainValue,
        angle,
        units }) => {
    return (
        <article className={styles.windWidget}>
            <img style={{ transform: `rotate(${angle}deg)` }} className={styles.windWidgetCompass} src={CompassIcon} alt="wind direction icon" />
            <img className={styles.windWidgetDirection} src={DirectionsIcon} alt="directions icon" />
            <div className={styles.windWidgetData}>
                <h3>{mainValue}</h3>
                <p>{units === 'metric' ? "m/sec" : "mils/h"}</p>
            </div>
        </article>
    )
}

export default WindWidget