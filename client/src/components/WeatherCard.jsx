import { useEffect, useState } from 'react';
import { WeatherAPI } from '../services/endpoints.js';
import { errMsg } from '../services/api.js';

export default function WeatherCard({ defaultCity = '' }) {
  const [city, setCity] = useState(defaultCity);
  const [state, setState] = useState({ data: null, loading: false, error: '' });

  const load = async (c) => {
    if (!c.trim()) return;
    setState({ data: null, loading: true, error: '' });
    try {
      const res = await WeatherAPI.current({ city: c.trim() });
      setState({ data: res.data.data, loading: false, error: '' });
    } catch (e) {
      setState({ data: null, loading: false, error: errMsg(e) });
    }
  };

  useEffect(() => {
    if (defaultCity) {
      setCity(defaultCity);
      load(defaultCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCity]);

  const { data, loading, error } = state;
  return (
    <div className="card p-5">
      <h2 className="text-xl font-bold">Weather</h2>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); load(city); }}>
        <label className="sr-only" htmlFor="wx-city">City or district</label>
        <input id="wx-city" className="input" placeholder="City or district" value={city} onChange={(e) => setCity(e.target.value)} />
        <button className="btn-primary" disabled={loading}>Check</button>
      </form>
      {loading && <p className="mt-4 text-soil-600">Getting the latest weather…</p>}
      {error && <p className="mt-4 font-semibold text-red-700" role="alert">{error}</p>}
      {!data && !loading && !error && <p className="mt-4 text-soil-600">Enter your nearest city to see current conditions.</p>}
      {data && (
        <div className="mt-4 flex items-center gap-4">
          {data.icon && <img alt="" className="h-16 w-16" src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} />}
          <div>
            <p className="font-display text-3xl font-bold">{Math.round(data.temperature)}°C</p>
            <p className="capitalize text-soil-600">{data.description} in {data.location.name}</p>
            <p className="text-soil-600">Humidity {data.humidity}%{data.windSpeed != null && ` · Wind ${data.windSpeed} m/s`}</p>
          </div>
        </div>
      )}
    </div>
  );
}
