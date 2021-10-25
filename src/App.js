import './App.css';
import Navbar from "./components/Navbar";
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { routes } from './routes';
import Main from './components/Main';

import React, { useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

function App() {
  const [chainId, setChainId] = useState();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [ISLABalance, setBalance] = useState();
  const [netErr, setNetErr] = useState(false);
  const tokenAddress = "0x81067076dcb7d3168ccf7036117b9d72051205e2";
  
  let provider;
  let web3Modal;

  React.useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "INFURA_ID"
        }
      }
    };
  
    web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions
    });
  });

  const fetchAccountData = async () => {
    const web3 = new Web3(provider);
    const chainid = await web3.eth.getChainId();
    setNetErr(chainid != 137);
    setChainId(chainid);
    const accounts = await web3.eth.getAccounts();
    setSelectedAccount(accounts[0]);
    const balance = await web3.eth.getBalance(accounts[0]);
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    setBalance(humanFriendlyBalance);
  };

  const handleConnectWallet = async () => {
    try {
      provider = await web3Modal.connect();
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
      await web3Modal.clearCachedProvider();
      provider = null;
    }  
    setSelectedAccount("");
    setBalance(null);
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
        <div>
          {selectedAccount}
        </div>
        <div>
          {ISLABalance}
        </div>
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
