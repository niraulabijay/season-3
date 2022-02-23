import React, { useState, useEffect } from "react";
import { css } from "aphrodite";
import { Styles } from "../Styles";
import { Contract, ethers } from "ethers";
import { MaxUint256, Zero } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { decimalToExact, exactToDecimal } from "../../../../helpers/conversion";
import { finalizeTransaction } from "../../../../state/transactions/actions";
import { useTransactionAdder } from "../../../../state/transactions/hooks";
import { useChainId } from "../../../../hooks/web3/web3Context";
import { UsableContract } from "../../../../hooks/contract/contractContext";
import { TokenDefinition } from "../../../../helpers/networks";
import { useDispatch } from "react-redux";
import {
  approveErc20Spend,
  checkErc20Allowance,
  fetchErc20Balance,
} from "../../../../helpers/methods";
import {
  borrowAny,
  borrowedAny,
  repayAny,
} from "../../../../helpers/treasuryMethods";

type DepositProps = {
  checkContent: (name: string) => any;
  address: string;
  tokens: { [x: string]: UsableContract };
  handleSelectOpen: () => any;
  selectedToken: TokenDefinition | null;
};

const Repay = ({
  checkContent,
  address,
  tokens,
  handleSelectOpen,
  selectedToken,
}: DepositProps) => {
  const styles = Styles();
  const chainId = useChainId();
  const transactionAdder = useTransactionAdder();
  const dispatch = useDispatch();

  const [currentAny, setCurrentAny] = useState<UsableContract | null>(null);
  const [ibalance, setIbalance] = useState<string | number>(0);
  const [borrowedAmount, setBorrowedAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [buttonStatus, setButtonStatus] = useState({
    error: "",
    repay: false,
    approve: false,
    disable: false,
  });
  const getBalance = fetchErc20Balance();
  const checkAllowance = checkErc20Allowance();
  const checkApproveResponse = approveErc20Spend();
  const checkRepayResponse = repayAny();
  const getBorrowedAny = borrowedAny();
  const [currentAnyAllowance, setCurrentAnyAllownace] =
    useState<BigNumber>(Zero);

  const getTotalBalance = async (currentToken: UsableContract) => {
    const balance = await getBalance(currentToken.contract, address);
    let userBalance;
    if (currentToken && currentToken.decimal) {
      const userBalance = decimalToExact(balance, currentToken.decimal);
      setBalance(userBalance);
    } else {
      userBalance = 0;
      setBalance(userBalance);
    }
  };

  const checkBorrowedAny = async () => {
    const borrowedAnyAmount = await getBorrowedAny(
      tokens["treasuryTba"].contract,
      address
    );
    let borrowBalance;
    if (tokens["treasuryTba"]) {
      // console.log(borrowedAnyAmount)
      const borrowBalance = decimalToExact(borrowedAnyAmount, 1);
      setBorrowedAmount(borrowBalance);
    } else {
      borrowBalance = 0;
      setBorrowedAmount(borrowBalance);
    }
  };
  const checkTokenAllowance = async (currentToken: UsableContract) => {
    if (currentToken && currentToken.contract && currentToken.decimal) {
      const allowance = await checkAllowance(
        currentToken.contract,
        tokens["treasuryTba"].address,
        address
      );
      setCurrentAnyAllownace(allowance);
    }
  };

  const handleApprove = () => {
    if (currentAny && currentAny.signer && currentAny.contract) {
      const signedContract = currentAny.contract.connect(currentAny.signer);
      getApproveResponse(signedContract);
    } else {
      alert("Initializing...Please wait");
    }
  };

  const getApproveResponse = async (contract: Contract | null) => {
    if (currentAny && currentAny.decimal) {
      const actualAmount = MaxUint256;
      // const actualAmount = ethers.utils.parseUnits("2000", currentAny.decimal);
      const res = await checkApproveResponse(
        contract,
        address,
        tokens["treasuryTba"].address,
        actualAmount
      );
      transactionAdder(res, {
        summary: "Approve " + currentAny.symbol,
        approval: {
          tokenAddress: currentAny.address,
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
          checkTokenAllowance(currentAny);
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

  const handleRepay = () => {
    if (
      tokens["treasuryTba"] &&
      tokens["treasuryTba"].contract &&
      tokens["treasuryTba"].signer
    ) {
      const signedContract = tokens["treasuryTba"].contract.connect(
        tokens["treasuryTba"].signer
      );
      getRepayResponse(signedContract);
    }
  };

  const getRepayResponse = async (contract: Contract | null) => {
    if (ibalance && currentAny && currentAny.decimal) {
      const actualAmount = exactToDecimal(ibalance, currentAny.decimal);
      try {
        const res = await checkRepayResponse(
          contract,
          address,
          currentAny.address,
          actualAmount
        );
        transactionAdder(res, {
          summary: "Repay Any",
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
        console.log(err, "Repay error");
      }
    }
    console.log(contract);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIbalance(value);
    checkApproveAndDisable(value);
    console.log(ibalance);
  };

  const handleMaximum = () => {
    setIbalance(borrowedAmount);
    checkApproveAndDisable(borrowedAmount);
  };

  const checkApproveAndDisable = (value: number | string) => {
    if (currentAny && currentAny.decimal && value && !isNaN(Number(value))) {
      const anyToApprove = exactToDecimal(value, currentAny.decimal);
      if (currentAnyAllowance.gte(anyToApprove)) {
        updateButton(value, true, false);
      } else {
        updateButton(value, false, true);
      }
    }
  };

  const updateButton = (
    value: number | string,
    repay: boolean,
    approve: boolean
  ) => {
    let disable = true;
    if (value > 0) {
      disable = false;
    }
    setButtonStatus({
      ...buttonStatus,
      disable: disable,
      repay: repay,
      approve: approve,
    });
  };

  useEffect(() => {
    Object.keys(tokens).map((token) => {
      if (selectedToken?.address == tokens[token].address) {
        setCurrentAny(tokens[token]);
        getTotalBalance(tokens[token]);
        checkTokenAllowance(tokens[token]);
        setIbalance("");
      }
      checkBorrowedAny();
    });
  }, [selectedToken, address]);

  console.log(buttonStatus);

  const ButtonDisplay = () => {
    if (currentAny) {
      if (ibalance > balance) {
        return (
          <button className={css(styles.densed)}>
            Insufficient {selectedToken?.symbol} balance
          </button>
        );
      } else if (ibalance == 0) {
        return (
          <button className={css(styles.densed)} disabled>
            Enter Amount
          </button>
        );
      } else {
        if (buttonStatus.repay && !buttonStatus.disable) {
          return (
            <button className={css(styles.densed)} onClick={handleRepay}>
              Repay
            </button>
          );
        } else if (
          (buttonStatus.approve && !buttonStatus.disable) ||
          (buttonStatus.approve && ibalance > 0)
        ) {
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
    } else {
      return (
        <button className={css(styles.densed)} disabled>
          Select Any Token
        </button>
      );
    }
  };

  return (
    <div className={checkContent("repay")}>
      <div className={css(styles.mintInputWrapper)}>
        <div className={css(styles.mintTitle)}>
          <span>
            Available: {balance} {selectedToken?.symbol || ""}
          </span>
          <span className={css(styles.from)}>From</span>
        </div>
        <div className={css(styles.mintInnerWrap)}>
          <input
            type="text"
            className={css(styles.input)}
            placeholder="0.00"
            value={ibalance}
            onChange={handleChange}
          />
          <div className={css(styles.maxBtn)} onClick={handleMaximum}>
            Max
          </div>
          {currentAny?.name ? (
            <div className={css(styles.tokenList)} onClick={handleSelectOpen}>
              <img src={currentAny?.logo} alt="" height="25" width="25" />
              <span className={css(styles.tokenName)}>
                {currentAny?.symbol}
              </span>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="#4ac7d4">
                <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
              </svg>
            </div>
          ) : (
            <div
              className={css(styles.tokenDefaultList)}
              onClick={handleSelectOpen}
            >
              <span className={css(styles.tokenName)}>Select Token</span>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="#4ac7d4">
                <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
              </svg>
            </div>
          )}
        </div>
      </div>
      <div className={css(styles.subTitle)}>
        Borrowed Amount: {borrowedAmount} Any
      </div>
      <div className={css(styles.footer)}>
        <ButtonDisplay />
      </div>
    </div>
  );
};

export default Repay;
