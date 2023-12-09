if (secrets.airstackAuthToken == "" || secrets.airstackAuthToken == undefined) {
  throw Error("AIRSTACK AUTH TOKEN NOT SET");
}

const AUTH_TOKEN = secrets.airstackAuthToken;

const callerAddress = args[0];

const API_URL = "https://api.airstack.xyz/graphql";

const QUERY =
  'query MyQuery { XMTPs(input: {blockchain: ALL, filter: {owner: {_eq: "' +
  callerAddress +
  '"}}}) { XMTP { isXMTPEnabled } } }';
const AUTH_HEADERS = {
  Authorization: `${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};
let isEnabled;
try {
  const xmtpResponse = await Functions.makeHttpRequest({
    url: `${API_URL}`,
    method: "POST",
    headers: AUTH_HEADERS,
    data: { query: QUERY },
  });
  isEnabled = xmtpResponse.data.data.XMTPs["XMTP"][0].isXMTPEnabled;
} catch (err) {
  throw Error("API FETCH FAILED");
}

if (isEnabled == null || isEnabled == undefined) {
  throw Error("XMTP no data");
}
if (isEnabled == true) {
  return Functions.encodeString("XMTP is enabled");
} else {
  throw Error("VERIFICATION UNSUCCESSFUL");
}
