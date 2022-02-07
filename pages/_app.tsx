import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ContractContextProvider, Web3ContextProvider } from "../hooks";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
import store from "../store/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ContextProvider>
      <ContractContextProvider>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </ContractContextProvider>
    </Web3ContextProvider>
  );
}

export default MyApp;
