import React, { useState } from "react";
import Modal from "../Modal";
import { css } from "aphrodite";
import { useAddress, useContractContext } from "../../../hooks";
import { Styles } from "./Styles";
import SelectToken from "../SelectToken/SelectToken";
import Deposit from "./Tabs/Deposit";
import Withdraw from "./Tabs/Withdraw";
import Borrow from "./Tabs/Borrow";
import { TokenDefinition } from "../../../helpers/networks";
import Repay from "./Tabs/Repay";

type PoolProps = {
  isVisible: boolean;
  onClose: () => void;
};
const TreasuryModal = ({ isVisible, onClose }: PoolProps) => {
  const styles = Styles();
  const address = useAddress();
  const tokens = useContractContext();
  const [active, setActive] = useState("deposit");
  const [openSelect, setOpenSelect] = useState(false);
  const [selectedToken, setSelectedToken] =
    React.useState<TokenDefinition | null>(null);

  const handleSelectOpen = () => {
    setOpenSelect(true);
  };
  console.log(isVisible, "treasury");

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

      {/* Deposit */}
      <>
        {active == "deposit" && (
          <Deposit
            checkContent={checkContent}
            address={address}
            tokens={tokens}
          />
        )}
      </>

      {/* Withdraw */}
      <>
        {active == "withdraw" && (
          <Withdraw
            checkContent={checkContent}
            address={address}
            tokens={tokens}
          />
        )}
      </>

      {/* Borrow */}
      <>
        {active == "borrow" && (
          <Borrow
            checkContent={checkContent}
            address={address}
            tokens={tokens}
            handleSelectOpen={handleSelectOpen}
            selectedToken={selectedToken}
          />
        )}
      </>

      {/* Repay */}
      <>
        {active == "repay" && (
          <Repay
            checkContent={checkContent}
            address={address}
            tokens={tokens}
            handleSelectOpen={handleSelectOpen}
            selectedToken={selectedToken}
          />
        )}
      </>

      <SelectToken
        isVisible={openSelect}
        onClose={handleSelectClose}
        setSelectedToken={setSelectedToken}
      />
    </Modal>
  );
};

export default TreasuryModal;
