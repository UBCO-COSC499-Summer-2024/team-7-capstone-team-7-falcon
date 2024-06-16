import { Button, Modal } from "flowbite-react";
import React, { useState } from "react";

interface DashboardModalProps {
  buttonTitle: string;
  children: React.ReactNode;
}

const DashboardModal: React.FC<DashboardModalProps> = ({
  buttonTitle,
  children,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <>
      <Button
        color="purple"
        onClick={() => closeModal()}
        className="flex align-right"
      >
        {buttonTitle}
      </Button>
      <Modal
        show={modalOpen}
        size="lg"
        popup
        position={"center"}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header className="pl-2 pt-2">Create a new Course</Modal.Header>
        <Modal.Body className="mt-2">{children}</Modal.Body>
      </Modal>
    </>
  );
};

export default DashboardModal;
