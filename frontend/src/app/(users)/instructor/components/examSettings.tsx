"use client";

import { examsAPI } from "@/app/api/examAPI";
import { ExamSettingsProps } from "@/app/components/type";
import { saveAs } from "file-saver";
import { Download, Eye, EyeSlash, Upload } from "flowbite-react-icons/solid";
import { useState } from "react";
import toast from "react-hot-toast";
import UploadExamSubmissionsModal from "./uploadExamSubmissionsModal";

const ExamSettings: React.FC<ExamSettingsProps> = ({
  examId,
  courseId,
  examFolder,
  gradesReleasedAt = 0,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [gradesReleased, setGradesReleased] = useState<boolean>(
    gradesReleasedAt > 0,
  );

  const releaseGrades = async () => {
    if (gradesReleased) {
      const result = await examsAPI.hideExamGrades(examId, courseId);

      if (result && result.status === 200) {
        toast.success("Grades hidden successfully");
        setGradesReleased(false);
      } else {
        toast.error(result.response.data.message);
      }
      return;
    }

    const result = await examsAPI.releaseExamGrades(examId, courseId);

    if (result && result.status === 200) {
      setGradesReleased(true);
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
        disabled={!!examFolder && examFolder?.length !== 0}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="space-x-4 flex items-center">
          <Upload />
          <span>Upload Submissions</span>
        </div>
      </button>
      <button
        type="button"
        className="btn-primary flex justify-center bg-purple w-full disabled:bg-purple-300"
        onClick={() => downloadSubmissionGrades()}
      >
        <div className="space-x-4 flex items-center">
          <Download />
          <span>Download Results CSV</span>
        </div>
      </button>
      <button
        type="button"
        className="btn-primary flex justify-center bg-purple w-full disabled:bg-purple-300"
        onClick={() => releaseGrades()}
      >
        <div className="space-x-4 flex items-center">
          {!gradesReleased ? <Eye /> : <EyeSlash />}
          <span>{gradesReleased ? "Hide Grades" : "Release Grades"}</span>
        </div>
      </button>
    </div>
  );
};

export default ExamSettings;
