import React, { useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import * as styles from "./style.module.scss";
import ErrMessage from "../ErrorMessage";
import abi from '../../contract/abi.json';

export default function ConnectWallet() {
  const [address, setAddress] = useState("");
  const [ISLABalance, setBalance] = useState();
  const [netErr, setNetErr] = useState(false);
  const tokenAddress = "0x81067076dcb7d3168ccf7036117b9d72051205e2";

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "INFURA_ID"
      }
    }
  };

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions
  });

  const handleConnectWallet = async () => {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const chainId = await web3.eth.getChainId();
    setAddress(provider.selectedAddress);
    setNetErr(chainId !== 137);
  };

  const handleDisconnectWallet = async () => {
  };

  React.useEffect(() => {
  });

  return (
    <>
    <div className={styles.btnWrapper}>
      {address ? 
        (<button onClick={handleDisconnectWallet}>{`${address.slice(0, 5)}...${address.slice(-3)}`}</button>) :
        (<button onClick={handleConnectWallet}>Connect</button>)
      }
    </div>
    {netErr && (<ErrMessage message="Please connect to Polygon network!" />)}
    </>
  );
}
