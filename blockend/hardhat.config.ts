require("@nomicfoundation/hardhat-toolbox");
require("./tasks");
const { networks } = require("./networks");

const REPORT_GAS =
  process.env.REPORT_GAS?.toLowerCase() === "true" ? true : false;

const SOLC_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1_000,
  },
};

const config = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: SOLC_SETTINGS,
      },
    ],
  },
  networks: {
    ...networks,
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: networks.avalancheFuji.verifyApiKey,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
};

export default config;
