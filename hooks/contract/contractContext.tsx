import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Contract, ContractInterface, ethers } from "ethers";
import IslaGaugeAbi from "../../contracts/islagauge.json";
import bAnyMinterAbi from "../../contracts/bAnyMinter.json";
import Erc20Abi from "../../contracts/erc20.json";
import treasuryTbaAbi from "../../contracts/treasuryTba.json";
import bAnyTokenAbi from "../../contracts/bAny.json";
import {
  bAnyMinterNetwork,
  bAnyNetwork,
  daiNetwork,
  islaGaugeNetwork,
  treasuryTbaNetwork,
  usdcNetwork,
  usdtNetwork,
  islaNetwork,
} from "../../helpers/networks";
import { JsonRpcSigner } from "@ethersproject/providers";

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
      abi: IslaGaugeAbi,
      signer: null,
    });
    const [usdt, setUsdt] = useState<UsableContract>({
      name: usdtNetwork.name,
      address: usdtNetwork.address,
      symbol: usdtNetwork.symbol,
      decimal: usdtNetwork.decimals,
      contract: null,
      logo: usdtNetwork.logoURI,
      abi: Erc20Abi,
      signer: null,
    });
    const [usdc, setUsdc] = useState<UsableContract>({
      name: usdcNetwork.name,
      address: usdcNetwork.address,
      symbol: usdcNetwork.symbol,
      decimal: usdcNetwork.decimals,
      contract: null,
      logo: usdcNetwork.logoURI,
      abi: Erc20Abi,
      signer: null,
    });
    const [dai, setDai] = useState<UsableContract>({
      name: daiNetwork.name,
      address: daiNetwork.address,
      symbol: daiNetwork.symbol,
      decimal: daiNetwork.decimals,
      contract: null,
      logo: daiNetwork.logoURI,
      abi: Erc20Abi,
      signer: null,
    });
    const [bAnyMinter, setBanyMinter] = useState<UsableContract>({
      name: bAnyMinterNetwork.name,
      address: bAnyMinterNetwork.address,
      symbol: bAnyMinterNetwork.symbol,
      decimal: bAnyMinterNetwork.decimals,
      contract: null,
      logo: bAnyMinterNetwork.logoURI,
      abi: bAnyMinterAbi,
      signer: null,
    });
    const [treasuryTba, setTreasuryTba] = useState<UsableContract>({
      name: treasuryTbaNetwork.name,
      address: treasuryTbaNetwork.address,
      symbol: treasuryTbaNetwork.symbol,
      decimal: treasuryTbaNetwork.decimals,
      contract: null,
      logo: treasuryTbaNetwork.logoURI,
      abi: treasuryTbaAbi,
      signer: null,
    });
    const [bAnyToken, setbAnyToken] = useState<UsableContract>({
      name: bAnyNetwork.name,
      address: bAnyNetwork.address,
      symbol: bAnyNetwork.symbol,
      decimal: bAnyNetwork.decimals,
      contract: null,
      logo: bAnyNetwork.logoURI,
      abi: bAnyTokenAbi,
      signer: null,
    });
    const [islaToken, setIslaToken] = useState<UsableContract>({
      name: islaNetwork.name,
      address: islaNetwork.address,
      symbol: islaNetwork.symbol,
      decimal: islaNetwork.decimals,
      contract: null,
      logo: islaNetwork.logoURI,
      abi: Erc20Abi,
      signer: null,
    });
    useEffect(() => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const islaGaugeContract = new ethers.Contract(
        islaGauge.address,
        islaGauge.abi,
        provider
      );
      const usdcContract = new ethers.Contract(
        usdc.address,
        usdc.abi,
        provider
      );
      const usdtContract = new ethers.Contract(
        usdt.address,
        usdt.abi,
        provider
      );
      const daiContract = new ethers.Contract(dai.address, dai.abi, provider);
      const bAnyMinterContract = new ethers.Contract(
        bAnyMinter.address,
        bAnyMinter.abi,
        provider
      );
      const treasuryTbaContract = new ethers.Contract(
        treasuryTba.address,
        treasuryTba.abi,
        provider
      );
      const bAnyContract = new ethers.Contract(
        bAnyToken.address,
        bAnyToken.abi,
        provider
      );
      const islaContract = new ethers.Contract(
        islaToken.address,
        islaToken.abi,
        provider
      );
      setIslaGauge({ ...islaGauge, contract: islaGaugeContract, signer: signer });
      setUsdc({ ...usdc, contract: usdcContract, signer: signer });
      setUsdt({ ...usdt, contract: usdtContract, signer: signer });
      setDai({ ...dai, contract: daiContract, signer: signer });
      setBanyMinter({
        ...bAnyMinter,
        contract: bAnyMinterContract,
        signer: signer,
      });
      setTreasuryTba({
        ...treasuryTba,
        contract: treasuryTbaContract,
        signer: signer,
      });
      setbAnyToken({
        ...bAnyToken,
        contract: bAnyContract,
        signer: signer,
      });
      setIslaToken({
        ...islaToken,
        contract: islaContract,
        signer: signer,
      });
    }, []);

    const contractProvider = useMemo(
      () => ({
        islaGauge,
        usdc,
        usdt,
        dai,
        bAnyMinter,
        treasuryTba,
        bAnyToken,
        islaToken,
      }),
      [islaGauge, usdc, usdt, dai, bAnyMinter, treasuryTba, bAnyToken, islaToken]
    );
    return (
      <ContractContext.Provider
        value={{
          islaGauge: contractProvider.islaGauge,
          usdc: contractProvider.usdc,
          usdt: contractProvider.usdt,
          dai: contractProvider.dai,
          bAnyMinter: contractProvider.bAnyMinter,
          treasuryTba: contractProvider.treasuryTba,
          bAnyToken: contractProvider.bAnyToken,
          islaToken: contractProvider.islaToken,
        }}
      >
        {children}
      </ContractContext.Provider>
    );
  } else {
    //@ts-ignore
    return <ContractContext.Provider>{children}</ContractContext.Provider>;
  }
};

type ContractContextData = {
  [key: string]: UsableContract;
} | null;

export type UsableContract = {
  name: string;
  symbol: string;
  logo: string;
  contract: Contract | null;
  abi: ContractInterface;
  address: string;
  decimal: number | null;
  signer: null | JsonRpcSigner;
};
