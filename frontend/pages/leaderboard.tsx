import Image from "next/image";
import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import getLeaderboard from "../utils/thegraph-queries/getLeaderboard";
import TableShimmer from "@/components/TableShimmer";
import ProjectModal from "@/components/ProjectModal";

export default function ProjectAttestations() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const leaderboard = await getLeaderboard();
      console.log(leaderboard);
      setLeaderboard(leaderboard);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout pageTitle="DailyGM Score">
      <div className="mt-5 lg:mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold leading-6 text-gray-900">
              Leaderboard
            </h1>
          </div>
        </div>
        {!loading ? (
          <div className="-mx-4 mt-5 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
            <table className="min-w-full bg-white divide-y divide-gray-300 sm:rounded-lg">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Collections
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Attestamint Score
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((collection: any, collectionIdx) => (
                  <tr key={collectionIdx}>
                    <td className="border-t border-gray-200 px-3 py-3.5 text-smtext-gray-500">
                      <div className="font-medium text-gray-900">
                        <div className="group block flex-shrink-0">
                          <div className="flex items-center">
                            <div>
                              <Image
                                className="inline-block h-9 w-9 rounded-full"
                                src="/nftree.jpg"
                                height={64}
                                width={64}
                                alt=""
                              />
                            </div>

                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                {collection.nftAddress}...
                              </p>
                              <ProjectModal
                                collectionId={collection.nftAddress}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="border-t border-gray-200 px-3 py-3.5 text-sm text-gray-500">
                      <span>
                        {(parseInt(collection.positiveVotes) /
                          parseInt(collection.editionSize)) *
                          100}
                      </span>
                    </td>
                    <td className="border-t border-gray-200 px-3 py-3.5 text-smtext-gray-500">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <TableShimmer rows={5} />
        )}
      </div>
    </Layout>
  );
}
