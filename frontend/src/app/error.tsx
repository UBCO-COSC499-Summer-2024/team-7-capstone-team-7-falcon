"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <h2 className="text-xl mb-4">Error: {error.message}</h2>
      <button
        onClick={() => reset()}
        className="px-6 py-2 btn-primary text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
      >
        Try again
      </button>
    </div>
  );
}
