import { useCallback } from "react";
import { Contract } from "web3-eth-contract";
import { evaluateTransaction } from "./evaluateTransaction";

// export const fetchErc20Balance = async(contract: Contract, address: string) => {
//   const balance = await contract?.methods?.balanceOf(address).call();
//   return balance;
// }

export const fetchErc20Balance = (): ((
  contract: Contract | null,
  address: string
) => any) => {
  return useCallback(async (contract: Contract | null, address: string) => {
    return await evaluateTransaction(contract, "balanceOf", [address]);
  }, []);
};
