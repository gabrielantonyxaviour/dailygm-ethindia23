import getAllProjectsByOwner from "../utils/thegraph-queries/getAllProjectsByOwner";
import getAllProjects from "../utils/thegraph-queries/getAllProjects";
import { useState, useEffect } from "react";
import { useContractWrite, useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ERC721DROP_ABI, VAULT_CONTRACT_ABI } from "../utils/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import axios from "axios";
import Layout from "@/components/layout";
import {
  ArchiveBoxArrowDownIcon,
  ListBulletIcon,
} from "@heroicons/react/20/solid";
import TableShimmer from "@/components/TableShimmer";
import ProjectModal from "@/components/ProjectModal";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
function AttestCollection({ collection, collectionIdx, allProjects }: any) {
  const [errorMessage, setErrorMessage] = useState("Already attested.");
  const { address } = useAccount();
  let vaultAddress = allProjects.find(
    (project: any) => project.id === collection.editionAddress
  )?.vault.id;

  const {
    write: attest,
    isSuccess,
    isError,
    isLoading,
    error,
  } = useContractWrite({
    address: vaultAddress,
    abi: VAULT_CONTRACT_ABI,
    functionName: "vote",
  });

  useEffect(() => {
    if (isError) {
      let errorMessage: any = error;
      errorMessage = errorMessage.message;
      console.log(error);
      if (errorMessage.includes("Vote_AlreadyVoted")) {
        setErrorMessage("Already voted.");
      } else if (errorMessage.includes("User denied")) {
        setErrorMessage("User denied tx.");
      } else {
        setErrorMessage("Unknown error.");
      }
    }
    (async () => {
      if (isSuccess) {
        localStorage.setItem("isSuccess", "true");
        let attestedCollectionsCache = JSON.parse(
          localStorage.getItem("attestedCollectionsCache") || "[]"
        );

        attestedCollectionsCache.push(collection.editionAddress);

        localStorage.setItem(
          "attestedCollectionsCache",
          JSON.stringify(attestedCollectionsCache)
        );

        console.log("Attested and cached!");
      }

      if (collection) {
        await axios
          .get(collection.imageURI)
          .then((res) => {
            if (res.data == null) {
              let temp = collection;
              temp.imageURI = "/nftree.jpg";
              collection = temp;
            }
          })
          .catch((err) => {
            console.log("err: ", err);
          });
      }
    })();
  }, []);

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
                      collection.imageURI !== "" ||
                      collection.imageURI !== null ||
                      collection.imageURI !== undefined
                        ? collection.imageURI
                        : "nftree.jpg"
                    }
                    type="image/*"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    loading="lazy"
                    src={
                      collection.imageURI !== "" ||
                      collection.imageURI !== null ||
                      collection.imageURI !== undefined
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
                  NFTree
                </p>
                <ProjectModal collectionId={collection.editionAddress} />
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="border-t border-gray-200 px-3 py-3.5 text-sm text-gray-500">
        {collection.tokenId}
      </td>

      <td className="border-t border-gray-200 px-3 py-3.5 text-smtext-gray-500">
        <button
          onClick={() => {
            console.log(collection);
            attest({
              args: [
                parseInt(collection.tokenId).toString(),
                "Very Good Collection!",
                true,
                address,
              ],
              to: address,
            });
          }}
          className={`disabled:opacity-50 inline-flex items-center rounded-md ${
            isError ? "bg-red-400" : isSuccess ? "bg-green-300" : "bg-slate-200"
          } px-5 py-1.5 text-sm hover:text-zinc-100  hover:bg-indigo-600 shadow-lg  font-semibold text-gray-900 ring-inset ring-gray-300`}
        >
          {isLoading
            ? "Attesting..."
            : isSuccess
            ? "Attested!"
            : isError
            ? errorMessage
            : "Attest"}
        </button>
      </td>
    </tr>
  );
}
const tabs = [
  {
    name: "My Projects",
    status: "my-projects",
    icon: ArchiveBoxArrowDownIcon,
  },
  {
    name: "Milestones Tracker (Coming Soon)",
    status: "milestones",
    icon: ListBulletIcon,
  },
];

export default function AllProjectsPage() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [currentTab, setCurrentTab] = useState<any>("my-projects");
  const [allProjects, setAllProjects] = useState([]);
  const [projectsByOwner, setProjectsByOwner] = useState([]);

  useEffect(() => {
    (async () => {
      const allProjects: any = await getAllProjects();
      setAllProjects(allProjects);

      let projectsByOwner: any = await getAllProjectsByOwner(address);
      let collectionsToAttestCache = JSON.parse(
        localStorage.getItem("collectionsToAttestCache") || "[]"
      );

      projectsByOwner = projectsByOwner.map((project: any) => {
        let collection = allProjects.find(
          (collection: any) => collection.id === project.editionAddress
        );

        return {
          ...project,
          imageURI: collection.imageURI,
        };
      });

      projectsByOwner = [...projectsByOwner, ...collectionsToAttestCache];
      setProjectsByOwner(projectsByOwner);
      setLoadingProjects(false);
    })();
  }, []);

  return (
    <Layout pageTitle="Creator Dashboard">
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
                    disabled={tab.status === "milestones"}
                    type="button"
                    key={tab.name}
                    className={classNames(
                      tab.status === currentTab
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "disabled:cursor-pointer group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
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

      <div className="">
        {!loadingProjects ? (
          address ? (
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
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                    >
                      TokenId
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
                  {projectsByOwner.map((collection: any, collectionIdx) => (
                    <AttestCollection
                      allProjects={allProjects}
                      collection={collection}
                      collectionIdx={collectionIdx}
                      key={collectionIdx}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <button
              onClick={openConnectModal}
              type="button"
              className="mt-5 relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-full h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                />
              </svg>

              <span className="mt-2 block text-sm font-semibold text-gray-900">
                Connect wallet to get started.
              </span>
            </button>
          )
        ) : (
          <TableShimmer rows={5} />
        )}
      </div>
    </Layout>
  );
}
