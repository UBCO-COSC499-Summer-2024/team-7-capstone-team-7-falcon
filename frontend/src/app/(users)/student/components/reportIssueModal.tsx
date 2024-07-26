import { examsAPI } from "@/app/api/examAPI";
import { Alert, Label, Modal, Textarea } from "flowbite-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ReportSubmissionIssueModalProps {
  onClose?(): void;
  submissionId: number;
  courseId: number;
}

const ReportSubmissionIssueModal: React.FC<ReportSubmissionIssueModalProps> = ({
  onClose,
  submissionId,
  courseId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [disputeDescription, setDisputeDescription] = useState<string>("");

  const handleClose = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (disputeDescription.trim().length === 0) {
      toast.error("Description cannot be empty!");
      return;
    }

    const result = await examsAPI.createSubmissionDispute(
      submissionId,
      courseId,
      disputeDescription,
    );

    if (result.status === 200) {
      toast.success("Dispute submitted successfully");
      handleClose();
    } else {
      toast.error(result.response.data.message);
    }
  };

  return (
    <Modal show={isModalOpen} onClose={() => handleClose()}>
      <Modal.Header>
        <h2 className="text-lg font-bold">Report Exam Submission Issue</h2>
      </Modal.Header>
      <Modal.Body>
        <Alert color="purple" rounded className="mb-4">
          <p>
            If you believe there is{" "}
            <strong>an issue with your graded submission</strong> due to
            incorrect grade calculation or other reasons, you can report the
            issue to your professor or TA. They will review your submission when
            they have a chance and make any necessary corrections.
          </p>
        </Alert>

        <div>
          <div className="mb-4">
            <Label htmlFor="issue-description" value="Describe the issue" />
          </div>
          <Textarea
            id="issue-description"
            required
            placeholder="Provide details about your issue with the grade submission. You are limited to 1,000 characters (or ~145 words)."
            rows={7}
            maxLength={1_000}
            onChange={(e) => setDisputeDescription(e.target.value)}
            className="focus:border-none dark:focus:border-none focus:ring-purple-700 dark:focus:ring-purple-700 resize-none"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn-primary w-full" onClick={handleSubmit}>
          Submit
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportSubmissionIssueModal;
