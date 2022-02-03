import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AbiItem } from "web3-utils";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import IslaGaugeAbi from "../../contracts/islagauge.json";
import bAnyMinterAbi from "../../contracts/bAnyMinter.json";
import Erc20Abi from "../../contracts/erc20.json";
import {
  bAnyMinterNetwork,
  daiNetwork,
  islaGaugeNetwork,
  usdcNetwork,
  usdtNetwork,
} from "../../helpers/networks";

export const useContractContext = () => {
  const contractContext = useContext(ContractContext);
  if (!contractContext) {
    throw new Error(
      "useContractContext() can only be used inside of <ContractContextProvider />, " +
        "please declare it at a higher level."
    );
  }
  const contractProvider = contractContext;
  return useMemo(() => {
    return { ...contractProvider };
  }, [contractContext]);
};

const ContractContext = React.createContext<ContractContextData>(null);

export const ContractContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  if (typeof window !== "undefined") {
    const [islaGauge, setIslaGauge] = useState<UsableContract>({
      name: islaGaugeNetwork.name,
      address: islaGaugeNetwork.address,
      symbol: islaGaugeNetwork.symbol,
      decimal: islaGaugeNetwork.decimals,
      contract: null,
      logo: islaGaugeNetwork.logoURI,
      abi: IslaGaugeAbi as AbiItem[],
    });
    const [usdt, setUsdt] = useState<UsableContract>({
      name: usdtNetwork.name,
      address: usdtNetwork.address,
      symbol: usdtNetwork.symbol,
      decimal: usdtNetwork.decimals,
      contract: null,
      logo: usdtNetwork.logoURI,
      abi: Erc20Abi as AbiItem[],
    });
    const [usdc, setUsdc] = useState<UsableContract>({
      name: usdcNetwork.name,
      address: usdcNetwork.address,
      symbol: usdcNetwork.symbol,
      decimal: usdcNetwork.decimals,
      contract: null,
      logo: usdcNetwork.logoURI,
      abi: Erc20Abi as AbiItem[],
    });
    const [dai, setDai] = useState<UsableContract>({
      name: daiNetwork.name,
      address: daiNetwork.address,
      symbol: daiNetwork.symbol,
      decimal: daiNetwork.decimals,
      contract: null,
      logo: daiNetwork.logoURI,
      abi: Erc20Abi as AbiItem[],
    });
    const [bAnyMinter, setBanyMinter] = useState<UsableContract>({
      name: bAnyMinterNetwork.name,
      address: bAnyMinterNetwork.address,
      symbol: bAnyMinterNetwork.symbol,
      decimal: bAnyMinterNetwork.decimals,
      contract: null,
      logo: bAnyMinterNetwork.logoURI,
      abi: bAnyMinterAbi as AbiItem[],
    });
    useEffect(() => {
      const web3 = new Web3(Web3.givenProvider);
      const islaContract = new web3.eth.Contract(
        islaGauge.abi,
        islaGauge.address
      );
      const usdcContract = new web3.eth.Contract(usdc.abi, usdc.address);
      const usdtContract = new web3.eth.Contract(usdt.abi, usdt.address);
      const daiContract = new web3.eth.Contract(dai.abi, dai.address);
      const bAnyMinterContract = new web3.eth.Contract(bAnyMinter.abi, bAnyMinter.address);
      setIslaGauge({ ...islaGauge, contract: islaContract });
      setUsdc({ ...usdc, contract: usdcContract });
      setUsdt({ ...usdt, contract: usdtContract });
      setDai({ ...dai, contract: daiContract });
      setBanyMinter({...bAnyMinter, contract: bAnyMinterContract});

     
    }, []);

    const contractProvider = useMemo(
      () => ({
        islaGauge,
        usdc,
        usdt,
        dai,
        bAnyMinter
      }),
      [islaGauge, usdc, usdt, dai, bAnyMinter]
    );
    return (
      <ContractContext.Provider value={{ "islaGauge": islaGauge, "usdc":usdc, "usdt": usdt, "dai":dai, "bAnyMinter": bAnyMinter }}>
        {children}
      </ContractContext.Provider>
    );
  } else {
    //@ts-ignore
    return <ContractContext.Provider>{children}</ContractContext.Provider>;
  }
};

type ContractContextData = {
  [key:string]: UsableContract;
} | null;

export type UsableContract = {
  name: string;
  symbol: string;
  logo: string;
  contract: Contract | null;
  abi: AbiItem[];
  address: string;
  decimal: number | null;
};
