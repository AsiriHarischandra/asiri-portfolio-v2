import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center px-6">
        <div className="font-display text-7xl font-extrabold text-em/20 mb-4">404</div>
        <h1 className="font-display text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-sm text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="font-mono text-xs bg-em text-bg px-5 py-2.5 rounded-lg font-medium hover:shadow-lg hover:shadow-em/30 transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
