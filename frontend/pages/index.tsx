import Image from "next/image";
import Head from "next/head";
import { ChevronRightIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import {
  CheckIcon,
  PresentationChartLineIcon,
  DocumentArrowUpIcon,
  BanknotesIcon,
  LinkIcon,
  BarsArrowUpIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const primaryFeatures = [
  {
    name: "Milestone system",
    description:
      "Create milestones and submit upon completion to trigger a community vote.",
    href: "#",
    icon: CheckIcon,
  },
  {
    name: "Secured funds",
    description:
      "Funds are secured in a safe address and are automatically distributed upon successful milestone completion.",
    href: "#",
    icon: LockClosedIcon,
  },
  {
    name: "DailyGM score",
    description:
      "Get scored based on your ability to fulfill milestones and demonstrate your ability to execute from a glance.",
    href: "#",
    icon: PresentationChartLineIcon,
  },
];
const secondaryFeatures = [
  {
    name: "Transparent attestations.",
    description: "Settled and secured by EAS. ",
    icon: DocumentArrowUpIcon,
  },
  {
    name: "Easy minting.",
    description: "Deploy your project with ease, no smart contracts required!",
    icon: BanknotesIcon,
  },
  {
    name: "Safe protocol.",
    description:
      "Don’t worry, your funds are secure with Safe’s battle-tested protocol.",
    icon: LockClosedIcon,
  },
  {
    name: "Multi-chain.",
    description: "Supporting all projects on Ethereum, Base, Zora, Optimism.",
    icon: LinkIcon,
  },
  {
    name: "Hassle-free claims.",
    description: "Withdraw your funds in a few clicks!",
    icon: BarsArrowUpIcon,
  },
  {
    name: "Extensive metrics.",
    description: "Know how your projects are performing at a glance.",
    icon: ChartBarIcon,
  },
];
const stats: any = [
  { id: 1, name: "Lost in crypto scams", value: "$40B+" },
  { id: 2, name: "Lost in NFT scams", value: "$2.8B+" },
  { id: 3, name: "NFTs lost to phishing", value: "316,715" },
];
const footerNavigation = {
  solutions: [
    { name: "Hosting", href: "#" },
    { name: "Data Services", href: "#" },
    { name: "Uptime Monitoring", href: "#" },
    { name: "Enterprise Services", href: "#" },
  ],
  support: [
    { name: "Pricing", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "API Reference", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
  ],
  legal: [
    { name: "Claim", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
  social: [
    {
      name: "Twitter",
      href: "https://www.twitter.com/DailyGM",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },

    {
      name: "GitHub",
      href: "https://www.github.com/DailyGM",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

export default function Landing() {
  return (
    <>
      <Head>
        <title>DailyGM</title>
        <meta name="title" content="DailyGM" />
        <meta name="description" content="DailyGM" />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://DailyGM.vercel.app/meta-image.jpg"
        />
        <meta property="og:title" content="DailyGM" />
        <meta property="og:description" content="DailyGM" />
        <meta
          property="og:image"
          content="https://DailyGM.vercel.app/meta-image.jpg"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://DailyGM.vercel.app/" />
        <meta property="twitter:title" content="DailyGM" />
        <meta property="twitter:description" content="DailyGM" />
        <meta
          property="twitter:image"
          content="https://DailyGM.vercel.app/meta-image.jpg"
        />
      </Head>

      <div className="bg-gray-900">
        <main>
          {/* Hero section */}
          <div className="relative isolate overflow-hidden">
            <svg
              className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                  width={200}
                  height={200}
                  x="50%"
                  y={-1}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
                <path
                  d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
              />
            </svg>
            <div
              className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
              aria-hidden="true"
            >
              <div
                className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
                style={{
                  clipPath:
                    "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                }}
              />
            </div>
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-40 lg:flex lg:px-8 lg:pt-40">
              <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
                <img className="h-11" src="logo.png" alt="Your Company" />
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <Link href="#" className="inline-flex space-x-6">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                      Latest updates
                    </span>
                    <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
                      <span>Sign up for Beta</span>
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  Building trust through transparency
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Lay the foundation for a project built on transparency and
                  allow your community to invest with confidence. Complete
                  milestones, initiate community votes, and unlock funds.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href="/home"
                    className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  >
                    Get started
                  </Link>
                  <a
                    href="#"
                    className="text-sm font-semibold leading-6 text-white"
                  >
                    Live demo <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                  <Image
                    src="/half-image.png"
                    alt="App screenshot"
                    width={2432}
                    height={1442}
                    className="w-[76rem] rounded-md bg-white/5 shadow-3xl ring-1 ring-white/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo cloud */}
          <div className="mx-auto mt-8 max-w-7xl px-6 sm:mt-16 lg:px-8">
            <h2 className="text-center text-lg font-semibold leading-8 text-white">
              Supported by
            </h2>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
              <Image
                className="col-span-2 max-h-10 w-full object-contain lg:col-span-1 filter brightness-200 contrast-200 saturate-0"
                src="/eg-logo.svg"
                alt="Eth Global"
                width={158}
                height={48}
              />
              <Image
                className="col-span-2 max-h-8 w-full object-contain lg:col-span-1 filter invert"
                src="/zora.png"
                alt="Zora"
                width={158}
                height={48}
              />
              <Image
                className="col-span-2 max-h-9 w-full object-contain lg:col-span-1 filter invert"
                src="/full-base-logo.webp"
                alt="Base L2"
                width={158}
                height={48}
              />
              <Image
                className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1 filter brightness-200"
                src="/eas.png"
                alt="EAS"
                width={158}
                height={48}
              />
              <Image
                className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                src="/safe.svg"
                alt="Statamic"
                width={158}
                height={48}
              />
            </div>
          </div>

          {/* Feature section */}
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-400">
                Set your project apart
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Establish instant credibility
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Step aside from the noise and show your commitment by delivering
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {primaryFeatures.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="text-base font-semibold leading-7 text-white">
                      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-300">
                      <p className="flex-auto">{feature.description}</p>
                      {/* <p className="mt-6">
                        <a
                          href={feature.href}
                          className="text-sm font-semibold leading-6 text-indigo-400"
                        >
                          Learn more <span aria-hidden="true">→</span>
                        </a>
                      </p> */}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Feature section */}
          <div className="mt-32 sm:mt-56">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="text-base font-semibold leading-7 text-indigo-400">
                  Deploy with ease
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-3xl">
                  Everything you need to deploy your project
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Create project, set-up milestones, and seamlessly <br />
                  deploy your project within minutes.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden pt-16">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <Image
                  src="/half-image.png"
                  alt="App screenshot"
                  className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-white/10"
                  width={2432}
                  height={1442}
                />
                <div className="relative" aria-hidden="true">
                  <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-gray-900 pt-[7%]" />
                </div>
              </div>
            </div>
            <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
              <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
                {secondaryFeatures.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-indigo-500"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
              <h2 className="text-base font-semibold leading-8 text-indigo-400">
                A better future
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Creating happier communities
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Mass-adoption can only happen if we eliminate the stigmatization
                of crypto and scams. Build with us and work towards a better
                future.
              </p>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-3 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {stats.map((stat: any) => (
                <div
                  key={stat.id}
                  className="flex flex-col gap-y-3 border-l border-white/10 pl-6"
                >
                  <dt className="text-sm leading-6">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* CTA section */}
          <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
            <svg
              className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="1d4240dd-898f-445f-932d-e2872fd12de3"
                  width={200}
                  height={200}
                  x="50%"
                  y={0}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y={0} className="overflow-visible fill-gray-800/20">
                <path
                  d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)"
              />
            </svg>
            <div
              className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
              aria-hidden="true"
            >
              <div
                className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
                style={{
                  clipPath:
                    "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                }}
              />
            </div>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Create and deliver. <br /> Start using DailyGM today.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Set your project apart and build with transparency.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/create-gm"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started
                </Link>
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-white"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer aria-labelledby="footer-heading" className="relative">
          <h2 id="footer-heading" className="sr-only">
            Footer
          </h2>
          <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
            <div className="border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
              <div className="flex space-x-6 md:order-2">
                {footerNavigation.social.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-500 hover:text-gray-400"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                ))}
              </div>
              <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
                &copy; 2023 DailyGM. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
