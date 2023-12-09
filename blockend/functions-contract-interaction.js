const contractAddress = args[0]
const fromBlock = args[1]
const encodedEventSignature = args[2]
const topicIndex = arg[3]
const encodedAddress = args[4]

const QUERY = `https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=${fromBlock}&address=${contractAddress}&topic0=${encodedEventSignature}&topic0_${topicIndex}_opr=and&topic${topicIndex}=${encodedAddress}&apikey=TBZ6CSAHPBA982SDPZIR4SJB7AEBQN2ZQI`
const AUTH_HEADERS = {
  "Content-Type": "application/json",
}

let isDone

try {
  const interactionResponse = await Functions.makeHttpRequest({
    url: `${QUERY}`,
    method: "GET",
    headers: AUTH_HEADERS,
  })
  isDone = interactionResponse.data.result.length > 0
} catch (err) {
  throw Error("API FETCH FAILED")
}

if (isDone == null || isDone == undefined) {
  throw Error("POLYGONSCAN no data")
}
if (isDone == true) {
  return Functions.encodeString("VERIFICATION SUCCESS")
} else {
  throw Error("VERIFICATION UNSUCCESSFUL")
}
