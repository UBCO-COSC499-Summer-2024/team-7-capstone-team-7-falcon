import { examsAPI } from "@/app/api/examAPI";
import { ExamSubmissionDispute } from "@/app/typings/backendDataTypes";
import { Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";

interface DisputeExamSubmissionChangeGradeModalProps {
  setShowModal: (showModal: boolean) => void;
  refreshDispute: () => void;
  dispute: ExamSubmissionDispute;
  examId: number;
  courseId: number;
}

const DisputeExamSubmissionChangeGradeModal: React.FC<
  DisputeExamSubmissionChangeGradeModalProps
> = ({ setShowModal, refreshDispute, dispute, examId, courseId }) => {
  const [grade, setGrade] = useState(`${dispute.submission.score}`);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGrade(event.target.value);
  };

  return (
    <Modal title="Change Grade" show={true} onClose={() => setShowModal(false)}>
      <Modal.Header>
        <h2>Change Submission Grade</h2>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="space-y-2">
            <Label className="text-1xl">Grade:</Label>
            <TextInput
              id="submission_grade"
              onChange={handleInput}
              value={grade}
              type="text"
              theme={{
                field: {
                  input: {
                    colors: {
                      gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500",
                    },
                  },
                },
              }}
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-3">
            Save
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DisputeExamSubmissionChangeGradeModal;
