import React, { useState } from "react";
import Modal from "./Modal";
import { StyleSheet, css } from "aphrodite";

type FactoryProps = {
  isVisible: boolean;
  onClose: () => void;
};
const FactoryModal = ({ isVisible, onClose }: FactoryProps) => {
  const styles = Styles();

  const [active, setActive] = useState("bond");

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
        <div className={css(styles.modalTitle)}>Factory Modal</div>
        <div className={css(styles.modalClose)}>
          <span className={css(styles.close)} onClick={onClose}>
            &times;
          </span>
        </div>
      </div>
      <ul className={css(styles.tabs)}>
        <li className={checkTab("bond")} onClick={() => changeActive("bond")}>
          Bond
        </li>
        <li
          className={checkTab("redeem")}
          onClick={() => changeActive("redeem")}
        >
          Redeem
        </li>
        <li className={checkTab("nft")} onClick={() => changeActive("nft")}>
          Nft Action
        </li>
      </ul>
      <div className={checkContent("bond")}>
        Deposit BUSDC to bond BUSDC
        <div className={css(styles.footer)}>
          <button className={css(styles.densed)}>Approve</button>
        </div>
      </div>
      <div className={checkContent("redeem")}>
        Redeem
        <div className={css(styles.footer)}>
          <button className={css(styles.densed)}>Claim</button>
        </div>
      </div>
      <div className={checkContent("nft")}>
        NFT
        <div className={css(styles.footer)}>
          <button className={css(styles.densed)}>Create new Action</button>
        </div>
      </div>
    </Modal>
  );
};

export default FactoryModal;

const Styles = () => {
  return StyleSheet.create({
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
    },
    modalTitle: {
      fontWeight: "bold",
      fontSize: "24px",
    },
    modalClose: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalPercent: {
      color: "#4AC8D4",
      fontWeight: "bold",
      fontSize: "14px",
      marginRight: "15px",
    },

    close: {
      color: "#7E7E7E",
      fontSize: "34px",
      cursor: "pointer",
      lineHeight: "100%",
      fontWeight: "bold",
      ":hover": {
        color: "#565656",
      },
    },
    tabs: {
      display: "flex",
      justifyContent: "space-between",
      listStyle: "none",
      margin: "25px 0 15px 0",
    },
    tabItem: {
      flex: 1,
      textTransform: "uppercase",
      fontSize: "14px",
      color: "#B6B6B6",
      textAlign: "center",
      fontWeight: "bold",
      cursor: "pointer",
    },
    tabContent: {
      display: "none",
    },
    activeContent: {
      display: "block",
    },
    activeItem: {
      color: "#4AC8D4",
      borderBottom: "2px solid #4AC8D4",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
    },
    densed: {
      background: "#4AC8D4",
      color: "#fff",
      fontWeight: "bold",
      borderRadius: "5px",
      flex: "1",
    },
    outlined: {
      border: "1px solid #4AC8D4",
      borderRadius: "5px",
      fontWeight: "bold",
      color: "#4AC8D4",
    },
  });
};
