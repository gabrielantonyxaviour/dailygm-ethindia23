const { networks } = require("../../networks")

task("deploy-safe-registry", "Deploys the SafeProtocolRegistry contract")
  .addOptionalParam("verify", "Set to true to verify contract", false, types.boolean)
  .setAction(async (taskArgs) => {
    console.log(`Deploying SafeProtocolRegistry contract to ${network.name}`)

    console.log("\n__Compiling Contracts__")
    await run("compile")

    const safeRegistryFactory = await ethers.getContractFactory("SafeProtocolRegistry")
    const safeRegistry = await safeRegistryFactory.deploy("0x0429A2Da7884CA14E53142988D5845952fE4DF6a")

    console.log(
      `\nWaiting ${networks[network.name].confirmations} blocks for transaction ${
        safeRegistry.deployTransaction.hash
      } to be confirmed...`
    )

    await safeRegistry.deployTransaction.wait(networks[network.name].confirmations)

    console.log("\nDeployed SafeProtocolRegistry contract to:", safeRegistry.address)

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
          address: safeRegistry.address,
          constructorArguments: ["0x0429A2Da7884CA14E53142988D5845952fE4DF6a"],
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

    console.log(`\n SafeProtocolRegistry contract deployed to ${safeRegistry.address} on ${network.name}`)
  })
