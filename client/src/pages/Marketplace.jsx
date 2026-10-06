import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import {
  EmptyState,
  ErrorState,
  Loading,
  Pagination,
} from '../components/Feedback.jsx';
import useFetch from '../hooks/useFetch.js';
import { CategoryAPI, ProductAPI } from '../services/endpoints.js';

export function Marketplace() {
  const [params] = useSearchParams();

  const [f, setF] = useState({
    search: params.get('search') || '',
    category: params.get('category') || '',
    location: '',
    minPrice: '',
    maxPrice: '',
    available: false,
    sort: 'newest',
  });

  const [page, setPage] = useState(1);
  const [debounced, setDebounced] = useState(f);

  const cats = useFetch(() => CategoryAPI.list(), []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(f);
      setPage(1);
    }, 350);

    return () => clearTimeout(t);
  }, [f]);

  const { data, loading, error, reload } = useFetch(
    () =>
      ProductAPI.list({
        ...debounced,
        available: debounced.available ? 'true' : '',
        page,
        limit: 12,
      }),
    [debounced, page]
  );

  const products = data?.data ?? [];
  const categories = cats.data?.data ?? [];

  const set = (key) => (e) => {
    setF({
      ...f,
      [key]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.value,
    });
  };

  const reset = () => {
    setF({
      search: '',
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      available: false,
      sort: 'newest',
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Marketplace</h1>

      <div className="mt-6 gap-6 lg:flex">
        <aside className="card mb-6 h-fit space-y-4 p-4 lg:mb-0 lg:w-64 lg:shrink-0">
          <div>
            <label className="label" htmlFor="f-search">
              Search
            </label>
            <input
              id="f-search"
              className="input"
              placeholder="Crop or product"
              value={f.search}
              onChange={set('search')}
            />
          </div>

          <div>
            <label className="label" htmlFor="f-cat">
              Category
            </label>
            <select
              id="f-cat"
              className="input"
              value={f.category}
              onChange={set('category')}
            >
              <option value="">All categories</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="f-loc">
              Location
            </label>
            <input
              id="f-loc"
              className="input"
              placeholder="Village, district or state"
              value={f.location}
              onChange={set('location')}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label" htmlFor="f-min">
                Min ₹
              </label>
              <input
                id="f-min"
                type="number"
                min="0"
                className="input"
                value={f.minPrice}
                onChange={set('minPrice')}
              />
            </div>

            <div>
              <label className="label" htmlFor="f-max">
                Max ₹
              </label>
              <input
                id="f-max"
                type="number"
                min="0"
                className="input"
                value={f.maxPrice}
                onChange={set('maxPrice')}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              className="h-5 w-5 accent-field-600"
              checked={f.available}
              onChange={set('available')}
            />
            In stock only
          </label>

          <div>
            <label className="label" htmlFor="f-sort">
              Sort by
            </label>
            <select
              id="f-sort"
              className="input"
              value={f.sort}
              onChange={set('sort')}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">
                Price: low to high
              </option>
              <option value="price_desc">
                Price: high to low
              </option>
            </select>
          </div>

          <button
            className="btn-outline w-full"
            onClick={reset}
          >
            Clear filters
          </button>
        </aside>

        <section className="flex-1">
          {loading && <Loading />}

          {error && (
            <ErrorState
              message={error}
              onRetry={reload}
            />
          )}

          {!loading && !error && products.length === 0 && (
            <EmptyState
              title="No products match"
              text="Try a different spelling, remove a filter, or widen the price range."
              action={
                <button
                  className="btn-primary"
                  onClick={reset}
                >
                  Clear filters
                </button>
              }
            />
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <p className="mb-3 text-soil-600">
                {data?.pagination?.total ?? products.length} products
              </p>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>

              {data?.pagination && (
                <Pagination
                  pagination={data.pagination}
                  onPage={setPage}
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}