import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { css } from "aphrodite";
import { useAddress, useContractContext } from "../../../hooks";
import { Styles } from "./Style";
import { Contract, ethers } from "ethers";
import SelectToken from "./SelectToken/SelectToken";
import { TokenDefinition } from "../../../helpers/networks";
import {
  approveErc20Spend,
  checkErc20Allowance,
  fetchErc20Balance,
  getAnysAllowance,
  getMintersAllowance,
  mintBany,
} from "../../../helpers/methods";
import { MaxUint256, Zero } from "@ethersproject/constants";
import { UsableContract } from "../../../hooks/contract/contractContext";
import { BigNumber } from "@ethersproject/bignumber";
import { useTransactionAdder } from "../../../state/transactions/hooks";
import { finalizeTransaction } from "../../../state/transactions/actions";
import { useAppDispatch } from "../../../store/hooks";
import { useChainId } from "../../../hooks/web3/web3Context";
import { decimalToExact, exactToDecimal } from "../../../helpers/conversion";

type PoolProps = {
  isVisible: boolean;
  onClose: () => void;
};

type DetailProps = {
  onClose: () => void;
};

const SwapModalDetail = ({ onClose }: DetailProps) => {
  const styles = Styles();
  const address = useAddress();
  const chainId = useChainId();
  const tokens = useContractContext();
  const [currentAny, setCurrentAny] = useState<UsableContract | null>(null);
  const [currentToAny, setCurrentToAny] = useState<UsableContract | null>(null);

  const [currentAnyAllowance, setCurrentAnyAllownace] =
    useState<BigNumber>(Zero);
  const [balance, setBalance] = useState(0);
  const [ibalance, setIbalance] = useState<number | string>();
  const [hexBalance, setHexBalance] = useState<BigNumber | null>();
  const [iHexBalance, setIHexBalance] = useState<BigNumber | null>();
  const [totalanyLeft, setTotalanyLeft] = useState(0);
  const [totalbanyLeft, setTotalbanyLeft] = useState(0);
  const [buttonStatus, setButtonStatus] = useState({
    mint: false,
    approve: false,
    disable: false,
    error: "",
  });
  const transactionAdder = useTransactionAdder();
  const dispatch = useAppDispatch();

  const [selectedFromToken, setSelectedFromToken] =
    React.useState<TokenDefinition | null>(null);

  const [selectedToToken, setSelectedToToken] =
    React.useState<TokenDefinition | null>(null);

  const handleMaximum = () => {
    setHexBalance(iHexBalance);
    setIbalance(balance);
    checkApproveAndDisable(balance);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexBalance(null);
    const value = e.target.value;
    setIbalance(value);
    checkApproveAndDisable(value);
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

  const getBalance = fetchErc20Balance();
  const checkAllowance = checkErc20Allowance();
  const getAnyLeftBalance = getAnysAllowance();
  const getbAnyLeftBalance = getMintersAllowance();

  const getTotalbalance = async (currentToken: UsableContract) => {
    const balance = await getBalance(currentToken.contract, address);
    let userBalance;
    if (currentToken && currentToken.decimal) {
      setHexBalance(balance);
      setIHexBalance(balance);
      const userBalance = decimalToExact(balance, currentToken.decimal);
      setBalance(userBalance);
    } else {
      userBalance = 0;
      setBalance(userBalance);
    }
  };

  const getAnyLeft = async (any: UsableContract) => {
    const anyAddress = any.address;
    try {
      if (any.decimal) {
        const anyLeft = await getAnyLeftBalance(
          tokens["treasuryTba"].contract,
          anyAddress
        );
        const totalAnyLeft = decimalToExact(anyLeft, any.decimal);
        setTotalanyLeft(totalAnyLeft);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getbAnyLeft = async () => {
    const bAnyminterAddress = tokens["bAnyMinter"].address;
    try {
      if (tokens["bAnyToken"].decimal) {
        const banyLeft = await getbAnyLeftBalance(
          tokens["treasuryTba"].contract,
          bAnyminterAddress
        );
        const totalbAnyLeft = decimalToExact(
          banyLeft,
          tokens["bAnyToken"].decimal
        );
        setTotalbanyLeft(totalbAnyLeft);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkTokenAllowance = async (currentToken: UsableContract) => {
    if (currentToken && currentToken.contract && currentToken.decimal) {
      const allowance = await checkAllowance(
        currentToken.contract,
        tokens["bAnyMinter"].address,
        address
      );
      setCurrentAnyAllownace(allowance);
    }
  };

  useEffect(() => {
    Object.keys(tokens).map((token) => {
      if (selectedFromToken?.address == tokens[token].address) {
        setIbalance("");
        setCurrentAny(tokens[token]);
        getTotalbalance(tokens[token]);
        getAnyLeft(tokens[token]);
        getbAnyLeft();
        checkTokenAllowance(tokens[token]);
      }
    });
  }, [selectedFromToken, address]);

  useEffect(() => {
    Object.keys(tokens).map((token) => {
      if (selectedFromToken?.address == tokens[token].address) {
        setIbalance("");
        setCurrentToAny(tokens[token]);
        getTotalbalance(tokens[token]);
        getAnyLeft(tokens[token]);
        getbAnyLeft();
        checkTokenAllowance(tokens[token]);
      }
    });
  }, [selectedToToken, address]);

  const ButtonDisplay = () => {
    if (currentAny) {
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
      } else {
        if (ibalance > balance) {
          return (
            <button className={css(styles.densed)}>
              Insufficient {selectedFromToken?.symbol} balance
            </button>
          );
        } else {
          if (buttonStatus.mint) {
            return (
              <button
                className={css(styles.densed)}
                onClick={handleMint}
                disabled={buttonStatus.disable}
              >
                Mint BANY
              </button>
            );
          } else if (buttonStatus.approve) {
            return (
              <button
                className={css(styles.densed)}
                onClick={handleApprove}
                disabled={buttonStatus.disable}
              >
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
      }
    } else {
      return (
        <button className={css(styles.densed)} disabled>
          Select Any Token
        </button>
      );
    }
  };

  const checkApproveResponse = approveErc20Spend();
  const checkMintResponse = mintBany();

  const handleApprove = () => {
    if (currentAny && currentAny.signer && currentAny.contract) {
      const signedContract = currentAny.contract.connect(currentAny.signer);
      getApproveResponse(signedContract);
    } else {
      alert("Initializing...Please wait");
    }
  };

  const handleMint = () => {
    if (
      tokens["bAnyMinter"] &&
      tokens["bAnyMinter"].contract &&
      tokens["bAnyMinter"].signer
    ) {
      const signedContract = tokens["bAnyMinter"].contract.connect(
        tokens["bAnyMinter"].signer
      );
      getMintResponse(signedContract);
    }
  };

  const getMintResponse = async (contract: Contract | null) => {
    if (ibalance && currentAny && currentAny.decimal) {
      const actualAmount = hexBalance
        ? hexBalance
        : exactToDecimal(ibalance, currentAny.decimal);
      console.log(actualAmount);
      try {
        const res = await checkMintResponse(
          contract,
          address,
          currentAny.address,
          actualAmount
        );
        transactionAdder(res, {
          summary: "Mint BAny",
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
        console.log(err, "Mint error");
      }
    }
  };

  const getApproveResponse = async (contract: Contract | null) => {
    if (currentAny && currentAny.decimal) {
      const actualAmount = MaxUint256;
      const res = await checkApproveResponse(
        contract,
        address,
        tokens["bAnyMinter"].address,
        actualAmount
      );
      transactionAdder(res, {
        summary: "Approve " + currentAny.symbol,
        approval: {
          tokenAddress: currentAny.address,
          spender: tokens["bAnyMinter"].address,
        },
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

  return (
    <>
      <div className={css(styles.modalHeader)}>
        <div className={css(styles.modalTitle)}>Swap Modal</div>
        <div className={css(styles.modalClose)}>
          {/* <div className={css(styles.modalPercent)}>TBA: 2</div> */}
          <span className={css(styles.close)} onClick={onClose}>
            &times;
          </span>
        </div>
      </div>
      <div>
        <div className={css(styles.mintInputWrapper)}>
          <div className={css(styles.mintTitle)}>
            <span>
              Available: {balance} {selectedFromToken?.symbol || ""}
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
            <FromToken
              currentAny={currentAny}
              setSelectedFromToken={setSelectedFromToken}
            />
          </div>
        </div>
        <div className={css(styles.mintInputWrapper)}>
          <div className={css(styles.mintTitle)}>
            <span></span>
            <span className={css(styles.from)}>To</span>
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

            <ToToken
              currentAny={currentToAny}
              setSelectedToToken={setSelectedToToken}
            />
          </div>
        </div>
        <div>
          <div className={css(styles.subTitle)}>
            BANY Left to Mint: <strong>{totalbanyLeft}</strong>
          </div>
          <div className={css(styles.subTitle)}>
            Max {selectedFromToken?.symbol}: <strong>{totalanyLeft}</strong>
          </div>
        </div>

        <div className={css(styles.footer)}>
          <ButtonDisplay />
        </div>
      </div>
    </>
  );
};

const FromToken = ({ currentAny, setSelectedFromToken }: any) => {
  const styles = Styles();
  const [openSelect, setOpenSelect] = useState(false);

  const handleSelectOpen = () => {
    setOpenSelect(true);
  };

  const handleSelectClose = () => {
    setOpenSelect(false);
  };

  return (
    <>
      {currentAny?.symbol ? (
        <div className={css(styles.tokenList)} onClick={handleSelectOpen}>
          <img src={currentAny?.logo} alt="" height="25" width="25" />
          <span className={css(styles.tokenName)}>{currentAny?.symbol}</span>
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

      <SelectToken
        isVisible={openSelect}
        onClose={handleSelectClose}
        setSelectedToken={setSelectedFromToken}
      />
    </>
  );
};

const ToToken = ({ currentAny, setSelectedToToken }: any) => {
  const styles = Styles();
  const [openSelect, setOpenSelect] = useState(false);
  const handleSelectOpen = () => {
    setOpenSelect(true);
  };

  const handleSelectClose = () => {
    setOpenSelect(false);
  };

  return (
    <>
      {currentAny?.symbol ? (
        <div className={css(styles.tokenList)} onClick={handleSelectOpen}>
          <img src={currentAny?.logo} alt="" height="25" width="25" />
          <span className={css(styles.tokenName)}>{currentAny?.symbol}</span>
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

      <SelectToken
        isVisible={openSelect}
        onClose={handleSelectClose}
        setSelectedToken={setSelectedToToken}
      />
    </>
  );
};

const SwapModal = ({ isVisible, onClose }: PoolProps) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <SwapModalDetail onClose={onClose} />
    </Modal>
  );
};

export default SwapModal;
