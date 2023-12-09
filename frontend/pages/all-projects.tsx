import getAllProjects from "../utils/thegraph-queries/getAllProjects";
import { useState, useEffect } from "react";
import { useContractWrite } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ERC721DROP_ABI } from "../utils/constants";
import Layout from "@/components/layout";
import {
  BanknotesIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import TableShimmer from "@/components/TableShimmer";
import ProjectModal from "@/components/ProjectModal";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function PublicCollection({ collection, collectionIdx }: any) {
  const [errorMessage, setErrorMessage] = useState("");
  // Convert 1577000000000000 to ethers
  let correctValue = BigInt("877000000000000");
  const correctEtherValue = formatEther(correctValue);

  const {
    isSuccess,
    write: mint,
    isError,
    isLoading,
    error,
  } = useContractWrite({
    address: collection.id,
    abi: ERC721DROP_ABI,
    functionName: "purchase",
    args: [1],
    value: parseEther(correctEtherValue),
  });

  useEffect(() => {
    if (isError) {
      let errorMessage: any = error;
      errorMessage = errorMessage?.message;
      if (errorMessage.includes("Purchase_WrongPrice")) {
        setErrorMessage("Price not enough.");
      } else if (errorMessage.includes("Purchase_SoldOut")) {
        setErrorMessage("Purchase Sold Out.");
      } else if (errorMessage.includes("Purchase_TooManyForAddress")) {
        setErrorMessage("Already minted, can't mint more.");
      } else if (errorMessage.includes("User denied")) {
        setErrorMessage("User denied transaction signature.");
      } else if (errorMessage.includes("Sale_Inactive")) {
        setErrorMessage("Sale has ended.");
      } else if (errorMessage.includes("Mint_SoldOut")) {
        setErrorMessage("Collection sold out.");
      } else {
        setErrorMessage("Unknown error.");
      }
    }
    if (isSuccess) {
      let collectionsToAttestCache = JSON.parse(
        localStorage.getItem("collectionsToAttestCache") || "[]"
      );
      collectionsToAttestCache.push({
        editionAddress: collection.id,
        tokenId: 1,
        imageURI: collection.imageURI,
      });

      localStorage.setItem(
        "collectionsToAttestCache",
        JSON.stringify(collectionsToAttestCache)
      );

      console.log("Minted and cached!");
    }
  }, [isSuccess, collection, isError, error]);

  return (
    <tr key={collectionIdx}>
      <td className="border-t border-gray-200 px-3 py-3.5 text-smtext-gray-500">
        <div className="font-medium text-gray-900">
          <div className="group block flex-shrink-0">
            <div className="flex items-center">
              <div>
                <picture>
                  <source
                    srcSet={
                      collection?.imageURI !== "" ||
                      collection?.imageURI !== null ||
                      collection?.imageURI !== undefined
                        ? collection.imageURI
                        : "nftree.jpg"
                    }
                    type="image/*"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    loading="lazy"
                    src={
                      collection?.imageURI !== "" ||
                      collection?.imageURI !== null ||
                      collection?.imageURI !== undefined
                        ? collection.imageURI
                        : "nftree.jpg"
                    }
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "nftree.jpg";
                    }}
                    alt="image"
                  />
                </picture>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {collection.id.slice(0, 10)}
                </p>
                <ProjectModal collectionId={collection.id} />
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="border-t border-gray-200 px-3 py-3.5 text-sm text-gray-500">
        {collection.editionSize}
      </td>
      <td className="border-t border-gray-200 px-3 py-3.5 text-sm text-gray-500">
        {
          parseFloat((Math.random() * 2).toFixed(2)) // Converts the string back to a floating-point number
        }
      </td>
      <td className="border-t border-gray-200 px-3 py-3.5 text-sm text-gray-500">
        {collection.vault.positiveVotes}
      </td>
      <td className="border-t border-gray-200 px-3 py-3.5 text-smtext-gray-500">
        <button
          type="button"
          onClick={() => {
            mint();
          }}
          className={`disabled:opacity-50 inline-flex items-center rounded-md ${
            isError ? "bg-red-400" : isSuccess ? "bg-green-300" : "bg-slate-200"
          } px-5 py-1.5 text-sm hover:text-zinc-100  hover:bg-indigo-600 shadow-lg  font-semibold text-gray-900 ring-inset ring-gray-300`}
        >
          {isLoading
            ? "Minting..."
            : isSuccess
            ? "Minted!"
            : isError
            ? errorMessage
            : "Mint"}
        </button>
      </td>
    </tr>
  );
}

const tabs = [
  {
    name: "Now Minting",
    status: "now-minting",
    icon: BanknotesIcon,
  },
  { name: "Ended", status: "ended", icon: ClockIcon },
  {
    name: "Sold out",
    status: "sold-out",
    icon: ExclamationCircleIcon,
  },
];
export default function AllProjectsPage() {
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [currentTab, setCurrentTab] = useState<any>("now-minting");

  useEffect(() => {
    (async () => {
      const allProjects: any = await getAllProjects();
      setAllProjects(allProjects);
      setLoadingProjects(false);
    })();
  }, []);

  return (
    <Layout pageTitle="All Projects">
      <div>
        <div className="mt-5">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              defaultValue={currentTab}
            >
              {tabs.map((tab: any) => (
                <option key={tab.status}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab: any) => (
                  <button
                    onClick={() => {
                      setCurrentTab(tab.status);
                    }}
                    type="button"
                    key={tab.name}
                    className={classNames(
                      tab.status === currentTab
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    <tab.icon
                      className={classNames(
                        tab.status === currentTab
                          ? "text-indigo-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "-ml-0.5 mr-2 h-5 w-5"
                      )}
                      aria-hidden="true"
                    />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        {!loadingProjects ? (
          <div className="-mx-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
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
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Supply
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Funds Locked
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Attestations
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
                {allProjects.map((collection: any, collectionIdx) => (
                  <PublicCollection
                    collection={collection}
                    key={collectionIdx}
                    collectionIdx={collectionIdx}
                  />
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
