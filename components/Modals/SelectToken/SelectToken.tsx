import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { css } from "aphrodite";
import { Styles } from "./Style";
import { bondingTokens, TokenDefinition } from "../../../helpers/networks";

type PoolProps = {
  isVisible: boolean;
  onClose: () => void;
  setSelectedToken: (token: any) => void;
};
const SelectToken = ({ isVisible, onClose, setSelectedToken }: PoolProps) => {
  const styles = Styles();
  const handleToken = (token: TokenDefinition) => {
    setSelectedToken(token);
    onClose();
  };
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className={css(styles.modalHeader)}>
        <div className={css(styles.modalTitle)}>Select a token</div>
        <div className={css(styles.modalClose)}>
          {/* <div className={css(styles.modalPercent)}>5% APY</div> */}
          <span className={css(styles.close)} onClick={onClose}>
            &times;
          </span>
        </div>
      </div>
      <div className={css(styles.listWrapper)}>
        {bondingTokens.map((token) => (
          <div
            className={css(styles.tokenList)}
            key={token.address}
            onClick={() => handleToken(token)}
          >
            <img src={token.logoURI} alt="" height="25" width="25" />
            <span className={css(styles.tokenName)}>{token.symbol}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default SelectToken;
