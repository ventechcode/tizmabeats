export default function MobileBeatCard({ className }: { className?: string }) {
  return (
    <div
      className={`bg-transparent flex items-center justify-between space-x-4 py-2 px-4 rounded-lg mx-4 ${className} animate-pulse h-18`}
    >
      <div className="flex items-center space-x-2">
        <button className="text-gray-200 transition-colors flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="truncate">
          <h2 className="bg-gray-200 rounded-md w-24 h-5"></h2>
          <div className="flex text-xs text-subtext0 space-x-2">
            <span className="h-3 w-8 bg-gray-200 mt-1 rounded-md"></span>
            <span>•</span>
            <span className="h-3 w-8 bg-gray-200 mt-1 rounded-md"></span>
            <span>•</span>
            <span className="h-3 w-8 bg-gray-200 mt-1 rounded-md"></span>
          </div>
        </div>
      </div>
      <button className="h-8 w-14 rounded-full bg-gray-200"></button>
    </div>
  );
}
