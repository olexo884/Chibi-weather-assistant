import React, { useEffect, useState } from 'react';

type LiveApiTimeProps = {
  dt: number;       
  timezone: number; 
};

const WEATHER_TIME_KEY = 'weather_time';

type StoredWeatherTime = {
  dt: number;
  timezone: number;
  fetchedAt: number;
};

const loadWeatherTimeFromStorage = (): StoredWeatherTime | null => {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(WEATHER_TIME_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredWeatherTime;

    if (
      typeof parsed.dt !== 'number' ||
      typeof parsed.timezone !== 'number' ||
      typeof parsed.fetchedAt !== 'number'
    ) {
      return null;
    }

    const ageMs = Date.now() - parsed.fetchedAt;
    const maxAgeMs = 30 * 60 * 1000; 

    if (ageMs > maxAgeMs) return null;

    return parsed;
  } catch {
    return null;
  }
};

const saveWeatherTimeToStorage = (dt: number, timezone: number) => {
  if (typeof window === 'undefined') return;

  const payload: StoredWeatherTime = {
    dt,
    timezone,
    fetchedAt: Date.now(),
  };

  localStorage.setItem(WEATHER_TIME_KEY, JSON.stringify(payload));
};

export const LiveApiTime: React.FC<LiveApiTimeProps> = ({ dt, timezone }) => {
  const [time, setTime] = useState<Date | null>(null);
  
  useEffect(() => {
    const now = Date.now();
    const stored = loadWeatherTimeFromStorage();

    let startDate: Date;

    if (
      stored &&
      stored.dt === dt &&          
      stored.timezone === timezone 
    ) {
      const baseMs =
        (stored.dt + stored.timezone) * 1000 + (now - stored.fetchedAt);
      startDate = new Date(baseMs);
    } else {
      const baseMs = (dt + timezone) * 1000;
      startDate = new Date(baseMs);
      saveWeatherTimeToStorage(dt, timezone);
    }

    setTime(startDate);

    const id = setInterval(() => {
      setTime(prev => (prev ? new Date(prev.getTime() + 1000) : new Date()));
    }, 1000);

    return () => clearInterval(id);
  }, [dt, timezone]);

  if (!time) return null;

  return (
    <>
      {time.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      })}
    </>
  );
};

export default LiveApiTime;
