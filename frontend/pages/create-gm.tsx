import { useState } from "react";
import Layout from "@/components/layout";
import Step1 from "@/components/steps/Step1";
import Step2 from "@/components/steps/Step2";
import Step3 from "@/components/steps/Step3";
import Step4 from "@/components/steps/Step4";
import Step5 from "@/components/steps/Step5";

export default function CreateProject() {
  const [campaignData, setCampaignData] = useState<any>({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
  });
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <Layout pageTitle="Create GM">
      {currentStep === 0 && (
        <Step1
          campaignData={campaignData}
          setCampaignData={setCampaignData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 1 && (
        <Step2
          campaignData={campaignData}
          setCampaignData={setCampaignData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 2 && (
        <Step3
          campaignData={campaignData}
          setCampaignData={setCampaignData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 3 && (
        <Step4
          campaignData={campaignData}
          setCampaignData={setCampaignData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 4 && (
        <Step5
          campaignData={campaignData}
          setCampaignData={setCampaignData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
    </Layout>
  );
}
