import React, { useState } from 'react';

import TargetIcon from '../../assets/icon/form-icon/target.svg';
import styles from "../../styles/form__styles/Form.module.css";
import { fetchUpdateWeatherSettings } from '../../api/weatherApi';
import type { WeatherSettingsPayload } from '../../types/weather.types';


const Form: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [errMessage, setErrMessage] = useState("");

  const [formData, setFormData] = useState<WeatherSettingsPayload>({
    lat: "",
    lon: "",
    units: "metric",
  });

  const toggleForm = () => setIsOpen(prev => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

  const toClampedString = (
    value: string,
    min: number,
    max: number
  ): string | null => {
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    return String(clamp(num, min, max));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const lat = toClampedString(formData.lat, -90, 90);
    const lon = toClampedString(formData.lon, -180, 180);

    if (lat === null || lon === null) {
      setErrMessage("Latitude and Longitude must be valid numbers");
      return;
    }

    const payload = {
      lat,
      lon,
      units: formData.units,
    };

    try {
      await fetchUpdateWeatherSettings(payload);
      setFormData(payload);
      window.location.reload();
    } catch (err) {
      setErrMessage((err as Error).message);
    }
  };


  return (
    <article className={styles.main}>
      <div className={styles.menuBtn} onClick={toggleForm}>
        <img src={TargetIcon} alt="menu icon" />
      </div>

      {isOpen && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formItem}>
            <h3>Longitude</h3>
            <input
              type="number"
              name="lon"
              step="0.01"
              min="-180"
              max="180"
              maxLength={5}
              value={formData.lon}
              onChange={handleChange}
              placeholder="28.48"
              required
            />
          </div>

          <div className={styles.formItem}>
            <h3>Latitude</h3>
            <input
              type="number"
              name="lat"
              step="0.01"
              min="-90"
              max="90"
              value={formData.lat}
              onChange={handleChange}
              placeholder="49.23"
              required
            />
          </div>

          <div className={styles.formItem}>
            <h3>Units</h3>
            <select
              name="units"
              value={formData.units}
              onChange={handleChange}
            >
              <option value="metric">Metric (°C, m/s)</option>
              <option value="imperial">Imperial (°F, mph)</option>
            </select>
          </div>

          <button className={styles.btn} type="submit">
            CHANGE
          </button>
        </form>
      )}
      {errMessage && <h3 className={styles.err}>{errMessage}</h3>}
    </article>
  );
}


export default Form