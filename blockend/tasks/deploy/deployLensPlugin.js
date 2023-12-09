const { networks } = require("../../networks")
const fs = require("fs")

task("deploy-lens-plugin", "Deploys the LensFollowPlugin contract")
  .addOptionalParam("verify", "Set to true to verify contract", false, types.boolean)
  .setAction(async (taskArgs) => {
    console.log(`Deploying LensFollowPlugin contract to ${network.name}`)

    const manager = "0x70DAAa5df4cA762dE7956D13f3519a504753eB13"
    const donId = "0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000"
    const functionsRouter = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C"
    const crossChainRouter = "0x70499c328e1e2a3c41108bd3730f6670a44595d1"
    const link = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    const sourceCode = fs.readFileSync("./functions-lens-follow.js").toString()
    console.log("\n__Compiling Contracts__")
    await run("compile")

    const lensPluginFactory = await ethers.getContractFactory("LensFollowPlugin")
    const lensPlugin = await lensPluginFactory.deploy(
      manager,
      donId,
      functionsRouter,
      crossChainRouter,
      link,
      sourceCode
    )

    console.log(
      `\nWaiting ${networks[network.name].confirmations} blocks for transaction ${
        lensPlugin.deployTransaction.hash
      } to be confirmed...`
    )

    await lensPlugin.deployTransaction.wait(networks[network.name].confirmations)

    console.log("\nDeployed LensFollowPlugin contract to:", lensPlugin.address)

    if (network.name === "localFunctionsTestnet") {
      return
    }

    const verifyContract = taskArgs.verify
    if (
      network.name !== "localFunctionsTestnet" &&
      verifyContract &&
      !!networks[network.name].verifyApiKey &&
      networks[network.name].verifyApiKey !== "UNSET"
    ) {
      try {
        console.log("\nVerifying contract...")
        await run("verify:verify", {
          address: lensPlugin.address,
          constructorArguments: [manager, donId, functionsRouter, crossChainRouter, link, sourceCode],
        })
        console.log("Contract verified")
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log(
            "Error verifying contract.  Ensure you are waiting for enough confirmation blocks, delete the build folder and try again."
          )
          console.log(error)
        } else {
          console.log("Contract already verified")
        }
      }
    } else if (verifyContract && network.name !== "localFunctionsTestnet") {
      console.log(
        "\nPOLYGONSCAN_API_KEY, ETHERSCAN_API_KEY or FUJI_SNOWTRACE_API_KEY is missing. Skipping contract verification..."
      )
    }

    console.log(`\n LensFollowPlugin contract deployed to ${lensPlugin.address} on ${network.name}`)
  })
