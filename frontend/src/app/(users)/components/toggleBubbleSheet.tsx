"use client";
import React, { useState } from "react";
import { Edit, FilePdf } from "flowbite-react-icons/solid";
import PdfViewer from "../student/components/pdfViewer";
import BubbleSheetUI from "./bubbleSheetUI";
import { StudentSubmission } from "../../typings/backendDataTypes";

const ToggleBubbleSheet: React.FC<{
  courseId: number;
  submissionId: number;
  examId: number;
  submission: StudentSubmission;
}> = ({ courseId, submissionId, submission, examId }) => {
  const [bubbleSheetUI, setBubbleSheetUI] = useState<boolean>(true);

  const toggleBubbleSheetUI = () => {
    setBubbleSheetUI(!bubbleSheetUI);
  };

  return (
    <div className="relative">
      <div className="z-10 my-4 flex rounded-md">
        <Edit
          width={50}
          height={50}
          onClick={toggleBubbleSheetUI}
          className={`p-1 rounded ${
            !bubbleSheetUI
              ? "bg-purple-700 hover:bg-purple-800 text-white"
              : "border border-gray-200 hover:bg-gray-100"
          }`}
        />
        <FilePdf
          width={50}
          height={50}
          onClick={toggleBubbleSheetUI}
          className={`p-1 rounded ${
            bubbleSheetUI
              ? "bg-purple-700 hover:bg-purple-800 text-white"
              : "border border-gray-200 hover:bg-gray-100"
          }`}
        />
      </div>
      {bubbleSheetUI && (
        <PdfViewer courseId={courseId} submissionId={submissionId} />
      )}
      {!bubbleSheetUI && (
        <BubbleSheetUI
          submission={submission}
          courseId={courseId}
          examId={examId}
          submissionId={submissionId}
        />
      )}
    </div>
  );
};

export default ToggleBubbleSheet;
