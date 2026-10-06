import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { EmptyState, ErrorState, Loading } from '../components/Feedback.jsx';
import useFetch from '../hooks/useFetch.js';
import { CategoryAPI, ProductAPI } from '../services/endpoints.js';

export default function Home() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const cats = useFetch(() => CategoryAPI.list(), []);
  const latest = useFetch(
    () => ProductAPI.list({ limit: 8, available: 'true' }),
    []
  );

  const categories = cats.data?.data || [];
  const products = latest.data?.data || [];

  return (
    <>
      {/* Hero */}
      <section className="bg-field-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
            Sell your harvest directly. Buy it fresh from the field.
          </h1>

          <p className="mt-4 max-w-xl text-lg text-field-100">
            Farmers set their own price. Buyers see who grew it and where.
          </p>

          <form
            className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(
                `/marketplace?search=${encodeURIComponent(q)}`
              );
            }}
          >
            <label htmlFor="hero-search" className="sr-only">
              Search crops and products
            </label>

            <input
              id="hero-search"
              className="input flex-1 border-0"
              placeholder="Search onion, wheat, mango…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <button className="btn-accent">Search</button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="btn bg-white text-field-800 hover:bg-field-50"
            >
              I am a farmer
            </Link>

            <Link
              to="/marketplace"
              className="btn border border-field-200 text-white hover:bg-field-700"
            >
              Browse the marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold">Shop by category</h2>

        {cats.loading && <Loading />}

        {cats.error && (
          <ErrorState
            message={cats.error}
            onRetry={cats.reload}
          />
        )}

        {!cats.loading && !cats.error && categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/marketplace?category=${c._id}`}
                className="rounded-full border border-field-200 bg-white px-4 py-2 font-semibold text-field-800 hover:bg-field-50"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Fresh Listings */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Fresh listings</h2>

          <Link
            to="/marketplace"
            className="font-semibold text-field-700 underline"
          >
            See all
          </Link>
        </div>

        {latest.loading && <Loading />}

        {latest.error && (
          <ErrorState
            message={latest.error}
            onRetry={latest.reload}
          />
        )}

        {!latest.loading &&
          !latest.error &&
          products.length === 0 && (
            <EmptyState
              title="No listings yet"
              text="Farmers are adding their produce. Check back soon."
            />
          )}

        {!latest.loading &&
          !latest.error &&
          products.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                />
              ))}
            </div>
          )}
      </section>
    </>
  );
}