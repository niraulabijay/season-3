import React from "react";
import Modal from "./Modal";

type PirateProps = {
  isVisible: boolean;
  onClose: () => void;
};
const PirateModal = ({ isVisible, onClose }: PirateProps) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <>Pirate Modal</>
    </Modal>
  );
};

export default PirateModal;
