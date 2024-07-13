"use client";

import { examsAPI } from "@/app/api/examAPI";
import toast from "react-hot-toast";
import { ExamSettingsProps } from "./type";

const DangerZone: React.FC<ExamSettingsProps> = ({ examId, courseId }) => {
  const deleteExam = async () => {
    const result = await examsAPI.deleteExam(examId, courseId);

    if (result && result.status === 204) {
      toast.success("Exam deleted successfully", { duration: 1_000 });
      setTimeout(() => {
        window.location.href = `../exam`;
      }, 1_500);
    } else {
      toast.error(result.response.data.message);
    }
  };

  return (
    <div className="ring-1 rounded ring-red-700 p-3 flex flex-col">
      <p className="font-bold text-lg mb-2">Danger Zone</p>
      <p className="font-bold mt-2">Delete Exam</p>
      <p>If you delete this exam, you will not be able to undo it</p>
      <button
        className="ring-1 rounded ring-red-700 p-1 m-3 items-center"
        onClick={() => deleteExam()}
      >
        <p className="text-red-700 text-lg">Delete Exam</p>
      </button>
    </div>
  );
};

export default DangerZone;
