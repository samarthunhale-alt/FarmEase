import { useState } from 'react';
import { UploadAPI } from '../services/endpoints.js';
import { errMsg, imgUrl } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function ImageUploader({ value, onChange, max = 5 }) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be 2 MB or smaller');
    setBusy(true);
    try {
      const res = await UploadAPI.image(file);
      onChange([...value, res.data.url]);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((u) => (
          <div key={u} className="relative">
            <img src={imgUrl(u)} alt="Uploaded crop" className="h-24 w-24 rounded-lg object-cover" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(value.filter((x) => x !== u))}
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-700 text-sm font-bold text-white"
            >
              ×
            </button>
          </div>
        ))}
        {value.length < max && (
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-field-200 text-center text-sm text-field-700 hover:bg-field-50">
            {busy ? 'Uploading…' : 'Add photo'}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} disabled={busy} />
          </label>
        )}
      </div>
      <p className="mt-1 text-sm text-soil-600">Up to {max} photos. JPG, PNG or WebP, 2 MB each.</p>
    </div>
  );
}
