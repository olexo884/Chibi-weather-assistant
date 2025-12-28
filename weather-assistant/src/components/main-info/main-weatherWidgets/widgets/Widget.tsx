import React from 'react';
import styles from "../../../../styles/main-info__styles/MainWeatherWidgets.module.css";

import type { DataWidgetProps } from "../../../../types/widget.types"

const Widget: React.FC<DataWidgetProps> = (
    {
        title,
        mainValue,
        iconSrc,
        signUnits }) => {
    return (
        <article className={styles.widget}>
            <img src={iconSrc} alt={`${title} icon`} />
            <div className={styles.widgetInfo}>
                <h3>{mainValue}</h3>
                <p>{signUnits}</p>
            </div>
            <p className={styles.widgetTitle}>{title}</p>
        </article>
    )
}


export default Widget