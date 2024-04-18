"use client";
import { type ReactNode, useState, useEffect } from "react";

import { CacheProvider } from "@chakra-ui/next-js";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
// @ts-expect-error: Theme is not exported by @rainbow-me/rainbowkit
import { RainbowKitProvider, darkTheme, Theme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import merge from "lodash.merge";
import { WagmiProvider } from "wagmi";

import { wagmiConfig } from "@/wagmi";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const queryClient = new QueryClient();

  const theme = extendTheme({ initialColorMode: "dark", useSystemColorMode: false });

  const appInfo = {
    appName: "keza",
  };
  const myTheme = merge(darkTheme(), {
    colors: {
      accentColor: "#358597",
    },
  } as Theme);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider resetCSS theme={theme}>
            <RainbowKitProvider coolMode appInfo={appInfo} theme={myTheme}>
              {mounted && children}
            </RainbowKitProvider>
          </ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
