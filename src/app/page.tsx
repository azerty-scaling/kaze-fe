"use client";
import { Box, Flex } from "@chakra-ui/react";

import { Footer, Header } from "@/components";
import { MainPane } from "@/panes/MainPane";

export default function Home() {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />

      <Box as="main" flex={1} p={4}>
        <MainPane />
      </Box>

      <Footer />
    </Flex>
  );
}
