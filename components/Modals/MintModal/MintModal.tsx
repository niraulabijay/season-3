import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { StyleSheet, css } from "aphrodite";
import { useContractContext, useWeb3Context } from "../../../hooks";
import { Styles } from "./Style";
import SelectToken from "../SelectToken/SelectToken";
import { TokenDefinition } from "../../../helpers/networks";

type PoolProps = {
  isVisible: boolean;
  onClose: () => void;
};
const MintModal = ({ isVisible, onClose }: PoolProps) => {
  const styles = Styles();
  const { address } = useWeb3Context();
  const { usdt, usdc } = useContractContext();
  const [active, setActive] = useState("deposit");
  const [openSelect, setOpenSelect] = useState(false);

  const [selectedToken, setSelectedToken] =
    React.useState<TokenDefinition | null>(null);

  const handleSelectOpen = () => {
    setOpenSelect(true);
  };

  const handleSelectClose = () => {
    setOpenSelect(false);
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
              <span>Available: 0 {selectedToken?.symbol || ""}</span>
              <span className={css(styles.from)}>From</span>
            </div>
            <div className={css(styles.mintInnerWrap)}>
              <input
                type="text"
                className={css(styles.input)}
                placeholder="0.00"
              />
              <div className={css(styles.maxBtn)}>Max</div>
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
            <button className={css(styles.densed)}>Mint BANY</button>
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
