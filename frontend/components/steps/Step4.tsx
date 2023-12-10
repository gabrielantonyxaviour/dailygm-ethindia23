import React, { useState } from "react";
import { NFTStorage, Blob } from "nft.storage";
import StepsStatus from "@/components/steps/StepsStatus";
import Image from "next/image";
import { useContractWrite } from "wagmi";
import cont from "../../utils/dailyGM.json"
import { ethers } from "ethers";
import { CCIP_BNM_ABI } from "@/utils/constants";
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
  const CCIP_BNM_TOKEN="0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40"    
  const [rewards, setRewards] = useState<any>(campaignData.step2?.quests);
  console.log("Campaign Data:", campaignData.step2?.quests);
  const [maxtoken,setmaxtoken] = useState<number>(0)
  const [approved, setApproved] = useState(false);
  const approvebtn =`mt-5 disabled:opacity-50 rounded-xl bg-${approved?"white":"green"} px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 hover:bg-gray-50`
  const { data:d, isLoading, isSuccess, write:createCampaign } = useContractWrite({
    address:cont.address as  `0x${string}`,
    abi: cont.abi,
    functionName: 'createCampaign',
  })
  const { data, isLoading:isApproveLoading, isSuccess:isApproveSuccess, write:approve } = useContractWrite({
    address:CCIP_BNM_TOKEN,
    abi: CCIP_BNM_ABI,
    functionName: 'approve',
  })
  
  const oncampaign = async () => {
  const name = campaignData.step1?.campaignName
  const meta = campaignData.step1?.categories[0].name;
  const rewardtoken = "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40"
  const tknamt =   ethers.parseEther(maxtoken.toString())
  // const quests = campaignData.step2?.quests.map((quest: any) => {quest.contract})
  const quests =["0xF59a35C04C43E82416bBed4F27Cc1404583c8888","0x75518315aeB64958CBC6a95EE4D07c34077F1D90"]
  const dat=["0x","0x"]
  const owners=["0x0429A2Da7884CA14E53142988D5845952fE4DF6a"]
  const threshold = 1
  const salt =69
  console.log("campaign contract:",name,meta,rewardtoken,tknamt,quests,dat,owners,threshold,salt)
  createCampaign({
    args:[[name,meta,rewardtoken,tknamt,quests,dat,owners,threshold,salt]]
  })

}
  return (
    <section>
      <StepsStatus currentStep={currentStep} />

      <section>
        <h1 className="font-normal mb-4 text-xl text-zinc-900">
          a) Setup rewards
        </h1>
        <div className="grid grid-cols-1 gap-3">
          {campaignData.step2?.quests.map((quest: any, index: number) => (
            <div key={index} className="flex -space-x-px rounded-md shadow-sm">
              <div className="w-[120px] relative grow rounded-md rounded-r-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                <label className="block text-lg font-medium text-indigo-600 ">
                  <span className="font-bold">Day {index + 1}</span> <br />
                  <span className="text-md">{quest.name}</span>
                </label>
                <p className="text-start block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                  {quest.points + " pts"}
                </p>
              </div>

              <div className="relative grow px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                <label className="block text-sm font-medium text-gray-900">
                  Reward Type
                </label>
                <select
                  onChange={(e: any) => {
                    const newRewards = [...rewards];
                    newRewards[index].type = e.target.value;
                    setRewards(newRewards);
                  }}
                  className="block w-full border-0 p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0  text-md sm:leading-6"
                >
                  <option value="1">ERC20 Tokens</option>
                  <option value="2">NFT</option>
                  <option value="2">Others</option>
                </select>
              </div>
              <div className="relative grow rounded-md rounded-l-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                <label className="block text-sm font-medium text-gray-900">
                  Select Chain
                </label>
                <select
                  onChange={(e: any) => {
                    const newRewards = [...rewards];
                    newRewards[index].chain = e.target.value;
                    setRewards(newRewards);
                  }}
                  className="block w-full border-0 p-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-md sm:leading-6"
                >
                  <option value="1">Polygon</option>
                  <option value="2">Ethereum</option>
                  <option value="2">Others</option>
                </select>
              </div>

              <div className="w-10 relative grow rounded-md rounded-r-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                <label className="block text-sm font-medium text-gray-900">
                  Enter reward amount
                </label>
                <input
                  type="text"
                  onChange={(e: any) => {
                    const newRewards = [...rewards];
                    newRewards[index].amount = e.target.value;
                    setRewards(newRewards);
                  }}
                  className="text-lg block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0  sm:leading-6"
                  placeholder="100"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h1 className="font-normal mb-4 mt-10 text-xl text-zinc-900">
          b) Choose Campaign Schedule
        </h1>

        <div className="p-2 ring-1 ring-inset ring-gray-300 grid grid-cols-2 gap-4 mb-7">
          <div className="mt-5">
            <label className="block text-md font-medium leading-6 text-gray-900">
              Starts on
            </label>
            <input
              type="date"
              className="block w-full border-0 p-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-lg"
              placeholder="Dec 3, 2023"
            />
          </div>

          <div className="mt-5">
            <label className="block text-md font-medium leading-6 text-gray-900">
              Ends on
            </label>
            <input
              type="date"
              className="block w-full border-0 p-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-lg"
              placeholder="Dec 3, 2023"
            />
          </div>
        </div>
      </section>

      <section>
        <h1 className="font-normal mb-4 text-xl text-zinc-900">
          c) Deposit Funds
        </h1>

        <div className="mt-5 p-3 ring-1 ring-inset ring-gray-300">
          <label className="block text-md font-medium leading-6 text-gray-900 ">
            Max Token Amount
          </label>
          <div className="mt-2">
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
              placeholder="LFG Polygon!"
              onChange={(e: any) => {setmaxtoken(e.target.value)}}
            />
          </div>
          <div className="flex justify-end items-end">
            <button className={approvebtn}  
            onClick={()=>{
              approve({args:[cont.address,ethers.parseEther(maxtoken.toString())]})
            }}
            disabled={isApproveSuccess}
              >
                Approve Funds
            </button>
          </div>
        </div>
      </section>

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
                step4: {
                  rewards: rewards,
                  maxtoken:maxtoken
                },
              });
              oncampaign()
              setCurrentStep(currentStep + 1);
            }}  
            disabled={!isApproveSuccess}
            className="disabled:opacity-50 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Create Form
          </button>
        </div>
      </div>
    </section>
  );
}
