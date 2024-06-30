"use client";
import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "chai";

const RedirectModal: React.FC<{ message: string }> = (message) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [redirect, setRedirect] = useState(false);

  const handleRedirect = () => {
    setIsModalOpen(false);
    setRedirect(true);
  };

  useEffect(() => {
    if (redirect) {
      router.push("/login");
    }
  }, [redirect, router]);

  return (
    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} popup>
      <Modal.Header className="p-1" />
      <Modal.Body>
        <div className="flex justify-center">
          <p className="p-5">{message.message}</p>
        </div>
        <div className="flex justify-center">
          <Button color="purple" onClick={handleRedirect}>
            {"Ok!"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RedirectModal;
