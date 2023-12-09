import "@/styles/globals.css";
import "@/styles/index.scss";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { AnonAadhaarProvider } from "anon-aadhaar-react";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  optimism,
  optimismGoerli,
  zora,
  goerli,
  base,
  baseGoerli,
  polygonMumbai,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const app_id = process.env.NEXT_PUBLIC_APP_ID || "";

const { chains, publicClient } = configureChains(
  [goerli, polygonMumbai],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    } as any),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "DailyGM",
  projectId: "be406d96fe3535516143cb4e26e5c857",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AnonAadhaarProvider _appId={app_id}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#4f46e5",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
          coolMode
          chains={chains}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </AnonAadhaarProvider>
  );
}
