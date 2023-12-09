import React, { useState } from "react";
import { NFTStorage, Blob } from "nft.storage";
import StepsStatus from "@/components/steps/StepsStatus";
import Image from "next/image";
import {
  CopyBlock,
  atomOneDark,
  dracula,
  github,
  googlecode,
  hopscotch,
  monokai,
  obsidian,
} from "react-code-blocks";

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
  const [config, setConfig] = useState<any>({
    testMode: false,
    brandingColor: "#6366F1",
  });
  console.log("Campaign Data:", campaignData);
  function hashCode(s: string) {
    return s.split("").reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  return (
    <section>
      <StepsStatus currentStep={currentStep} />
      <h1 className="text-2xl font-bold font-mono text-indigo-600 mx-2 mb-2">
        Embed DailyGM
      </h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-2">
          <div className="text-md font-normal">
            Campaign ID:{" "}
            <span className="font-bold">
              {hashCode(JSON.stringify(campaignData))}
            </span>
          </div>
          <div className="flex items-start mt-5">
            <div className="flex h-6 items-center">
              <input
                onChange={(e: any) => {
                  setConfig({ ...config, testMode: e.target.checked });
                }}
                type="checkbox"
                className="h-6 w-6 rounded border-indigo-600 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="ml-3 text-lg leading-6">
              <label htmlFor="comments" className="font-medium text-gray-900">
                Enable Test Mode
              </label>
            </div>
          </div>

          <div className="flex items-start mt-5">
            <div className="mr-3 text-lg leading-6">
              <input
                onChange={(e: any) => {
                  setConfig({ ...config, brandingColor: e.target.value });
                }}
                type="color"
                defaultValue={"#6366F1"}
                className="h-8 w-7 rounded-md shadow-lg p-[1px] ring-1 ring-indigo-600"
              />
            </div>
            <p className="text-lg font-medium text-gray-900">
              Choose branding color
            </p>
          </div>
        </div>

        <div className="p-2">
          <CopyBlock
            customStyle={{
              borderRadius: "0.5rem",
              margin: "0.5rem",
              padding: "0.7rem",
            }}
            language="tsx"
            theme={dracula}
            // className="rounded-2xl font-monospace h-[500px] w-full bg-slate-800 text-slate-200 border-gray-300 focus:ring-slate-300"
            text={`import { DailyGM } from "@dailygm-sdk";\n\n<DailyGM\n\tcampaignId={${hashCode(
              JSON.stringify(campaignData)
            )}}\n\tsigner={signer}\n\tconfig={\n\t\t{\n\t\t\t"testMode": ${
              config.testMode
            },\n\t\t\t"brandingColor": "${
              config.brandingColor
            }",\n\t\t}\n\t}\n/>`}
          />
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
                step5: {
                  config: config,
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
