"use client";

import { examsAPI } from "@/app/api/examAPI";
import { ExamSettingsProps } from "@/app/components/type";
import { saveAs } from "file-saver";
import { CheckPlusCircle, Download, Upload } from "flowbite-react-icons/solid";
import { useState } from "react";
import toast from "react-hot-toast";
import UploadExamSubmissionsModal from "./uploadExamSubmissionsModal";

const ExamSettings: React.FC<ExamSettingsProps> = ({
  examId,
  courseId,
  examFolder,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const releaseGrades = async () => {
    const result = await examsAPI.releaseExamGrades(examId, courseId);

    if (result && result.status === 200) {
      toast.success("Grades released successfully");
    } else {
      toast.error(result.response.data.message);
    }
  };

  const downloadSubmissionGrades = async () => {
    const result = await examsAPI.downloadSubmissionGrades(examId, courseId);

    if (result && result.status === 200) {
      const blob = new Blob([result.data], { type: "text/csv" });

      saveAs(blob, "grades.csv");
      toast.success("Submission grades downloaded");
    } else {
      toast.error(result.response.data.message);
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3">
      {isModalOpen && (
        <UploadExamSubmissionsModal
          onClose={resetModal}
          examId={examId}
          courseId={courseId}
        />
      )}
      <button
        type="button"
        className="btn-primary flex justify-center bg-purple w-full disabled:bg-purple-400"
        disabled={examFolder.length !== 0}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="space-x-4 flex items-center">
          <Upload />
          <span>Upload Submissions</span>
        </div>
      </button>
      <button
        type="button"
        className="btn-primary flex justify-center bg-purple w-full"
        onClick={() => downloadSubmissionGrades()}
      >
        <div className="space-x-4 flex items-center">
          <Download />
          <span>Download Results CSV</span>
        </div>
      </button>
      <button
        type="button"
        className="btn-primary flex justify-center bg-purple w-full"
        onClick={() => releaseGrades()}
      >
        <div className="space-x-4 flex items-center">
          <CheckPlusCircle />
          <span>Release Grades</span>
        </div>
      </button>
    </div>
  );
};

export default ExamSettings;
