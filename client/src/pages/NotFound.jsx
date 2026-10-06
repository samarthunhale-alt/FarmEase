import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-soil-600">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="btn-primary mt-6">Go to home</Link>
    </div>
  );
}
