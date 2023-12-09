import Image from "next/image";
import Layout from "@/components/layout";

export default function HomePage() {
  return (
    <Layout pageTitle="Home">
      <div className="mt-5 ">
        <div className="mt-6 shadow-lg relative isolate rounded-2xl overflow-hidden bg-indigo-600 py-16 sm:py-24 lg:py-16 lg:pt-20">
          <div className="mx-auto max-w-full px-6 lg:px-8">
            <div className="mx-5 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <div className="max-w-xl lg:max-w-lg">
                <h2 className="text-4xl font-bold tracking-tight text-white">
                  Supercharging User Retention
                </h2>
                <p className="mt-4 text-md leading-4 text-lg text-gray-300">
                  Create campaigns, reward users for checking your app daily.
                </p>
              </div>

              <div className="text-end">
                <h1 className="text-5xl font-bold text-zinc-100">2536</h1>
                <p className="text-zinc-100 text-2xl">
                  Quests completed today...
                </p>
              </div>
            </div>
          </div>
          <div
            className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
            aria-hidden="true"
          >
            <div
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 xl:mt-12 grid grid-cols-2">
        <div className="bg-zinc-200 p-10 m-2 rounded-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Create New Quests
          </h2>

          <p className="mt-4 mb-1 text-md leading-6 text-gray-500">
            Please connect and sign in to get started.
          </p>

          <div className="grid grid-cols-1 items-end mt-12 pt-12">
            <button
              onClick={() => {}}
              className="w-full text-center px-4 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Manage quests
            </button>
            <button
              onClick={() => {}}
              className="mt-2 w-full text-center px-4 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create a quest
            </button>
          </div>
        </div>

        <div className="bg-zinc-200 p-10 m-2 rounded-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            What&apos;s new?
          </h2>

          <p className="mt-4 text-md leading-6 text-gray-500">
            Enable cross-chain NFTs with Chainlink CCIP
          </p>

          <div className="flex mt-7">
            <div className="my-3 mr-3 p-3 rounded-2xl shadow-lg bg-slate-900 w-[30%] h-full">
              <Image
                src="/arbitrum.png"
                alt="arbitrum"
                width={100}
                height={100}
              />
              <p className="font-bold text-xl text-white">Arbitrum</p>
            </div>
            <div className="my-3 mr-3 p-3 rounded-2xl shadow-lg bg-violet-600 w-[30%] h-full">
              <Image
                src="/polygon.webp"
                alt="polygon"
                width={100}
                height={100}
              />
              <p className="font-bold text-xl text-white">Polygon</p>
            </div>
            <div className="my-3 mr-3 p-3 rounded-2xl shadow-lg bg-blue-600 w-[30%] h-full">
              <Image
                src="/base-logo.png"
                alt="base"
                width={90}
                height={90}
                className="h-20 w-20 mb-5"
              />
              <p className="font-bold text-xl text-white">Base</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-200 p-10 m-2 rounded-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Explore the ecosystem
          </h2>

          <p className="mt-4 text-md leading-6 text-gray-500">
            Explore Rewards 🔎
          </p>

          <div className="mt-7 mb-3 p-3 rounded-2xl text-white overflow-hidden bg-indigo-600 shadow-xl hover:bg-indigo-500 ease-in-out transition-all duration-300 cursor-pointer">
            <h3 className="text-3xl font-bold">DexTech</h3>
            <div className="max-w-md">
              Explore Uniswap v3 for dynamic DeFi, managing liquidity,
              optimizing fees, and earning DEX tokens.
            </div>
            <div className="mt-5 text-end">
              <div className="font-bold mb-2">Rewards</div>
              <span className="text-sm bg-indigo-100 text-indigo-600 font-black shadow-md p-2 rounded-lg ml-2">
                1000 DEX
              </span>
              <span className="text-sm bg-indigo-100 text-indigo-600 font-black shadow-md p-2 rounded-lg ml-2">
                +20 GM
              </span>
            </div>
          </div>

          <div className="mt-7 mb-3 p-3 rounded-2xl text-white overflow-hidden bg-indigo-600 shadow-xl hover:bg-indigo-500 ease-in-out transition-all duration-300 cursor-pointer">
            <h3 className="text-3xl font-bold">Resolve</h3>
            <div className="max-w-md">
              Explore Uniswap v3 for dynamic DeFi, managing liquidity,
              optimizing fees, and earning DEX tokens.
            </div>
            <div className="mt-5 text-end">
              <div className="font-bold mb-2">Rewards</div>
              <span className="text-sm bg-indigo-100 text-indigo-600 font-black shadow-md p-2 rounded-lg ml-2">
                100 REV
              </span>
              <span className="text-sm bg-indigo-100 text-indigo-600 font-black shadow-md p-2 rounded-lg ml-2">
                +20 GM
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-200 p-10 m-2 rounded-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Active Sponsorships
          </h2>

          <p className="mt-4 text-md leading-6 text-gray-500">
            Enable cross-chain NFTs with Chainlink CCIP
          </p>

          <div className="mt-7 grid grid-cols-3 gap-5">
            <Image
              className="bg-violet-600 rounded-2xl p-3 mb-5"
              src="/polygon.webp"
              alt="polygon"
              width={100}
              height={100}
            />
            <Image
              src="/base-logo.png"
              alt="base"
              width={100}
              height={100}
              className="h-30 w-30 mb-5"
            />
            <Image
              src="/aws.png"
              alt="base"
              width={100}
              height={100}
              className="h-30 w-30 my-5"
            />
            <Image
              src="/mexc.png"
              alt="base"
              width={100}
              height={100}
              className="h-30 w-30 mb-5"
            />
            <Image
              src="/manta.png"
              alt="base"
              width={100}
              height={100}
              className="h-30 w-30 mb-5"
            />
            <Image
              src="/coinbase.png"
              alt="base"
              width={150}
              height={150}
              className="h-30 w-30 my-5"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
