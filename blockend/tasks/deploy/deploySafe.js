const { networks } = require("../../networks")

task("deploy-safe-implementation", "Deploys the DailyGMSafe contract")
  .addOptionalParam("verify", "Set to true to verify contract", false, types.boolean)
  .setAction(async (taskArgs) => {
    console.log(`Deploying DailyGMSafe contract to ${network.name}`)

    console.log("\n__Compiling Contracts__")
    await run("compile")
    const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
    const rewardToken = "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40"
    const sourceChainSelector = "12532609583862916517"
    const crossChainRotuer = "0x70499c328e1e2a3c41108bd3730f6670a44595d1"
    const linkToken = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    const dailyGmSafeFactory = await ethers.getContractFactory("DailyGMSafe")
    const dailyGmSafe = await dailyGmSafeFactory.deploy(
      entryPoint,
      rewardToken,
      sourceChainSelector,
      crossChainRotuer,
      linkToken
    )

    console.log(
      `\nWaiting ${networks[network.name].confirmations} blocks for transaction ${
        dailyGmSafe.deployTransaction.hash
      } to be confirmed...`
    )

    await dailyGmSafe.deployTransaction.wait(networks[network.name].confirmations)

    console.log("\nDeployed DailyGMSafe contract to:", dailyGmSafe.address)

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
          address: dailyGmSafe.address,
          constructorArguments: [entryPoint, rewardToken, sourceChainSelector, crossChainRotuer, linkToken],
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

    console.log(`\n DailyGMSafe contract deployed to ${dailyGmSafe.address} on ${network.name}`)
  })
