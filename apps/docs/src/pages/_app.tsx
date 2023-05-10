import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode="system" />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
