"use client";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import type { Transport } from "viem";
import { createConfig, http } from "wagmi";
import {
  mainnet,
  // sepolia,
  // polygon,
  // polygonMumbai,
  // optimism,
  // optimismGoerli,
  // arbitrum,
  // arbitrumGoerli,
  // zkSync,
  // zkSyncSepoliaTestnet,
  // linea,
  // lineaTestnet,
  // base,
  // baseGoerli,
  // bsc,
  // bscTestnet,
  gnosis,
} from "wagmi/chains";
// import { SafeConnector } from 'wagmi/connectora';

// import linea_logo from "../public/img/linea_logo.png";
// import lineaTesnet_logo from "../public/img/lineaTesnet_logo.png";
// import zksync_logo from "../public/img/zksync_logo.svg";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error(
    "WalletConnect project ID is not defined. Please check your environment variables.",
  );
}

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        safeWallet,
        walletConnectWallet,
        rainbowWallet,
        // ledgerWallet,
        // rabbyWallet,
        coinbaseWallet,
        // argentWallet,
      ],
    },
  ],
  { appName: "xxxxxxxxxxxx", projectId: walletConnectProjectId },
);

// Fix missing icons
// const customZkSyncSepoliaTestnet = { ...zkSyncSepoliaTestnet, iconUrl: zksync_logo.src };
// const customLinea = { ...linea, iconUrl: linea_logo.src };
// const customLineaTestnet = { ...lineaTestnet, iconUrl: lineaTesnet_logo.src };
const customGnosis = {
  ...gnosis,
  iconUrl:
    "https://assets-global.website-files.com/63692bf32544bee8b1836ea6/636a6e764bdb11a70341fab4_owl-forest-p-500.png",
};

const transports: Record<number, Transport> = {
  [mainnet.id]: http(),
  // [sepolia.id]: http(),
  // [polygon.id]: http(),
  // [polygonMumbai.id]: http(),
  // [optimism.id]: http(),
  // [optimismGoerli.id]: http(),
  // [arbitrum.id]: http(),
  // [arbitrumGoerli.id]: http(),
  // [zkSync.id]: http(),
  // [zkSyncSepoliaTestnet.id]: http(),
  // [linea.id]: http(),
  // [lineaTestnet.id]: http(),
  // [base.id]: http(),
  // [baseGoerli.id]: http(),
  // [bsc.id]: http(),
  // [bscTestnet.id]: http(),
  [gnosis.id]: http(),
};
export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    // sepolia,
    // polygon,
    // polygonMumbai,
    // optimism,
    // optimismGoerli,
    // arbitrum,
    // arbitrumGoerli,
    // customLinea,
    // customLineaTestnet,
    // zkSync,
    // customZkSyncSepoliaTestnet,
    // base,
    // baseGoerli,
    // bsc,
    // bscTestnet,
    customGnosis,
  ],
  connectors,
  transports,
  ssr: true,
});
