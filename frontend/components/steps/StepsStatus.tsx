type StepProps = {
  currentStep: number;
};

export default function Steps(props: StepProps) {
  const { currentStep } = props;

  const steps = [
    { id: "Step 1", name: "1. Account setup" },
    { id: "Step 2", name: "2. Select Quests" },
    {
      id: "Step 3",
      name: "3. Accept Sponsored Bonuses",
    },
    { id: "Step 4", name: "4. Deposit Funds" },
    { id: "Step 5", name: "5. Copy Embed" },
  ];

  return (
    <nav aria-label="Progress" className="my-10">
      <div className="mt-5 px-5 py-3 text-white font-semibold text-xl bg-indigo-600 rounded-lg shadow mb-2">
        {steps[currentStep]?.name}
      </div>

      <ol
        role="list"
        className="space-y-4 md:flex md:space-x-8 md:space-y-0 mx-2"
      >
        {steps.map((step, index) => (
          <li key={step.name} className="md:flex-1">
            {index < currentStep ? (
              <div className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                  {step.id}
                </span>
                <span className="text-sm font-medium">
                  {" "}
                  {step.name.slice(2)}
                </span>
              </div>
            ) : index === currentStep ? (
              <div
                className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-indigo-600">
                  {step.id}
                </span>
                <span className="text-sm font-medium">
                  {step.name.slice(2)}
                </span>
              </div>
            ) : (
              <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">
                  {step.name.slice(2)}
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
