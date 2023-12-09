import React, { useState } from "react";
import { NFTStorage, Blob } from "nft.storage";
import StepsStatus from "@/components/steps/StepsStatus";

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
  const [formData, setFormData] = useState<any>({
    campaignName: "",
    categories: [],
    twitterLink: "",
    discordLink: "",
  });
  const [categories, setCategories] = useState([
    { name: "DeFi", selected: false },
    { name: "DAO", selected: false },
    { name: "Gambling", selected: false },
    { name: "NFT", selected: false },
    { name: "Gaming", selected: false },
    { name: "CEX", selected: false },
    { name: "DEX", selected: false },
    { name: "Marketplace", selected: false },
    { name: "Staking", selected: false },
    { name: "Aggregator", selected: false },
    { name: "Bridge", selected: false },
    { name: "Others", selected: false },
  ]);

  console.log("Campaign Data:", campaignData);

  return (
    <section>
      <StepsStatus currentStep={currentStep} />

      <h1 className="text-2xl font-mono text-indigo-600 mx-2">
        Start your first GM Campaign!
      </h1>

      <div className="">
        <div className="p-3">
          <div className="mt-5">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              Campaign Name*
            </label>
            <div className="mt-2">
              <input
                onChange={(e: any) => {
                  setFormData({ ...formData, campaignName: e.target.value });
                }}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="LFG Polygon!"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 p-3">
          <div className="mt-2">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              Select Categories*
            </label>
            <div className="mt-4">
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newCategories = [...categories];
                      newCategories[index].selected =
                        !newCategories[index].selected;
                      setFormData({ ...formData, categories: newCategories });
                      setCategories(newCategories);
                    }}
                    className={`${
                      category.selected
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    } flex-grow-0 flex-shrink-0 inline-flex items-center gap-x-2 px-3.5 py-2.5 text-sm font-semibold rounded-lg shadow-lg ring-1 ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 outline-1 outline outline-indigo-600 hover:text-indigo-600`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 p-3">
          <div className="mt-2">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              Twitter link
            </label>
            <div className="mt-2">
              <input
                onChange={(e: any) => {
                  setFormData({ ...formData, twitterLink: e.target.value });
                }}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="https://twitter.com/xxxxx"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 p-3">
          <div className="mt-2">
            <label className="block text-lg font-medium leading-6 text-gray-900">
              Discord link
            </label>
            <div className="mt-2">
              <input
                onChange={(e: any) => {
                  setFormData({ ...formData, discordLink: e.target.value });
                }}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="https://discord.gg/xxxxx"
              />
            </div>
          </div>
        </div>

        <div className="mt-2">
          <div className="mt-5 flex justify-end gap-x-3">
            <button
              onClick={() => {
                setCampaignData({
                  ...campaignData,
                  step1: {
                    ...formData,
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
      </div>
    </section>
  );
}
