import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ContractContextProvider, Web3ContextProvider } from "../hooks";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ContextProvider>
      <ContractContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ContractContextProvider>
    </Web3ContextProvider>
  );
}

export default MyApp;
