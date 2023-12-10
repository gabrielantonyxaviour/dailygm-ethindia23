import Aadhaar from "./Aadhar";
import { useState, useEffect } from "react";
import { StarIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  AnonAadhaarProof,
} from "anon-aadhaar-react";
import { useContractRead } from "wagmi";
import cont from "../utils/dailyGM.json"

export default function Widget({campId}:{campId:number}) {
  const [campaignData, setCampaignData] = useState([]);
  const [anonAadhaar] = useAnonAadhaar();
  const cid=campId
  const { data, isError, isLoading } = useContractRead({
    address: cont.address as `0x${string}`,
    abi: cont.abi,
    functionName: 'campaigns',
    args: [cid]
  })
  console.log("data",data)
  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

  let isComplete = false;
  const contractRead = useContractRead({
    address:cont.address as  `0x${string}`,
    abi: cont.abi,
    functionName: 'getCampaign',  
    args: [cid]
  })
  console.log("aa",contractRead.data)
  const quest = useContractRead({
  address: cont.address as `0x${string}`,
  abi: cont.abi,
  functionName: 'getCampaignQuests',
  args: [0],
});
const safe=(contractRead.data as { safe: string })?.safe
const qst = {
  "0xF9F45B3123D8563AACAEfB322899F62fF094EA06": "LensFollowPlugin",
  "0x36895cD0b70C6234e5be0d528827C3e84146a91F": "XMTPChatPlugin",
  "0xeCb2C7b68098F8Fa5318978869560d8E1bdE3D03": "ContractInteractPlugin",
};
const cmp =(quest.data as string[])?.map((q: string) =>{
  useContractRead({
    address: q as `0x${string}`,
    abi: cont.abi,
    functionName: 'isCompleted',
    args: [safe],
  });
})
const dat = {
  name: (contractRead.data as { name: string })?.name,
  days: (quest.data as string[])?.length,
  tasks: (quest.data as string[])?.map((q: string) => qst[q as keyof typeof qst]) || [],
  completion:cmp
};
  return (
    <>
      {anonAadhaar.status == "logged-in" ? (
        <section className="my-3 ring-2 ring-indigo-400 rounded-xl p-3">
          <div className="mt-2 flex justify-between items-center">
            <h1 className="font-bold text-2xl">{dat.name}</h1>
          </div>
          
            <div className="mt-3 flex ">
            {dat.completion.map((comp: any, index: number) => (
            <div
              key={index}
              className={`grid grid-col-1 gap-3 shadow-lg ml-5 rounded-lg p-3 px-4 ring-1 w-92 h-92 ${
                !comp
                  ? "ring-indigo-600 bg-indigo-100"
                  : "ring-green-600 bg-green-100"
              }`}
            >
              {!comp ? (
                <div className=" flex justify-center ">
                <StarIcon className="h-10 w-10 text-indigo-600 text-center" />
                </div>
              ) : (
                <div className=" flex justify-center ">
                <CheckCircleIcon className="h-10 w-10 text-green-600 " />
                </div>
              )}
              <div className="font-bold text-center">Day {index+1}</div>
              <div className="font-bold text-center"> {dat.tasks[index]}</div>
            </div>
            ))}
          </div>
          {/* <div className="mt-3">
            {dat.tasks.map((task:any, index: number)=>(<div className="text-sm">Task {index+1}: {task}</div>))}
          </div> */}
          <div className="py-2 px-3 text-xl text-center mt-7 text-white bg-indigo-600 rounded-lg mb-2">
            Post on Lens
          </div>
          <div className="pt-2 text-xs">
            Powered by{" "}
            <span className="font-bold text-indigo-400">RPS Labs</span>
          </div>
        </section>
      ) : (
        <section className="my-3 ring-2 ring-indigo-400 rounded-xl p-3 text-center grid grid-row-1 justify-center">
          <div className="mt-2 mb-3 font-bold">
            Connect with Anon Aadhar to continue
          </div>
          <Aadhaar />
        </section>
      )}
    </>
  );
}
