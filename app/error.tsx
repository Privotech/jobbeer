'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center font-bold text-xl">
          !
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-neutral-900">Something went wrong</h2>
          <p className="text-xs text-neutral-500">
            An unexpected error occurred. Please try resetting or refreshing the page.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
