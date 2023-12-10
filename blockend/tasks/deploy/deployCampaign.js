const { networks } = require("../../networks")

task("deploy-campaign", "Deploys the DailyGMCampaign contract")
  .addOptionalParam("verify", "Set to true to verify contract", false, types.boolean)
  .setAction(async (taskArgs) => {
    console.log(`Deploying DailyGMCampaign contract to ${network.name}`)

    console.log("\n__Compiling Contracts__")
    await run("compile")

    const safe = "0x41675C099F32341bf84BFc5382aF534df5C7461a"
    const safeProxyFactory = "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67"
    const manager = "0xeb75D9BF5997b14919908808f088FcC0ac0B2790"

    const campaignFactory = await ethers.getContractFactory("DailyGMCampaign")
    const campaign = await campaignFactory.deploy(safe, safeProxyFactory, manager)

    console.log(
      `\nWaiting ${networks[network.name].confirmations} blocks for transaction ${
        campaign.deployTransaction.hash
      } to be confirmed...`
    )

    await campaign.deployTransaction.wait(networks[network.name].confirmations)

    console.log("\nDeployed DailyGMCampaign contract to:", campaign.address)

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
          address: campaign.address,
          constructorArguments: [safe, safeProxyFactory, manager],
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

    console.log(`\n DailyGMCampaign contract deployed to ${campaign.address} on ${network.name}`)
  })
