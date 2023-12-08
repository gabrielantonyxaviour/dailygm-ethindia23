require("@chainlink/env-enc").config()
const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 3

const npmCommand = process.env.npm_lifecycle_event
const isTestEnvironment = npmCommand == "test" || npmCommand == "test:unit"

// Set EVM private keys (required)
const PRIVATE_KEY = process.env.PRIVATE_KEY

if (!isTestEnvironment && !PRIVATE_KEY) {
  throw Error("Set the PRIVATE_KEY environment variable with your EVM wallet private key")
}

const accounts = []
if (PRIVATE_KEY) {
  accounts.push(PRIVATE_KEY)
}
const networks = {
  avalancheFuji: {
    url: process.env.AVAX_FUJI || "UNSET",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: "snowtrace",
    chainId: 43113,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "AVAX",
    linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    linkWrapper: "0x9345AC54dA4D0B5Cda8CB749d8ef37e5F02BBb21",
    linkPriceFeed: "0x79c91fd4F8b3DaBEe17d286EB11cEE4D83521775", // LINK/AVAX
    functionsRouter: "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0",
    donId: "fun-avalanche-fuji-1",
    gatewayUrls: [
      "https://01.functions-gateway.testnet.chain.link/",
      "https://02.functions-gateway.testnet.chain.link/",
    ],
  },
}

module.exports = {
  networks,
}
