import React from 'react';
import styles from "../../styles/loader__styles/Loader.module.css";

const Loader: React.FC = () => {
    return (
        <article className={styles.main}>
            <div className={styles.loader}></div>
        </article>
    )
}


export default Loader