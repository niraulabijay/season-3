import { useCallback } from "react";
import { Contract } from "ethers";
import { submitTransaction } from "./submitTransaction";
import { BigNumber } from "@ethersproject/bignumber";
import { evaluateTransaction } from "./evaluateTransaction";

// Deposit Bany
export const depositBany = (): ((
    contract: Contract | null,
    account: string,
    anyaddress: string,
    amount: number | BigNumber
  ) => Promise<any>) => {
    return useCallback(
      async (
        contract: Contract | null,
        account: string,
        address: string,
        amount: number | BigNumber
      ) => {
        console.log(contract);
        return await submitTransaction(
          contract,
          account,
          "lockBany(address,address)",
          [address, amount]
        );
      },
      []
    );
  };

  // Withdraw Any

  export const withdrawBany = (): ((
    contract: Contract | null,
    account: string,
    anyaddress: string,
    amount: number | BigNumber
  ) => Promise<any>) => {
    return useCallback(
      async (
        contract: Contract | null,
        account: string,
        address: string,
        amount: number | BigNumber
      ) => {
        console.log(contract);
        return await submitTransaction(
          contract,
          account,
          "unlockBany(uint256)",
          [amount]
        );
      },
      []
    );
  };

// Deposited BAny
export const depositedBany = (): ((
  contract: Contract | null,
  userAddress: string
) => any) => {
  return useCallback(async (contract: Contract | null, userAddress: string) => {
    return await evaluateTransaction(contract, "lockers", [userAddress]);
  }, []);
};

// Unlockable Bany

export const maxBanyToUnlock = (): ((
  contract: Contract | null,
  userAddress: string
) => any) => {
  return useCallback(async (contract: Contract | null, userAddress: string) => {
    return await evaluateTransaction(contract, "maxBanyToUnlock", [userAddress]);
  }, []);
};


//   Borrowable Amount Check

  export const maxAnyToBorrow = (): ((
    contract: Contract | null,
    userAddress: string
  ) => any) => {
    return useCallback(async (contract: Contract | null, userAddress: string) => {
      return await evaluateTransaction(contract, "borrowers", [userAddress]);
    }, []);
  };

// Any Borrowed by User

export const borrowedAny = (): ((
  contract: Contract | null,
  userAddress: string
) => any) => {
  return useCallback(async (contract: Contract | null, userAddress: string) => {
    return await evaluateTransaction(contract, "maxAnyToBorrow", [userAddress]);
  }, []);
};

//   Borrow Any

  export const borrowAny = (): ((
    contract: Contract | null,
    account: string,
    anyaddress: string,
    amount: number | BigNumber
  ) => Promise<any>) => {
    return useCallback(
      async (
        contract: Contract | null,
        account: string,
        address: string,
        amount: number | BigNumber
      ) => {
        return await submitTransaction(
          contract,
          account,
          "borrowAny(address,uint256)",
          [address, amount]
        );
      },
      []
    );
  };

  // Repay Any

  export const repayAny = (): ((
    contract: Contract | null,
    account: string,
    anyaddress: string,
    amount: number | BigNumber
  ) => Promise<any>) => {
    return useCallback(
      async (
        contract: Contract | null,
        account: string,
        address: string,
        amount: number | BigNumber,
      ) => {
        return await submitTransaction(
          contract,
          account,
          "repayAny(address,uint256,address)",
          [address, amount, account]
        );
      },
      []
    );
  };