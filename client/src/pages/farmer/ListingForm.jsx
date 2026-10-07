import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorState, Loading, PageHeader } from '../../components/Feedback.jsx';
import ImageUploader from '../../components/ImageUploader.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useFetch from '../../hooks/useFetch.js';
import { errMsg } from '../../services/api.js';
import {
  CategoryAPI,
  CropAPI,
  FarmerAPI,
  ProductAPI,
} from '../../services/endpoints.js';
import { toInputDate, UNITS } from '../../utils/format.js';

const empty = {
  name: '',
  category: '',
  quantity: '',
  unit: 'kg',
  price: '',
  location: '',
  harvestDate: '',
  description: '',
  images: [],
  available: true,
};

export default function ListingForm({ kind }) {
  const isCrop = kind === 'crop';
  const API = isCrop ? CropAPI : ProductAPI;

  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const cats = useFetch(() => CategoryAPI.list(), []);

  const existing = useFetch(
    () => (id ? API.getMine(id) : Promise.resolve({ data: null })),
    [id, kind]
  );

  useEffect(() => {
    const d = existing.data?.data;

    if (d) {
      setForm({
        name: d.name || '',
        category: d.category || '',
        quantity: d.quantity ?? '',
        unit: d.unit || 'kg',
        price: isCrop ? (d.expectedPrice ?? '') : (d.price ?? ''),
        location: d.location || '',
        harvestDate: toInputDate(d.harvestDate),
        description: d.description || '',
        images: d.images || [],
        available: d.available ?? true,
      });
    } else if (!id) {
      FarmerAPI.profile()
        .then((r) => {
          const p = r.data.data;

          const loc = [p.village, p.district, p.state]
            .filter(Boolean)
            .join(', ');

          if (loc) {
            setForm((f) => ({
              ...f,
              location: f.location || loc,
            }));
          }
        })
        .catch(() => {});
    }
  }, [existing.data, id, isCrop]);

  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError('');

    const body = {
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit,
      location: form.location,
      description: form.description,
      images: form.images,
      available: form.available,

      ...(isCrop
        ? {
            expectedPrice: Number(form.price),
            harvestDate: form.harvestDate,
          }
        : {
            price: Number(form.price),
          }),
    };

    try {
      if (id) {
        await API.update(id, body);
      } else {
        await API.create(body);
      }

      toast.success(
        `${isCrop ? 'Crop' : 'Product'} ${id ? 'updated' : 'added'}`
      );

      navigate(
        isCrop ? '/farmer/crops' : '/farmer/products'
      );
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  if (id && existing.loading) {
    return <Loading />;
  }

  if (id && existing.error) {
    return <ErrorState message={existing.error} />;
  }

  const noun = isCrop ? 'crop' : 'product';

  const categories = cats.data?.data ?? [];

  return (
    <>
      <PageHeader title={`${id ? 'Edit' : 'Add'} ${noun}`} />

      <form
        onSubmit={submit}
        className="card max-w-2xl space-y-4 p-6"
      >
        {error && (
          <p
            className="rounded-lg bg-red-50 p-3 font-semibold text-red-800"
            role="alert"
          >
            {error}
          </p>
        )}

        <div>
          <label className="label" htmlFor="name">
            {isCrop ? 'Crop name' : 'Product name'}
          </label>

          <input
            id="name"
            required
            minLength={2}
            className="input"
            value={form.name}
            onChange={set('name')}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="category">
              Category
            </label>

            <select
              id="category"
              required
              className="input"
              value={form.category}
              onChange={set('category')}
            >
              <option value="">Choose a category</option>

              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="location">
              Location
            </label>

            <input
              id="location"
              required
              className="input"
              placeholder="Village, district"
              value={form.location}
              onChange={set('location')}
            />
          </div>

          <div>
            <label className="label" htmlFor="quantity">
              Quantity
            </label>

            <input
              id="quantity"
              type="number"
              required
              min="0"
              step="any"
              className="input"
              value={form.quantity}
              onChange={set('quantity')}
            />
          </div>

          <div>
            <label className="label" htmlFor="unit">
              Unit
            </label>

            <select
              id="unit"
              className="input"
              value={form.unit}
              onChange={set('unit')}
            >
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="price">
              {isCrop
                ? 'Expected price (₹ per unit)'
                : 'Price (₹ per unit)'}
            </label>

            <input
              id="price"
              type="number"
              required
              min="0"
              step="any"
              className="input"
              value={form.price}
              onChange={set('price')}
            />
          </div>

          {isCrop && (
            <div>
              <label className="label" htmlFor="harvest">
                Harvest date
              </label>

              <input
                id="harvest"
                type="date"
                required
                className="input"
                value={form.harvestDate}
                onChange={set('harvestDate')}
              />
            </div>
          )}
        </div>

        <div>
          <label className="label" htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            rows={4}
            maxLength={1000}
            className="input"
            value={form.description}
            onChange={set('description')}
          />
        </div>

        <div>
          <span className="label">Photos</span>

          <ImageUploader
            value={form.images}
            onChange={(images) =>
              setForm({
                ...form,
                images,
              })
            }
          />
        </div>

        <label className="flex items-center gap-2 font-semibold">
          <input
            type="checkbox"
            className="h-5 w-5 accent-field-600"
            checked={form.available}
            onChange={set('available')}
          />

          Available for {isCrop ? 'sale' : 'buyers to order'}
        </label>

        <div className="flex gap-3">
          <button
            className="btn-primary"
            disabled={busy}
          >
            {busy ? 'Saving…' : `Save ${noun}`}
          </button>

          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}