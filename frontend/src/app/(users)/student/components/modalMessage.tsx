"use client";
import { Modal } from "flowbite-react";
import { useState } from "react";

const ModalMessage: React.FC<{ message: string }> = (message) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Modal.Header className="p-1" />
      <Modal.Body>
        <p className="p-5">{message.message}</p>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMessage;
