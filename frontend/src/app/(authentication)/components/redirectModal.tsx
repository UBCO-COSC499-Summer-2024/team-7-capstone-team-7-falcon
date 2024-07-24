"use client";
import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RedirectModalProps {
  message: string;
  redirectPath: string;
  buttonText: string;
}

const RedirectModal: React.FC<RedirectModalProps> = (props) => {
  const { message, redirectPath, buttonText } = props;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [redirect, setRedirect] = useState(false);

  const handleRedirect = () => {
    setIsModalOpen(false);
    setRedirect(true);
  };

  useEffect(() => {
    if (redirect) {
      router.push(redirectPath);
    }
  }, [redirect, redirectPath, router]);

  return (
    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} popup>
      <Modal.Header className="p-1" />
      <Modal.Body>
        <div className="flex justify-center">
          <p className="p-5">{message}</p>
        </div>
        <div className="flex justify-center">
          <Button color="purple" onClick={handleRedirect}>
            {buttonText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RedirectModal;
