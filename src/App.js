import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { routes } from './routes';

import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import Navbar from "./components/Navbar";
import Main from './components/Main';
import WalletCard from './components/WalletCard';

import tokenABI from "./contract/abi.json";

function App() {
  const [chainId, setChainId] = useState();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [ISLABalance, setBalance] = useState();
  const [netErr, setNetErr] = useState(false);
  const tokenAddress = "0xFE6A2342f7C5D234E8496dF12c468Be17e0c181F";
  
  let provider;
  const web3Modal = useRef();

  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "INFURA_ID"
        }
      }
    };
  
    web3Modal.current = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions
    });
  });

  const fetchAccountData = async () => {
    const web3 = new Web3(provider);
    // Get chain id to verify network
    const chainid = await web3.eth.getChainId();
    setNetErr(chainid !== 137);
    setChainId(chainid);
    // Get account
    const accounts = await web3.eth.getAccounts();
    setSelectedAccount(accounts[0]);
    // Get balance of Ether
    const balance = await web3.eth.getBalance(accounts[0]);
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    setBalance(humanFriendlyBalance);
    // Get balance of ISLA Token
    // var tokenInst = new web3.eth.Contract(tokenABI, tokenAddress);
    // const balance = await tokenInst.methods.balanceOf(selectedAccount).call();
  };

  const handleConnectWallet = async () => {
    try {
      provider = await web3Modal.current.connect();
      fetchAccountData();
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
      fetchAccountData();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      fetchAccountData();
    });
  };

  const handleDisconnectWallet = async () => {
    if(provider) {
      await provider.close();
      await web3Modal.current.clearCachedProvider();
      provider = null;
    }  
    setSelectedAccount("");
    setBalance(null);
    setNetErr(false);
  };
  return (
    <div className="App">
      <Router>
        <Navbar
          handleConnectWallet={handleConnectWallet}
          handleDisconnectWallet={handleDisconnectWallet}
          selectedAccount={selectedAccount}
          netErr={netErr}
        />
        {selectedAccount && <WalletCard selectedAccount={selectedAccount} balance={ISLABalance} handleDisconnectWallet={handleDisconnectWallet} />}
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={<Main><route.body/></Main>}
            />
          ))}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
