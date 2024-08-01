import { examsAPI } from "@/app/api/examAPI";
import { Alert, FileInput, Label, Modal } from "flowbite-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface UploadExamSubmissionsModalProps {
  examId: number;
  courseId: number;
  onClose?(): void;
}

const UploadExamSubmissionsModal: React.FC<UploadExamSubmissionsModalProps> = ({
  examId,
  courseId,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const [files, setFiles] = useState<{
    answerKey: File | null;
    submissions: File | null;
  }>({
    answerKey: null,
    submissions: null,
  });

  const handleClose = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };
  const handleAnswerKeyUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      setFiles({ ...files, answerKey: event.target.files[0] });
    }
  };

  const handleSubmissionsUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      setFiles({ ...files, submissions: event.target.files[0] });
    }
  };

  const handleUpload = async () => {
    const { answerKey, submissions } = files;

    if (!answerKey || !submissions) {
      toast.error(
        "Please select both the answer key and student submissions files.",
      );
      return;
    }

    if (answerKey.size >= submissions.size) {
      toast.error(
        "The answer key file should be smaller in size than the student submissions file.",
      );
      return;
    }

    const formData = new FormData();
    formData.append("answerKey", answerKey);
    formData.append("submissions", submissions);

    const result = await examsAPI.uploadExamSubmissions(
      formData,
      examId,
      courseId,
    );

    if (result && result.status === 200) {
      toast.success(
        "Submissions uploaded successfully. Check back later for the results.",
        { duration: 5_000 },
      );
      handleClose();
    } else {
      toast.error(result.response.data.message);
    }
  };

  return (
    <Modal show={isModalOpen} onClose={handleClose}>
      <Modal.Header>
        <h2>Answer Key and Submissions Upload</h2>
      </Modal.Header>
      <Modal.Body>
        <Alert color="purple" rounded className="mb-4">
          <p>
            Please upload the answer key and student submissions in PDF format.
          </p>
          <p className="mt-3">
            You should upload two files: one for the answer key and one for the
            student submissions.
          </p>
          <p className="font-bold mt-3">
            {" "}
            The answer key file size should be smaller in size than the student
            submissions file.
          </p>
        </Alert>
        <div>
          <div>
            <Label htmlFor="answer-key-upload" value="Upload your answer key" />
          </div>
          <FileInput
            id="answer-key-upload"
            className="mt-4"
            onChange={handleAnswerKeyUpload}
            accept="application/pdf"
          />
        </div>

        <div className="mt-5">
          <div>
            <Label
              htmlFor="submissions-upload"
              value="Upload your submissions"
            />
          </div>
          <FileInput
            id="submissions-upload"
            className="mt-4"
            onChange={handleSubmissionsUpload}
            accept="application/pdf"
          />
        </div>

        <div className="mt-10">
          <button
            onClick={() => handleUpload()}
            disabled={!files.answerKey || !files.submissions}
            className="w-full btn-primary disabled:bg-purple-400"
          >
            Upload
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UploadExamSubmissionsModal;
