import React, {
  useState,
  ReactElement,
  useContext,
  useMemo,
  useCallback,
} from "react";
import Web3Modal from "web3modal";
import {
  StaticJsonRpcProvider,
  JsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { switchNetwork } from "../../helpers/switchNetwork";
import { ethers } from "ethers";

type onChainProvider = {
  connect: () => Promise<Web3Provider>;
  disconnect: () => void;
  checkWrongNetwork: () => Promise<boolean>;
  provider: JsonRpcProvider;
  address: string;
  connected: Boolean;
  web3Modal: Web3Modal;
  defaultChainId: number;
  providerChainID: number;
  hasCachedProvider: () => boolean;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " +
        "please declare it at a higher level."
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const useChainId = () => {
  const { providerChainID } = useWeb3Context();
  return providerChainID;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  if (typeof window !== "undefined") {
    const [connected, setConnected] = useState(false);
    const defaultChainId = 137;
    const [providerChainID, setProviderChainID] = useState(defaultChainId);
    const [address, setAddress] = useState("");
    const uri = "https://polygon-rpc.com";
    const [provider, setProvider] = useState<JsonRpcProvider>(
      new StaticJsonRpcProvider(uri)
    );

    const [web3Modal] = useState<Web3Modal>(
      new Web3Modal({
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                [defaultChainId]: uri,
              },
            },
          },
        },
      })
    );

    const hasCachedProvider = (): boolean => {
      if (!web3Modal) return false;
      if (!web3Modal.cachedProvider) return false;
      return true;
    };

    const _initListeners = useCallback(
      (rawProvider: JsonRpcProvider) => {
        if (!rawProvider.on) {
          return;
        }

        rawProvider.on("accountsChanged", () =>
          setTimeout(() => window.location.reload(), 1)
        );

        rawProvider.on("chainChanged", async (chain: number) => {
          changeNetwork(chain);
        });

        rawProvider.on("network", (_newNetwork, oldNetwork) => {
          if (!oldNetwork) return;
          window.location.reload();
        });
      },
      [provider]
    );

    const changeNetwork = async (otherChainID: number) => {
      const network = Number(otherChainID);

      setProviderChainID(network);
    };

    const connect = useCallback(async () => {
      const rawProvider = await web3Modal.connect();

      _initListeners(rawProvider);

      const connectedProvider = new ethers.providers.Web3Provider(rawProvider);

      const chainId = await connectedProvider
        .getNetwork()
        .then((network) => Number(network.chainId));
      const connectedAddress = await connectedProvider.getSigner().getAddress();

      setAddress(connectedAddress);

      setProviderChainID(chainId);

      if (defaultChainId === chainId) {
        setProvider(connectedProvider);
      }

      setConnected(true);

      return connectedProvider;
    }, [provider, web3Modal, connected]);

    const checkWrongNetwork = async (): Promise<boolean> => {
      if (providerChainID !== defaultChainId) {
        await switchNetwork();
        window.location.reload();
        return true;
      }

      return false;
    };

    const disconnect = useCallback(async () => {
      web3Modal.clearCachedProvider();
      setConnected(false);

      setTimeout(() => {
        window.location.reload();
      }, 1);
    }, [provider, web3Modal, connected]);

    const onChainProvider = useMemo(
      () => ({
        connect,
        disconnect,
        hasCachedProvider,
        provider,
        connected,
        address,
        defaultChainId,
        web3Modal,
        providerChainID,
        checkWrongNetwork,
      }),
      [
        connect,
        disconnect,
        hasCachedProvider,
        provider,
        connected,
        address,
        defaultChainId,
        web3Modal,
        providerChainID,
        checkWrongNetwork,
      ]
    );
    return (
      <Web3Context.Provider value={{ onChainProvider }}>
        {children}
      </Web3Context.Provider>
    );
  } else {
    //@ts-ignore
    return <Web3Context.Provider>{children}</Web3Context.Provider>;
  }
};
