import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 mx-auto flex items-center justify-center font-bold text-xl">
          404
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-neutral-900">Page Not Found</h2>
          <p className="text-xs text-neutral-500">
            The page you are looking for does not exist or has been relocated.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors"
        >
          Return to GlobalHire
        </Link>
      </div>
    </div>
  );
}
