import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import getCollection from "../utils/thegraph-queries/getCollection";
import { useEffect } from "react";
import { VAULT_CONTRACT_ABI } from "../utils/constants";
import { useContractWrite } from "wagmi";
import axios from "axios";
import Link from "next/link";

interface Props {
  collectionId: string;
}

export default function ProjectModal({ collectionId }: Props) {
  const [modalOpen, setmodalOpen] = useState(false);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [vaultBalanceLoading, setVaultBalanceLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [collection, setCollection] = useState<any>(null);
  const [milestoneData, setMilestoneData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { write: unlockFunds } = useContractWrite({
    abi: VAULT_CONTRACT_ABI,
    functionName: "unlockFunds",
    args: [],
  });

  useEffect(() => {
    (async () => {
      if (collectionId) {
        console.log("Fetching collection...: ", collectionId);
        const collection = await getCollection(collectionId);
        console.log(collection);
        console.log(
          "CAchec: ",
          localStorage.getItem("attestedCollectionsCache")
        );

        let attestedCollectionsCache = JSON.parse(
          localStorage.getItem("attestedCollectionsCache") || "[]"
        );
        let a = attestedCollectionsCache.includes(collection.id);

        console.log("a: ", a);

        if (attestedCollectionsCache.includes(collection.id)) {
          let temp = collection;
          temp.vault.positiveVotes = temp.vault.positiveVotes + 1;
          setCollection(temp);
        } else {
          setCollection(collection);
        }

        if (collection) {
          let milestoneData = await fetch(collection.metadataContractURI).then(
            (res) => res.json()
          );

          console.log("Milestones:", milestoneData);
          setMilestoneData(milestoneData);

          await axios
            .get(collection.imageURI)
            .then((res) => {
              if (res.data == null) {
                console.log("Image loaded: ", res.data);
                let temp = collection;
                temp.imageURI = "/nftree.jpg";
                setCollection(temp);
                console.log("Image loaded: ", collection);
              }
            })
            .catch((err) => {
              console.log("err: ", err);
            });

          setLoading(false);
        }
      }
    })();
  }, []);
  return (
    <div>
      <p
        onClick={() => setmodalOpen(true)}
        className="hover:cursor-pointer text-xs font-medium text-gray-500 group-hover:text-gray-700 "
      >
        View more details
      </p>
      <Transition.Root show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setmodalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[1000px] sm:p-6">
                  <div>
                    <div className="mt-3 sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Project Overview
                      </Dialog.Title>
                      <div className="mt-2">
                        {!loading ? (
                          <div className="mt-5 px-4 py-5 sm:p-6 sm:py-12 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12 gap-y-5 lg:gap-y-0 bg-white shadow sm:rounded-2xl overflow-hidden">
                            <div>
                              <div>
                                <picture>
                                  <source
                                    srcSet={collection.imageURI}
                                    type="image/*"
                                  />
                                  <img
                                    className="w-full h-auto rounded-2xl"
                                    loading="lazy"
                                    src={collection.imageURI}
                                    alt="image"
                                  />
                                </picture>
                              </div>

                              <div className="mt-8">
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Your Vault Address
                                </label>
                                <div className="mt-2">
                                  <p
                                    defaultValue=""
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                                  >
                                    {collection.vault.id}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-5">
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  NFT Contract Address
                                </label>
                                <div className="mt-2">
                                  <input
                                    defaultValue=""
                                    disabled
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                                    placeholder={collection.id}
                                  />
                                </div>
                              </div>

                              {/* Claim Funds Button */}
                              <div className="mt-8 flex justify-between items-center">
                                <button
                                  type="button"
                                  //   disabled={router.query.isAttested != "true"}
                                  onClick={() => {
                                    unlockFunds({
                                      // @ts-ignore next-line
                                      address: collection.vault.id,
                                    });
                                  }}
                                  className="flex items-center rounded-xl bg-indigo-600 px-5 py-2 text-xl font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  hover:outline-indigo-500 hover:text-black disabled:bg-slate-500 disabled:hover:text-gray-100"
                                >
                                  Claim Funds
                                </button>
                                {/* {router.query.isAttested != "true" && (
                                  <div className="w-[60%]">
                                    <p className="text-sm leading-6 font-medium text-gray-900 text-right ">
                                      ⚠️ Not enough attestations to unlock funds
                                    </p>
                                  </div>
                                )} */}
                              </div>
                            </div>
                            <div>
                              <div className="font-black text-xl">
                                About This Collection
                              </div>
                              <div className="mt-5 flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-x-3">
                                    <picture>
                                      <source
                                        srcSet={collection.imageURI}
                                        type="image/*"
                                      />
                                      <img
                                        className="w-12 h-auto"
                                        loading="lazy"
                                        src={collection.imageURI}
                                        // fallback
                                        alt="image"
                                      />
                                    </picture>
                                    <Link href="#" passHref={true}>
                                      NFTrees
                                    </Link>
                                  </div>
                                </div>
                                <div className="flex gap-x-3">
                                  <button
                                    type="button"
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                  >
                                    Zora
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                  >
                                    ERC 1155
                                  </button>
                                </div>
                              </div>
                              <div className="mt-8">
                                <p className="text-gray-600 text-sm">
                                  Our organization will plant 100 evergreen
                                  trees in Nanaimo, British Columbia to help
                                  improve soil and water conservation, store
                                  carbon, moderate local climate, and give life
                                  to the world&apos;s wildlife.
                                </p>
                              </div>

                              <div className="mt-8 flex items-center justify-between">
                                <div className="font-medium text-lg text-gray-600">
                                  Milestone: <br />{" "}
                                  {milestoneData.milestoneTitle}
                                </div>
                                <div className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                  Deadline:{" "}
                                  {new Date(
                                    milestoneData.milestoneDeadline
                                  ).toDateString()}
                                </div>
                              </div>

                              <div className="mt-5">
                                <p className="text-gray-600 text-sm">
                                  {milestoneData.milestoneDescription == "Test"
                                    ? "Our organization will plant 100 evergreen trees in Nanaimo, British Columbia to help improve soil and water conservation, store carbon, moderate local climate, and give life to the world's wildlife."
                                    : milestoneData.milestoneDescription}
                                </p>
                              </div>

                              <div className="mt-5">
                                <div className="relative flex items-start justify-between">
                                  <div className="text-sm leading-6 font-medium text-gray-900">
                                    Only holders can attest
                                  </div>
                                  <div className="flex h-6 items-center">
                                    <input
                                      id="comments"
                                      aria-describedby="comments-description"
                                      name="comments"
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 bg-indigo-50 sm:rounded-lg">
                                <div className="px-4 py-5 sm:p-6 sm:py-6">
                                  <h3 className="text-3xl font-semibold leading-6 text-indigo-800">
                                    No. of Attestations{" "}
                                    {collection.vault.positiveVotes}
                                    <br />
                                    <div className="mt-2">
                                      Total supply:{" "}
                                      {collection.vault.editionSize}
                                    </div>
                                  </h3>
                                  <div className="mt-2 w-full pt-0.5 bg-gray-300" />
                                  <div className="mt-3 relative flex items-start justify-between">
                                    <div className="text-sm leading-6 font-medium text-gray-900">
                                      0.000877 ETH
                                    </div>
                                    <div className="h-6 text-indigo-600 text-sm">
                                      Now Minting
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-screen">
                            Loading...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => setmodalOpen(false)}
                    >
                      Go back to projects
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
