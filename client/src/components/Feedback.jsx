export function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-soil-600" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-field-600 border-t-transparent" />
      {label}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="card px-6 py-12 text-center">
      <h3 className="text-xl font-bold">{title}</h3>
      {text && <p className="mx-auto mt-2 max-w-md text-soil-600">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center" role="alert">
      <p className="font-semibold text-red-800">{message}</p>
      {onRetry && (
        <button className="btn-outline btn-sm mt-4" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages } = pagination;
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button className="btn-outline btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <span className="text-soil-600">Page {page} of {pages}</span>
      <button className="btn-outline btn-sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}

export function PageHeader({ title, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
