"use client";
import { Modal } from "flowbite-react";
import { useState } from "react";

interface ModalMessageProps {
  message: string;
  onClose?(): void;
}

const ModalMessage: React.FC<ModalMessageProps> = ({ message, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal show={isModalOpen} onClose={handleClose}>
      <Modal.Header className="p-1" />
      <Modal.Body>
        <p className="p-5">{message}</p>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMessage;
