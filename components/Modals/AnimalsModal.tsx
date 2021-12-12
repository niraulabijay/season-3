import React from "react";
import Modal from "./Modal";

type AnimalProps = {
  isVisible: boolean;
  onClose: () => void;
};
const AnimalsModal = ({ isVisible, onClose }: AnimalProps) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <>Animal Modal</>
    </Modal>
  );
};

export default AnimalsModal;
