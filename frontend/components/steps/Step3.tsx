import React, { useState } from "react";
import { NFTStorage, Blob } from "nft.storage";
import { BackspaceIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import StepsStatus from "@/components/steps/StepsStatus";
import Image from "next/image";

const storage_client = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY || "",
});

export default function Step({
  campaignData,
  setCampaignData,
  currentStep,
  setCurrentStep,
}: {
  campaignData: any;
  setCampaignData: any;
  currentStep: any;
  setCurrentStep: any;
}) {
  const [selectedSponsors, setSelectedSponsors] = useState<any>([]);
  const [newSponsor, setNewSponsor] = useState<any>({
    rewardToken: "",
    maxReward: "",
    adDescription: "",
    sponsorImage: "",
    dappRewards: "",
    dappUserRewards: "",
  });

  const allSponsors = [
    {
      name: "Polygon",
      rewardToken: "MATIC",
      maxReward: "1000",
      adDescription: "Polygon’s zkEVM’s incentivized testnet launches Nov 16!",
      sponsorImage: "/polygon.webp",
      dappRewards: "0.5",
      dappUserRewards: "0.5",
    },
    {
      name: "AWS",
      rewardToken: "USDC",
      maxReward: "1000",
      adDescription: "Scale up ML data cleaning with AWS Mechanical Turk",
      sponsorImage: "/aws.png",
      dappRewards: "0.5",
      dappUserRewards: "1",
    },
  ];

  console.log("Campaign Data:", campaignData);

  return (
    <section>
      <StepsStatus currentStep={currentStep} />
      <h1 className="text-2xl font-bold font-mono text-indigo-600 mx-2 mb-2">
        Sponsorship opportunities
      </h1>

      <div className="grid grid-cols-2 gap-3">
        {allSponsors.map((sponsor: any, index) => (
          <div
            key={index}
            className="mt-2 flex justify-between items-center shadow-xl bg-yellow-200 text-zinc-800 rounded-2xl p-5"
          >
            <Image
              className={`mr-10 p-4 rounded-3xl ${
                sponsor.name === "Polygon" ? "bg-purple-600" : "bg-zinc-100"
              }`}
              src={sponsor.sponsorImage}
              alt={sponsor.name}
              width={200}
              height={50}
            />
            <div className="grid grid-cols-1">
              <p className="text-xl mb-2">
                {sponsor.name} - {sponsor.adDescription}
              </p>
              <p className="text-md font-bold">
                dApp Reward: <br />
                <span className="font-normal">
                  {sponsor.dappRewards} {sponsor.rewardToken}/click (up to&nbsp;
                  {sponsor.maxReward}&nbsp; users)
                </span>
              </p>
              <p className="text-md font-bold">
                User Reward: <br />
                <span className="font-normal">
                  {sponsor.dappUserRewards} {sponsor.rewardToken}/click (up to
                  &nbsp;
                  {sponsor.maxReward}&nbsp; users)
                </span>
              </p>

              <div className="flex items-start mt-5">
                <div className="flex h-6 items-center">
                  <input
                    onChange={(e: any) => {
                      if (e.target.checked) {
                        setSelectedSponsors([...selectedSponsors, sponsor]);
                      } else {
                        setSelectedSponsors(
                          selectedSponsors.filter(
                            (a: any) => a.name !== sponsor.name
                          )
                        );
                      }
                    }}
                    type="checkbox"
                    className="h-6 w-6 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                  />
                </div>
                <div className="ml-3 text-lg leading-6">
                  <label
                    htmlFor="comments"
                    className="font-medium text-gray-900"
                  >
                    Add to my Campaign
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center text-zinc-900 shadow-lg rounded-2xl p-5">
        <div>
          <h2 className="text-3xl font-bold text-indigo-600 mb-2 mr-10 pr-10">
            Want to be a sponsor?
          </h2>
          <button
            disabled={true}
            className="disabled:opacity-50 
          mt-3 font-bold rounded-xl bg-indigo-600 px-4 py-2.5 text-lg text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit request
          </button>
        </div>
        <div className="grid grid-cols-3 gap-5 w-full">
          <div className="mt-5">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              Reward Token
            </label>
            <div className="mt-2">
              <input
                onChange={(e: any) => {
                  setNewSponsor({
                    ...newSponsor,
                    rewardToken: e.target.value,
                  });
                }}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="LFG Polygon!"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              Max Reward
            </label>
            <div className="mt-2">
              <input
                onChange={(e: any) => {
                  setNewSponsor({
                    ...newSponsor,
                    maxReward: e.target.value,
                  });
                }}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="LFG Polygon!"
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              Ad description
            </label>
            <div className="mt-2">
              <input
                onChange={(e: any) => {
                  setNewSponsor({
                    ...newSponsor,
                    adDescription: e.target.value,
                  });
                }}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="LFG Polygon!"
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              Sponsor Image/Logo URL
            </label>
            <div className="mt-2">
              <input
                onChange={(e: any) => {
                  setNewSponsor({
                    ...newSponsor,
                    sponsorImage: e.target.value,
                  });
                }}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="LFG Polygon!"
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              dApp Rewards
            </label>
            <div className="mt-2">
              <input
                onChange={(e: any) => {
                  setNewSponsor({
                    ...newSponsor,
                    dappRewards: e.target.value,
                  });
                }}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="LFG Polygon!"
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              dApp User Rewards
            </label>
            <div className="mt-2">
              <input
                onChange={(e: any) => {
                  setNewSponsor({
                    ...newSponsor,
                    dappUserRewards: e.target.value,
                  });
                }}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="LFG Polygon!"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="mt-5 flex justify-end gap-x-3">
          <button
            onClick={() => {
              setCurrentStep(currentStep - 1);
            }}
            className="disabled:opacity-50 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Go back
          </button>
          <button
            onClick={() => {
              setCampaignData({
                ...campaignData,
                step3: {
                  sponsors: selectedSponsors,
                },
              });
              setCurrentStep(currentStep + 1);
            }}
            className="disabled:opacity-50 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Next Step
          </button>
        </div>
      </div>
    </section>
  );
}
