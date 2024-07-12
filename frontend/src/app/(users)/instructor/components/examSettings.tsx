"use client";

import { examsAPI } from "@/app/api/examAPI";
import { saveAs } from "file-saver";
import { CheckPlusCircle, Download, Upload } from "flowbite-react-icons/solid";
import Link from "next/link";
import toast from "react-hot-toast";

type ExamSettingsProps = {
  examId: number;
  courseId: number;
};

const ExamSettings: React.FC<ExamSettingsProps> = ({ examId, courseId }) => {
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

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="btn-primary flex justify-center bg-purple w-full"
      >
        <Link href={""} className="space-x-4 flex items-center">
          <Upload />
          <span>Upload Submissions</span>
        </Link>
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
