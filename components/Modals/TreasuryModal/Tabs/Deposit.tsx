import React, { useState, useEffect } from "react";
import { css } from "aphrodite";
import { Styles } from "../Styles";
import { Contract, ethers } from "ethers";
import { MaxUint256, Zero } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";
import {
  approveErc20Spend,
  checkErc20Allowance,
  fetchErc20Balance,
} from "../../../../helpers/methods";
import { decimalToExact, exactToDecimal } from "../../../../helpers/conversion";
import { finalizeTransaction } from "../../../../state/transactions/actions";
import { useTransactionAdder } from "../../../../state/transactions/hooks";
import { useAppDispatch } from "../../../../store/hooks";
import { useChainId } from "../../../../hooks/web3/web3Context";
import { UsableContract } from "../../../../hooks/contract/contractContext";
import { depositBany } from "../../../../helpers/treasuryMethods";

type DepositProps = {
  checkContent: (name: string) => any;
  address: string;
  tokens: { [x: string]: UsableContract };
};

const Deposit = ({ checkContent, address, tokens }: DepositProps) => {
  const styles = Styles();
  const [banyTotalBalance, setBanyTotalBalance] = useState(0);
  const [ibalance, setIbalance] = useState<number | string>(0);
  const [buttonStatus, setButtonStatus] = useState({
    error: "",
    mint: false,
    approve: false,
    disable: false,
  });
  const [currentbAnyAllowance, setCurrentbAnyAllownace] =
    useState<BigNumber>(Zero);
  const transactionAdder = useTransactionAdder();
  const dispatch = useAppDispatch();
  const chainId = useChainId();

  const getBalance = fetchErc20Balance();
  const checkAllowance = checkErc20Allowance();

  const getTotalBalance = async () => {
    const banyBalance = await getBalance(tokens["bAnyToken"].contract, address);
    let userBanyBalance;
    if (tokens && tokens["bAnyToken"].decimal) {
      const userBanyBalance = decimalToExact(
        banyBalance,
        tokens["bAnyToken"].decimal
      );
      setBanyTotalBalance(userBanyBalance);
    } else {
      userBanyBalance = 0;
      setBanyTotalBalance(userBanyBalance);
    }
  };

  const handleIbalance = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIbalance(value);
    checkApproveAndDisable(value);
  };

  const handleMaximum = () => {
    setIbalance(banyTotalBalance);
    checkApproveAndDisable(banyTotalBalance);
  };

  const checkApproveAndDisable = (value: number | string) => {
    if (
      tokens["bAnyToken"] &&
      tokens["bAnyToken"].decimal &&
      value &&
      !isNaN(Number(value))
    ) {
      const anyToApprove = exactToDecimal(value, tokens["bAnyToken"].decimal);
      if (currentbAnyAllowance.gte(anyToApprove)) {
        updateButton(value, true, false);
      } else {
        updateButton(value, false, true);
      }
    }
  };

  const updateButton = (
    value: number | string,
    mint: boolean,
    approve: boolean
  ) => {
    let disable = true;
    if (value > 0) {
      disable = false;
    }
    setButtonStatus({
      ...buttonStatus,
      disable: disable,
      mint: mint,
      approve: approve,
    });
  };

  const checkApproveResponse = approveErc20Spend();
  const checkDepositResponse = depositBany();

  const getApproveResponse = async (contract: Contract | null) => {
    if (tokens && tokens["bAnyToken"].decimal) {
      const actualAmount = MaxUint256;
      // const actualAmount = ethers.utils.parseUnits("2000", currentAny.decimal);
      const res = await checkApproveResponse(
        contract,
        address,
        tokens["treasuryTba"].address,
        actualAmount
      );
      transactionAdder(res, {
        summary: "Approve " + tokens["bAnyToken"].symbol,
        approval: {
          tokenAddress: tokens["treasuryTba"].address,
          spender: tokens["treasuryTba"].address,
        },
      });
      const { hash } = res;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider
        .waitForTransaction(hash)
        .then((receipt) => {
          console.log("Transaction Mined: ", receipt);
          dispatch(
            finalizeTransaction({
              chainId: chainId,
              hash: hash,
              receipt: {
                blockHash: receipt.blockHash,
                blockNumber: receipt.blockNumber,
                contractAddress: receipt.contractAddress,
                from: receipt.from,
                status: receipt.status,
                to: receipt.to,
                transactionHash: receipt.transactionHash,
                transactionIndex: receipt.transactionIndex,
              },
            })
          );
          checkTokenAllowance(tokens["bAnyToken"]);
        })
        .catch((err) => {
          dispatch(
            finalizeTransaction({
              chainId,
              hash,
              receipt: "failed",
            })
          );
        });
    }
  };

  const getDepositResponse = async (contract: Contract | null) => {
    if (ibalance && tokens["bAnyToken"] && tokens["bAnyToken"].decimal) {
      const actualAmount = exactToDecimal(
        ibalance,
        tokens["bAnyToken"].decimal
      );
      try {
        const res = await checkDepositResponse(
          contract,
          address,
          tokens["bAnyToken"].address,
          actualAmount
        );
        transactionAdder(res, {
          summary: "Deposit Bany",
        });
        const { hash } = res;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        provider
          .waitForTransaction(hash)
          .then((receipt) => {
            dispatch(
              finalizeTransaction({
                chainId: chainId,
                hash: hash,
                receipt: {
                  blockHash: receipt.blockHash,
                  blockNumber: receipt.blockNumber,
                  contractAddress: receipt.contractAddress,
                  from: receipt.from,
                  status: receipt.status,
                  to: receipt.to,
                  transactionHash: receipt.transactionHash,
                  transactionIndex: receipt.transactionIndex,
                },
              })
            );
            // check Any Balance here
          })
          .catch((err) => {
            dispatch(
              finalizeTransaction({
                chainId,
                hash,
                receipt: "failed",
              })
            );
          });
      } catch (err) {
        console.log(err, "Deposit error");
      }
    }
  };

  const checkTokenAllowance = async (currentToken: UsableContract) => {
    if (currentToken && currentToken.contract && currentToken.decimal) {
      console.log(tokens["treasuryTba"].address, "tba addr");
      const allowance = await checkAllowance(
        currentToken.contract,
        tokens["treasuryTba"].address,
        address
      );
      setCurrentbAnyAllownace(allowance);
    }
  };

  const handleApprove = () => {
    if (
      tokens &&
      tokens["treasuryTba"].signer &&
      tokens["treasuryTba"].contract
    ) {
      const signedContract = tokens["treasuryTba"].contract.connect(
        tokens["treasuryTba"].signer
      );
      getApproveResponse(signedContract);
    } else {
      alert("Initializing...Please wait");
    }
  };

  const handleDeposit = () => {
    if (
      tokens["treasuryTba"] &&
      tokens["treasuryTba"].contract &&
      tokens["treasuryTba"].signer
    ) {
      const signedContract = tokens["treasuryTba"].contract.connect(
        tokens["treasuryTba"].signer
      );
      getDepositResponse(signedContract);
    }
  };

  useEffect(() => {
    getTotalBalance();
    checkTokenAllowance(tokens["bAnyToken"]);
  }, [address, tokens]);

  const ButtonDisplay = () => {
    if (
      !ibalance ||
      ibalance == 0 ||
      ibalance == "" ||
      isNaN(Number(ibalance))
    ) {
      return (
        <button className={css(styles.densed)} disabled>
          Enter Amount
        </button>
      );
    } else if (ibalance > banyTotalBalance) {
      return (
        <button className={css(styles.densed)} onClick={handleApprove}>
          Insufficient Bany Balance
        </button>
      );
    } else {
      if (buttonStatus.mint) {
        return (
          <button className={css(styles.densed)} onClick={handleDeposit}>
            Deposit
          </button>
        );
      } else if (buttonStatus.approve) {
        return (
          <button className={css(styles.densed)} onClick={handleApprove}>
            Approve
          </button>
        );
      } else {
        return (
          <button className={css(styles.densed)} disabled>
            Error
          </button>
        );
      }
    }
  };
  return (
    <div className={checkContent("deposit")}>
      <div className={css(styles.title)}>
        Available: {banyTotalBalance} BANY
      </div>
      <div className={css(styles.mintFullInnerWrap)}>
        <input
          type="text"
          className={css(styles.input)}
          placeholder="0.00"
          value={ibalance}
          onChange={handleIbalance}
        />
        <div className={css(styles.maxFullBtn)} onClick={handleMaximum}>
          Max
        </div>
      </div>
      <div className={css(styles.footer)}>
        {/* <button className={css(styles.densed)}>Deposit</button> */}
        <ButtonDisplay />
      </div>
    </div>
  );
};

export default Deposit;
