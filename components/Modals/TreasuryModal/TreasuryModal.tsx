import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { css } from "aphrodite";
import { useWeb3Context } from "../../../hooks";
import { Styles } from "./Styles";
import SelectToken from "../SelectToken/SelectToken";

type PoolProps = {
  isVisible: boolean;
  onClose: () => void;
};
const TreasuryModal = ({ isVisible, onClose }: PoolProps) => {
  const styles = Styles();
  const { address } = useWeb3Context();
  const [active, setActive] = useState("deposit");
  const [openSelect, setOpenSelect] = useState(false);
  const [selectedToken, setSelectedToken] = useState({
    id: 0,
    name: "",
    image: "",
  });

  const handleSelectOpen = () => {
    setOpenSelect(true);
  };

  const handleSelectClose = () => {
    setOpenSelect(false);
  };

  const changeActive = (tabName: string) => {
    setActive(tabName);
  };

  const checkActive = (tabName: string) => {
    return active === tabName ? true : false;
  };

  const checkContent = (tabName: string) => {
    return css(
      styles.tabContent,
      checkActive(tabName) ? styles.activeContent : null
    );
  };

  const checkTab = (tabName: string) => {
    return css(styles.tabItem, checkActive(tabName) ? styles.activeItem : null);
  };
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className={css(styles.modalHeader)}>
        <div className={css(styles.modalTitle)}>Treasury TBA</div>
        <div className={css(styles.modalClose)}>
          {/* <div className={css(styles.modalPercent)}>5% APY</div> */}
          <span className={css(styles.close)} onClick={onClose}>
            &times;
          </span>
        </div>
      </div>
      <ul className={css(styles.tabs)}>
        <li
          className={checkTab("deposit")}
          onClick={() => changeActive("deposit")}
        >
          Deposit
        </li>

        <li
          className={checkTab("withdraw")}
          onClick={() => changeActive("withdraw")}
        >
          Withdraw
        </li>
        <li
          className={checkTab("borrow")}
          onClick={() => changeActive("borrow")}
        >
          Borrow
        </li>
        <li className={checkTab("repay")} onClick={() => changeActive("repay")}>
          Repay
        </li>
      </ul>
      <div className={checkContent("deposit")}>
        <div className={css(styles.title)}>Available: 0 BANY</div>
        <div className={css(styles.mintFullInnerWrap)}>
          <input type="text" className={css(styles.input)} placeholder="0.00" />
          <div className={css(styles.maxFullBtn)}>Max</div>
        </div>
        <div className={css(styles.footer)}>
          <button className={css(styles.densed)}>Deposit</button>
        </div>
      </div>

      {/* Withdraw */}

      <div className={checkContent("withdraw")}>
        <div className={css(styles.title)}>Deposited: 100 BANY</div>
        <div className={css(styles.mintFullInnerWrap)}>
          <input type="text" className={css(styles.input)} placeholder="0.00" />
          <div className={css(styles.maxFullBtn)}>Max</div>
        </div>
        <div className={css(styles.title)}>Withdraw Allowed Assets:</div>
        <div className={css(styles.subTitle)}>BANY: amount</div>
        <div className={css(styles.subTitle)}>Repay Amount: amount</div>
        <div className={css(styles.footer)}>
          {/* <button className={css(styles.outlined)}>Withdraw</button> */}
          <button className={css(styles.densed)}>Withdraw BANY</button>
        </div>
      </div>

      {/* Borrow */}

      <div className={checkContent("borrow")}>
        <div className={css(styles.mintInputWrapper)}>
          <div className={css(styles.mintTitle)}>
            <span>Available: 0 {selectedToken?.name || ""}</span>
            <span className={css(styles.from)}>From</span>
          </div>
          <div className={css(styles.mintInnerWrap)}>
            <input
              type="text"
              className={css(styles.input)}
              placeholder="0.00"
            />
            <div className={css(styles.maxBtn)}>Max</div>
            {selectedToken?.name ? (
              <div className={css(styles.tokenList)} onClick={handleSelectOpen}>
                <img src={selectedToken?.image} alt="" height="25" width="25" />
                <span className={css(styles.tokenName)}>
                  {selectedToken?.name}
                </span>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="#4ac7d4">
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
                <svg width="16" height="10" viewBox="0 0 16 10" fill="#4ac7d4">
                  <path
                    d="M0.97168 1L6.20532 6L11.439 1"
                    stroke="#AEAEAE"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
        <div className={css(styles.subTitle)}>Borrowed Any: 10 amount</div>
        <div className={css(styles.footer)}>
          <button className={css(styles.densed)}>Borrow</button>
        </div>
      </div>

      {/* Repay */}

      <div className={checkContent("repay")}>
        <div className={css(styles.mintInputWrapper)}>
          <div className={css(styles.mintTitle)}>
            <span>Available: 0 {selectedToken?.name || ""}</span>
            <span className={css(styles.from)}>From</span>
          </div>
          <div className={css(styles.mintInnerWrap)}>
            <input
              type="text"
              className={css(styles.input)}
              placeholder="0.00"
            />
            <div className={css(styles.maxBtn)}>Max</div>
            {selectedToken?.name ? (
              <div className={css(styles.tokenList)} onClick={handleSelectOpen}>
                <img src={selectedToken?.image} alt="" height="25" width="25" />
                <span className={css(styles.tokenName)}>
                  {selectedToken?.name}
                </span>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="#4ac7d4">
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
                <svg width="16" height="10" viewBox="0 0 16 10" fill="#4ac7d4">
                  <path
                    d="M0.97168 1L6.20532 6L11.439 1"
                    stroke="#AEAEAE"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
        <div className={css(styles.subTitle)}>Borrowed Amount: 10 USDT</div>
        <div className={css(styles.footer)}>
          <button className={css(styles.densed)}>Repay</button>
        </div>
      </div>
      
      <SelectToken
        isVisible={openSelect}
        onClose={handleSelectClose}
        setSelectedToken={setSelectedToken}
      />
    </Modal>
  );
};

export default TreasuryModal;
