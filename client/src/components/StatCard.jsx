export default function StatCard({ label, value, hint }) {
  return (
    <div className="card p-4">
      <p className="text-soil-600">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-field-700">{value}</p>
      {hint && <p className="mt-1 text-sm text-soil-600">{hint}</p>}
    </div>
  );
}
