import { useCallback } from "react";
import { Contract } from "ethers";
import { evaluateTransaction } from "./evaluateTransaction";
import { submitTransaction } from "./submitTransaction";
import { BigNumber } from "@ethersproject/bignumber";

export const fetchErc20Balance = (): ((
  contract: Contract | null,
  address: string
) => any) => {
  return useCallback(async (contract: Contract | null, address: string) => {
    return await evaluateTransaction(contract, "balanceOf", [address]);
  }, []);
};

export const approveErc20Spend = (): ((
  contract: Contract | null,
  account: string,
  spender: string,
  amount: number | BigNumber
) => Promise<any>) => {
  return useCallback(
    async (
      contract: Contract | null,
      account: string,
      spender: string,
      amount: number | BigNumber
    ) => {
      return await submitTransaction(contract, account, "approve", [
        spender,
        amount,
      ]);
    },
    []
  );
};

export const mintBany = (): ((
  contract: Contract | null,
  account: string,
  anyaddress: string,
  amount: number | BigNumber
) => Promise<any>) => {
  return useCallback(
    async (
      contract: Contract | null,
      account: string,
      anyaddress: string,
      amount: number | BigNumber
    ) => {
      return await submitTransaction(
        contract,
        account,
        "mintBany(address,uint256,address)",
        [anyaddress, amount, account]
      );
    },
    []
  );
};

export const checkErc20Allowance = (): ((
  contract: Contract | null,
  spender: string,
  owner: string
) => any) => {
  return useCallback(
    async (contract: Contract | null, spender: string, owner: string) => {
      return await evaluateTransaction(contract, "allowance", [owner, spender]);
    },
    []
  );
};

export const getAnysAllowance = (): ((
  contract: Contract | null,
  anyAddres: string
) => any) => {
  return useCallback(async (contract: Contract | null, anyAddress: string) => {
    return await evaluateTransaction(contract, "anysAllowance", [anyAddress]);
  }, []);
};

export const getMintersAllowance = (): ((
  contract: Contract | null,
  bAnyMinterAddress: string
) => any) => {
  return useCallback(
    async (contract: Contract | null, bAnyMinterAddress: string) => {
      return await evaluateTransaction(contract, "mintersAllowance", [
        bAnyMinterAddress,
      ]);
    },
    []
  );
};

export const getTreasuryTba = (): ((contract: Contract | null) => any) => {
  return useCallback(async (contract: Contract | null) => {
    return await evaluateTransaction(contract, "getTBA", []);
  }, []);
};
