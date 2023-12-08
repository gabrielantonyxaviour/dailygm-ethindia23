const { networks } = require("../../networks")

task("deploy-lens-plugin", "Deploys the LensFollowPlugin contract")
  .addOptionalParam("verify", "Set to true to verify contract", false, types.boolean)
  .setAction(async (taskArgs) => {
    console.log(`Deploying LensFollowPlugin contract to ${network.name}`)

    console.log("\n__Compiling Contracts__")
    await run("compile")

    const lensPluginFactory = await ethers.getContractFactory("LensFollowPlugin")
    const lensPlugin = await lensPluginFactory.deploy()

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
          constructorArguments: [],
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
