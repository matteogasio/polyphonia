// app/not-found.tsx
import Link from 'next/link';

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="bg-stone-100 p-12 rounded-lg border border-stone-300 max-w-lg">
        <h1 className="text-6xl font-serif font-semibold mb-4 text-neutral-900">
          404
        </h1>
        <h2 className="text-2xl font-serif font-semibold mb-4 text-neutral-900">
          Seite nicht gefunden
        </h2>
        <p className="text-neutral-600 mb-8 leading-relaxed">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Zur Startseite →
        </Link>
      </div>
    </div>
  );
}
