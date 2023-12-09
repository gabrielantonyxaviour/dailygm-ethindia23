const callerAddress = args[0];
const verifyHandle = arg[1];
const API_URL = "https://api.airstack.xyz/graphql";

const QUERY = `query isFollowing {
    Wallet(input: {identity: "lens/@${verifyHandle}", blockchain: polygon}) {
      socialFollowings(
        input: {filter: {identity: {_in: ["${callerAddress}"]}, dappName: {_eq: lens}}}
      ) {
        Following {
          dappName
          dappSlug
          followingProfileId
          followerProfileId
          followerAddress {
            addresses
            socials {
              profileName
            }
            domains {
              name
            }
          }
        }
      }
    }
  }`;
const AUTH_HEADERS = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

try {
  const lensResponse = await Functions.makeHttpRequest({
    url: `${API_URL}`,
    method: "POST",
    headers: AUTH_HEADERS,
    data: { quert: QUERY },
  });
} catch (err) {
  throw Error("API FETCH FAILED");
}

const isFollowing =
  lensResponse.data.Wallet.socialFollowings.Following.length > 0;

if (isFollowing == null || isFollowing == undefined) {
  throw Error("LENS no data");
}
if (isFollowing == true) {
  return Functions.encodeString("VERIFICATION SUCCESS");
} else {
  throw Error("VERIFICATION UNSUCCESSFUL");
}
