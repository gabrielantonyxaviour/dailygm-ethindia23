import React, { useState } from "react";
import { NFTStorage, Blob } from "nft.storage";
import { BackspaceIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import StepsStatus from "@/components/steps/StepsStatus";

const storage_client = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY || "",
});

const allQuests = [
  {
    id: 1,
    name: "Interact with a contract",
    points: 10,
    description:
      "Mint a token, stake a token, or do something else with a contract",
    data: {
      ContractAddress: "",
      FunctionSignature: [],
      ValidationEvent: "",
      ChainId: "",
    },
  },
  {
    id: 2,
    name: "Follow a Twitter account",
    points: 10,
    description: "Increase the twitter following of your community",
    data: {
      TwitterAccount: "",
    },
  },
  {
    id: 3,
    name: "Join a Discord server",
    points: 10,
    description: "Grow your community on Discord",
    data: {
      DiscordServer: "",
    },
  },
  {
    id: 4,
    name: "Conduct a survey (Google Forms, Typeform, etc)",
    points: 10,
    description: "Make them register, or ask them questions about your project",
    data: {
      SurveyLink: "",
    },
  },
  {
    id: 5,
    name: "Join a Telegram group",
    points: 10,
    description: "Grow your community on Telegram",
    data: {
      TelegramGroup: "",
    },
  },
  {
    id: 6,
    name: "Like a Tweet",
    points: 10,
    description: "Grow your twitter engagement",
    data: {
      TweetLink: "",
    },
  },
  {
    id: 7,
    name: "Post a Tweet with a mention",
    points: 10,
    description: "Grow your twitter engagement",
    data: {
      AccountToMention: "",
    },
  },
  {
    id: 8,
    name: "Post on Lens with mention or hashtag",
    points: 10,
    description: "Grow your Lens engagement",
    data: {
      MentionOrHashTag: "",
    },
  },
];

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
  const [quests, setQuests] = useState<any>([]);

  console.log("Campaign Data:", campaignData);
  return (
    <section>
      <StepsStatus currentStep={currentStep} />
      <h1 className="text-2xl font-mono text-indigo-600 mx-2">
        Select your quests
      </h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3">
          {allQuests.map((quest: any) => (
            <div key={quest.id} className="p-3 border rounded-lg">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {quest.name}
                  </h2>
                  <p className="text-sm text-gray-500">{quest.description}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm mb-2 text-gray-500 text-end">
                    {quest.points} points
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setQuests((prevQuests: any) => [...prevQuests, quest]);
                      }}
                      className="bg-indigo-100 disabled:opacity-50 rounded-s-full  px-4 py-2.5 text-sm font-semibold  text-indigo-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-600 hover:text-indigo-100"
                    >
                      <div className="flex">
                        <PlusCircleIcon className="h-5 w-5" />
                        <span className="ms-2">Add Quest</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2">
          {quests.map((quest: any, index: number) => (
            <div key={index} className="p-3 border shadow-xl mb-2 rounded-lg">
              {/* Remove Quest */}
              <div className="mb-4 flex justify-between">
                <button
                  onClick={() => {
                    setQuests((prevQuests: any) =>
                      prevQuests.filter((prevQuest: any) => prevQuest !== quest)
                    );
                  }}
                  className="bg-red-100 disabled:opacity-50 rounded-e-full  px-4 py-2.5 text-sm font-semibold  text-red-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600 hover:text-red-100"
                >
                  <div className="flex">
                    <span className="mr-2">Remove Quest</span>
                    <BackspaceIcon className="h-5 w-5" />
                  </div>
                </button>
                <div className="grid grid-cols-1 text-end">
                  <h1 className="text-indigo-600 font-bold text-3xl">
                    Day&nbsp;{index + 1}
                  </h1>
                  <p className="text-sm">{quest.name}</p>
                </div>
              </div>
              {Object.keys(quest.data).map((key: any) => (
                <div key={key} className="mt-2">
                  <label
                    htmlFor={key}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {key}
                  </label>
                  <input
                    onChange={(e: any) => {
                      setQuests((prevQuests: any) => {
                        const newQuests = [...prevQuests];
                        newQuests[index].data[key] = e.target.value;
                        return newQuests;
                      });
                    }}
                    type="text"
                    name={key}
                    id={key}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          ))}
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
                step2: {
                  quests: quests,
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
