import { useEffect, useState } from 'react';
import { EmptyState, ErrorState, Loading } from '../components/Feedback.jsx';
import useFetch from '../hooks/useFetch.js';
import { CropInfoAPI } from '../services/endpoints.js';

export default function CropInfo() {
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQ(search), 300);
    return () => clearTimeout(t);
  }, [search]);
  const { data, loading, error, reload } = useFetch(() => CropInfoAPI.list({ search: q }), [q]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">Crop information</h1>
      <p className="mt-2 max-w-prose text-soil-600">
        General guidance on season, soil, cultivation, irrigation and fertilizer. Details vary by region and variety, so check
        with your local agriculture department or Krishi Vigyan Kendra before acting.
      </p>
      <label htmlFor="ci-search" className="sr-only">Search crops</label>
      <input id="ci-search" className="input mt-5 max-w-sm" placeholder="Search a crop" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="mt-6 space-y-3">
        {loading && <Loading />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {data?.data.length === 0 && <EmptyState title="No crop found" text="Try another name." />}
        {data?.data.map((c) => (
          <details key={c._id} className="card group p-4">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 font-display text-xl font-bold">
              {c.name}
              <span className="font-sans text-base font-normal text-soil-600">{c.seasons.join(', ')}</span>
            </summary>
            <dl className="mt-4 space-y-3 text-soil-700">
              <div><dt className="font-semibold">Suitable season</dt><dd>{c.seasons.join(', ')}</dd></div>
              <div><dt className="font-semibold">Soil type</dt><dd>{c.soilTypes.join(', ')}</dd></div>
              <div><dt className="font-semibold">Cultivation</dt><dd>{c.cultivation}</dd></div>
              <div><dt className="font-semibold">Irrigation</dt><dd>{c.irrigation}</dd></div>
              <div><dt className="font-semibold">Fertilizer</dt><dd>{c.fertilizer}</dd></div>
            </dl>
          </details>
        ))}
      </div>
    </div>
  );
}
