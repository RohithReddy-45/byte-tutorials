export default function Loader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="w-full max-w-md mx-auto bg-gray-200 rounded-lg animate-pulse"
        >
          <div className="h-48 bg-gray-300 rounded-t-lg" />
          <div className="p-3">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
