import { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Image from "next/image";
import matic from "../../public/matic.svg";
import times from "../../public/icons/times.svg";
import { useContractContext, useWeb3Context } from "../../hooks";
import { fetchErc20Balance, getTreasuryTba } from "../../helpers/methods";
import { decimalToExact } from "../../helpers/conversion";

const WalletConnect = () => {
  const {
    connect,
    disconnect,
    connected,
    address,
    providerChainID,
    checkWrongNetwork,
    hasCachedProvider,
  } = useWeb3Context();
  const tokens = useContractContext();

  const [isConnected, setConnected] = useState(connected);
  const [tba, setTba] = useState<number | null>(null);
  const [islaTotalBalance, setIslaTotalBalance] = useState(0);
  const [banyTotalBalance, setBanyTotalBalance] = useState(0);
  const getTba = getTreasuryTba();
  const getBalance = fetchErc20Balance();

  const getTotalBalance = async () => {
    const banyBalance = await getBalance(tokens["bAnyToken"].contract, address);
    const islaBalance = await getBalance(tokens["islaToken"].contract, address);
    let userBanyBalance;
    let userIslaBalance;
    if (tokens && tokens["bAnyToken"].decimal && tokens["islaToken"].decimal) {
      const userBanyBalance = decimalToExact(
        banyBalance,
        tokens["bAnyToken"].decimal
      );
      const userIslaBalance = decimalToExact(
        islaBalance,
        tokens["islaToken"].decimal
      );
      setIslaTotalBalance(userIslaBalance);
      setBanyTotalBalance(userBanyBalance);
    } else {
      userBanyBalance = 0;
      userIslaBalance = 0;
      setBanyTotalBalance(userBanyBalance);
      setIslaTotalBalance(userIslaBalance);
    }
  };
  const getTbaBalance = async () => {
    // console.log('apple')
    const tba = await getTba(tokens["treasuryTba"].contract);
    const tbaNumber = decimalToExact(tba, tokens["bAnyToken"].decimal ?? 0);
    setTba(tbaNumber);
  };

  let buttonText = "Connect Wallet";
  let clickFunc: any = connect;

  if (isConnected) {
    buttonText =
      address.substr(0, 6) + "..." + address.substr(address.length - 4);
    clickFunc = () => {};
  }

  if (isConnected && providerChainID !== 137) {
    buttonText = "Wrong Network";
    clickFunc = () => {
      checkWrongNetwork();
    };
  }

  const openAddressOnExplorer = () => {
    const url = "https://polygonscan.com/address/" + address;
    //@ts-ignore
    window.open(url, "_blank").focus();
  };

  useEffect(() => {
    if (hasCachedProvider()) {
      connect();
    }
  }, []);

  useEffect(() => {
    setConnected(connected);
  }, [connected]);

  useEffect(() => {
    if (isConnected && connected && address && providerChainID == 137) {
      getTbaBalance();
      getTotalBalance();
    }
  }, [connected, isConnected, address, providerChainID]);

  const styles = Styles(buttonText);

  return (
    <div className={css(styles.container)}>
      {isConnected && buttonText !== "Wrong Network" && (
        <>
          <button className={css(styles.balance)}>
            {banyTotalBalance} BANY
          </button>
          <button className={css(styles.balance)}>{tba} TBA</button>
          <button className={css(styles.balance)}>
            {islaTotalBalance} ISLA
          </button>
        </>
      )}

      <button className={css(styles.connectButton)} onClick={clickFunc}>
        {isConnected && providerChainID === 137 && (
          <span
            className={css(styles.polyButton)}
            onClick={openAddressOnExplorer}
          >
            <Image src={matic} alt="" />
          </span>
        )}

        {buttonText}
      </button>

      {isConnected && (
        <button className={css(styles.logout)} onClick={disconnect}>
          <Image src={times} layout="fill" alt="" />
        </button>
      )}
    </div>
  );
};

const Styles = (buttonText: string) => {
  return StyleSheet.create({
    container: {
      display: "flex",
      alignItems: "center",
    },
    connectButton: {
      backgroundColor: buttonText === "Wrong Network" ? "#FE4141" : "#FFFFFF",
      color: buttonText === "Wrong Network" ? "#FFFFFF" : "#00C8D4",
      cursor:
        buttonText === "Wrong Network" || buttonText === "Connect Wallet"
          ? "pointer"
          : "default",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      border: "2px solid #FFFFFF",
      ":nth-child(n) > span": {
        marginRight: "0.5em",
      },
    },
    polyButton: {
      display: "flex",
      cursor: "pointer",
    },
    balance: {
      borderRadius: "8px",
      cursor: "default",
      backgroundColor: "transparent",
      border: "2px solid #FFFFFF",
      color: "#FFFFFF",
      marginRight: "1em",
    },
    logout: {
      backgroundColor: "transparent",
      color: "#FFFFFF",
      paddingRight: 0,
      height: "1em",
      width: "1em",
      position: "relative",
      display: "inline-block",
      marginLeft: "1em",
    },
    userIcon: { paddingRight: "0.5em", height: "1em", width: "1em" },
  });
};

export default WalletConnect;
