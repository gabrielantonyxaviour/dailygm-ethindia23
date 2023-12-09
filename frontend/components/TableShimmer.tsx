export default function TableShimmer({ rows = 2 }) {
  let ShimmerRows = [];
  for (let i = 0; i < rows; i++) {
    ShimmerRows.push(
      <div key={i} className="mt-5 flex justify-center items-center">
        <div className="border shadow-lg rounded-md p-4 max-w-full w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-indigo-300 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-indigo-300 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-indigo-300 rounded col-span-2"></div>
                  <div className="h-2 bg-indigo-300 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div>{ShimmerRows}</div>;
}
