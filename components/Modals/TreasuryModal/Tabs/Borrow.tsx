import React, { useState, useEffect } from "react";
import { css } from "aphrodite";
import { Styles } from "../Styles";
import { Contract, ethers } from "ethers";
import { MaxUint256, Zero } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { decimalToExact, exactToDecimal } from "../../../../helpers/conversion";
import { finalizeTransaction } from "../../../../state/transactions/actions";
import { useTransactionAdder } from "../../../../state/transactions/hooks";
import { useAppDispatch } from "../../../../store/hooks";
import { useChainId } from "../../../../hooks/web3/web3Context";
import { UsableContract } from "../../../../hooks/contract/contractContext";
import {
  borrowAny,
  borrowedAny,
  maxAnyToBorrow,
} from "../../../../helpers/treasuryMethods";
import { TokenDefinition } from "../../../../helpers/networks";
import { useDispatch } from "react-redux";

type DepositProps = {
  checkContent: (name: string) => any;
  address: string;
  tokens: { [x: string]: UsableContract };
  handleSelectOpen: () => any;
  selectedToken: TokenDefinition | null;
};

const Borrow = ({
  checkContent,
  address,
  tokens,
  handleSelectOpen,
  selectedToken,
}: DepositProps) => {
  const styles = Styles();
  const transactionAdder = useTransactionAdder();
  const dispatch = useDispatch();
  const chainId = useChainId();
  const [borrowedAmount, setBorrowedAmount] = useState(0);
  const [currentAny, setCurrentAny] = useState<UsableContract | null>(null);
  const [ibalance, setIbalance] = useState<number | string>(0);
  const [balance, setBalance] = useState(0);
  const [buttonStatus, setButtonStatus] = useState({
    error: "",
    mint: false,
    disable: false,
  });

  const getBorrowBalance = maxAnyToBorrow();
  const submitBorrowResponse = borrowAny();
  const getBorrowedAny = borrowedAny();


  const getBorrowableAny = async () => {
    const balance = await getBorrowBalance(
      tokens["treasuryTba"].contract,
      address
    );
    let borrowBalance;
    if (currentAny && currentAny.decimal) {
      const borrowBalance = decimalToExact(balance, currentAny.decimal);
      console.log(borrowBalance);
      setBalance(borrowBalance);
    } else {
      borrowBalance = 0;
      setBalance(borrowBalance);
    }
  };

  const checkBorrowedAny = async() => {
    const borrowedAnyAmount = await getBorrowedAny(tokens["treasuryTba"].contract, address);
    let borrowBalance;
    if(tokens["treasuryTba"]){
        console.log(borrowedAnyAmount)
        const borrowBalance = decimalToExact(borrowedAnyAmount, 1);
        setBorrowedAmount(borrowBalance)
    }else{
        borrowBalance = 0;
        setBorrowedAmount(borrowBalance)
    }
}

  useEffect(() => {
    Object.keys(tokens).map((token) => {
      if (selectedToken?.address == tokens[token].address) {
        setCurrentAny(tokens[token]);
        getBorrowableAny();
      }
    });
    checkBorrowedAny();
  }, [address, selectedToken]);

  const handleBorrow = () => {
    if (
      tokens["treasuryTba"] &&
      tokens["treasuryTba"].contract &&
      tokens["treasuryTba"].signer
    ) {
      const signedContract = tokens["treasuryTba"].contract.connect(
        tokens["treasuryTba"].signer
      );
      getBorrowResponse(signedContract);
    }
  };

  const getBorrowResponse = async (contract: Contract | null) => {
    if (ibalance && currentAny && currentAny.decimal) {
        const actualAmount = exactToDecimal(ibalance, currentAny.decimal);
        try {
          const res = await submitBorrowResponse(
            contract,
            address,
            currentAny.address,
            actualAmount
          );
          transactionAdder(res, {
            summary: "Mint BAny",
          });
          const { hash } = res;
          console.log(hash, 'newhash')
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
          console.log(err, "Mint error");
        }
      }
  };

  const handleMaximum = () => {
    if (selectedToken) {
      setIbalance(balance);
      checkDisable(balance);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIbalance(value);
    checkDisable(value);
  };

  const checkDisable = (value: number | string) => {
    if (value && !isNaN(Number(value)) && value > 0) {
      setButtonStatus({ ...buttonStatus, disable: false });
    } else {
      setButtonStatus({ ...buttonStatus, disable: true });
    }
  };

  const ButtonDisplay = () => {
    if (currentAny) {
      if (ibalance > balance) {
        return (
          <button className={css(styles.densed)} onClick={handleBorrow}>
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
        if (buttonStatus.mint && !buttonStatus.disable) {
          return (
            <button className={css(styles.densed)} onClick={handleBorrow}>
              Borrow
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
    <div className={checkContent("borrow")}>
      <div className={css(styles.mintInputWrapper)}>
        <div className={css(styles.mintTitle)}>
          <span>
            Available To Borrow: {balance} {currentAny?.symbol || ""}
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
      <div className={css(styles.subTitle)}>Borrowed Amount: {borrowedAmount} amount</div>
      <div className={css(styles.footer)}>
        <ButtonDisplay />
      </div>
    </div>
  );
};

export default Borrow;
