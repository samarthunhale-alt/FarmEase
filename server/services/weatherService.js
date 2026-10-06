import AppError from '../utils/AppError.js';

// Provider abstraction: add another provider here without touching controllers.
const cache = new Map();
const TTL_MS = 10 * 60 * 1000;

const openWeatherMap = async ({ city, lat, lon }) => {
  const params = new URLSearchParams({ units: 'metric', appid: process.env.WEATHER_API_KEY });
  if (city) params.set('q', city);
  else {
    params.set('lat', lat);
    params.set('lon', lon);
  }
  let res;
  try {
    res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new AppError('Weather provider did not respond. Try again shortly.', 502);
  }
  if (res.status === 404) throw new AppError('Location not found. Try a nearby city or district name.', 404);
  if (res.status === 401) throw new AppError('Weather provider rejected the server API key.', 502);
  if (!res.ok) throw new AppError('Weather provider returned an error.', 502);
  const d = await res.json();
  return {
    location: { name: d.name, country: d.sys?.country, lat: d.coord?.lat, lon: d.coord?.lon },
    temperature: d.main?.temp,
    feelsLike: d.main?.feels_like,
    humidity: d.main?.humidity,
    condition: d.weather?.[0]?.main,
    description: d.weather?.[0]?.description,
    icon: d.weather?.[0]?.icon,
    windSpeed: d.wind?.speed,
    observedAt: d.dt ? new Date(d.dt * 1000).toISOString() : new Date().toISOString(),
  };
};

const providers = { openweathermap: openWeatherMap };

export async function getCurrentWeather({ city, lat, lon }) {
  if (!process.env.WEATHER_API_KEY) {
    throw new AppError('Weather is not configured. Set WEATHER_API_KEY on the server.', 503);
  }
  if (!city && (lat === undefined || lon === undefined)) {
    throw new AppError('Provide a city, or both lat and lon.', 400);
  }
  const key = city ? `c:${city.toLowerCase()}` : `g:${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;
  const data = await providers[process.env.WEATHER_PROVIDER || 'openweathermap']({ city, lat, lon });
  cache.set(key, { at: Date.now(), data });
  return data;
}
