import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { StyleSheet, css } from "aphrodite";
import { useContractContext, useWeb3Context } from "../../../hooks";
import { Styles } from "./Style";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import SelectToken from "../SelectToken/SelectToken";
import { TokenDefinition } from "../../../helpers/networks";
import {
  approveErc20Spend,
  checkErc20Allowance,
  fetchErc20Balance,
  mintBany,
} from "../../../helpers/methods";
import { UsableContract } from "../../../hooks/contract/contractContext";
import { BigNumber } from "@ethersproject/bignumber";
import Web3 from "web3";

type PoolProps = {
  isVisible: boolean;
  onClose: () => void;
};

type ListContracts = {
  [key: string]: UsableContract;
};

const MintModal = ({ isVisible, onClose }: PoolProps) => {
  const styles = Styles();
  const { address } = useWeb3Context();
  const tokens = useContractContext();
  // const [active, setActive] = useState("deposit");
  const [openSelect, setOpenSelect] = useState(false);
  const [balance, setBalance] = useState(0);
  const [ibalance, setIbalance] = useState<number | string>(0);
  const [buttonStatus, setButtonStatus] = useState({
    error: "",
    mint: false,
    approve: false,
    disable: false,
  });

  const [selectedToken, setSelectedToken] =
    React.useState<TokenDefinition | null>(null);

  const handleSelectOpen = () => {
    setOpenSelect(true);
  };

  const handleSelectClose = () => {
    setOpenSelect(false);
  };

  const handleMaximum = () => {
    setIbalance(balance);
    checkDisable(balance);
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

  const getBalance = fetchErc20Balance();
  const checkAllowance = checkErc20Allowance();

  const getTotalbalance = async (token: string) => {
    const balance = await getBalance(tokens[token].contract, address);
    tokens[token].decimal &&
      setBalance(balance / 10 ** (tokens[token]?.decimal || 0));
  };

  const checkTokenAllowance = async (token: string) => {
    const allowance = await checkAllowance(
      tokens[token].contract,
      tokens?.bAnyMinter?.address,
      address
    );
    if (allowance > ibalance && ibalance > 0) {
      setButtonStatus({ ...buttonStatus, disable: false, mint: true });
    } else if (allowance > ibalance) {
      setButtonStatus({
        ...buttonStatus,
        mint: true,
        approve: false,
        disable: true,
      });
    } else {
      setButtonStatus({
        ...buttonStatus,
        approve: true,
        mint: false,
        disable: false,
      });
    }
  };

  useEffect(() => {
    Object.keys(tokens).map((token) => {
      if (selectedToken?.address == tokens[token].address) {
        getTotalbalance(token);
        checkTokenAllowance(token);
        // tokens[token].contract?.events
        //   .Approval({
        //     filter: { from: address, to: tokens.bAnyMinter.address },
        //     fromBlock: "latest",
        //   })
        //   .on("data", (event: any) => console.log(event,'1'))
        //   .on("connected", (event: any) => console.log(event,'2'))
        //   .on("error", (error: any) => console.log(error,'3'));
      }
    });
  }, [selectedToken, address, buttonStatus?.mint]);

  const ButtonDisplay = () => {
    if (ibalance > balance) {
      return (
        <button className={css(styles.densed)}>
          Insufficient {selectedToken?.symbol} balance
        </button>
      );
    } else if (buttonStatus.mint && !buttonStatus.disable) {
      return (
        <button className={css(styles.densed)} onClick={handleMint}>
          Mint BANY
        </button>
      );
    } else if (buttonStatus.approve && !buttonStatus.disable) {
      return (
        <button className={css(styles.densed)} onClick={handleApprove}>
          Approve
        </button>
      );
    } else {
      return (
        <button className={css(styles.densed)} disabled>
          Enter Amount
        </button>
      );
    }
  };

  const checkApproveResponse = approveErc20Spend();
  const checkMintResponse = mintBany();

  const handleApprove = () => {
    Object.keys(tokens).map((token) => {
      if (selectedToken?.address == tokens[token].address) {
        getApproveResponse(tokens[token].contract);
      }
    });
  };

  const handleMint = () => {
    getMintResponse(tokens?.bAnyMinter?.contract);
  };

  function decimalToHex(d: any, decimal: number) {
    const web3 = new Web3(Web3.givenProvider);
    let tokens = BigNumber.from(d * 10 ** decimal);
    return tokens;
  }

  const getMintResponse = async (contract: Contract | null) => {
    const actualAmount = decimalToHex(ibalance, selectedToken?.decimals || 0);
    const res = await checkMintResponse(
      contract,
      address,
      selectedToken?.address || "",
      actualAmount
    );
    console.log(res);
  };

  const getApproveResponse = async (contract: Contract | null) => {
    const actualAmount = decimalToHex(1000, selectedToken?.decimals || 0);
    const res = await checkApproveResponse(
      contract,
      address,
      tokens.bAnyMinter?.address,
      actualAmount
    );
    console.log(res);
  };

  return (
    <>
      <Modal isVisible={isVisible} onClose={onClose}>
        <div className={css(styles.modalHeader)}>
          <div className={css(styles.modalTitle)}>Mint Modal</div>
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
              {selectedToken?.symbol ? (
                <div
                  className={css(styles.tokenList)}
                  onClick={handleSelectOpen}
                >
                  <img
                    src={selectedToken?.logoURI}
                    alt=""
                    height="25"
                    width="25"
                  />
                  <span className={css(styles.tokenName)}>
                    {selectedToken?.symbol}
                  </span>
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="#4ac7d4"
                  >
                    <path
                      d="M0.97168 1L6.20532 6L11.439 1"
                      stroke="#AEAEAE"
                    ></path>
                  </svg>
                </div>
              ) : (
                <div
                  className={css(styles.tokenDefaultList)}
                  onClick={handleSelectOpen}
                >
                  <span className={css(styles.tokenName)}>Select Token</span>
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="#4ac7d4"
                  >
                    <path
                      d="M0.97168 1L6.20532 6L11.439 1"
                      stroke="#AEAEAE"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className={css(styles.subTitle)}>
              BANY Left to Mint: <strong>2000</strong>
            </div>
            <div className={css(styles.subTitle)}>
              Max USDT: <strong>3000</strong>
            </div>
          </div>

          <div className={css(styles.footer)}>
            <ButtonDisplay />
          </div>
        </div>
        <SelectToken
          isVisible={openSelect}
          onClose={handleSelectClose}
          setSelectedToken={setSelectedToken}
        />
      </Modal>
    </>
  );
};

export default MintModal;

// type UsableContract = {
//   name: string;
//   symbol: string;
//   logo: string;
//   contract: Contract | null;
//   abi: AbiItem[];
//   address: string;
//   decimal: number | null;
// };

// type ContextProps = {
//   islaGauge: UsableContract | null;
//   usdc: UsableContract | null;
//   usdt: UsableContract | null;
//   dai: UsableContract | null;
//   islaGauge: UsableContract | null;
// }
