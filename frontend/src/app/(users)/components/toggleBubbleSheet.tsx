"use client";
import React, { useState } from "react";
import { Edit, FilePdf } from "flowbite-react-icons/solid";
import PdfViewer from "./pdfViewer";
import BubbleSheetUI from "./bubbleSheetUI";
import { StudentSubmission } from "../../typings/backendDataTypes";

const ToggleBubbleSheet: React.FC<{
  courseId: number;
  submissionId: number;
  examId: number;
  submission: StudentSubmission;
  disableEdit?: boolean;
  userId?: number;
  refreshDispute?: () => void;
}> = ({
  courseId,
  submissionId,
  submission,
  examId,
  disableEdit,
  userId,
  refreshDispute,
}) => {
  const [bubbleSheetUI, setBubbleSheetUI] = useState<boolean>(true);

  const toggleBubbleSheetUI = () => {
    setBubbleSheetUI(!bubbleSheetUI);
  };

  return (
    <div className="relative">
      <div className="z-10 my-4 flex rounded-md space-x-3">
        <button
          className="flex items-center btn-primary"
          onClick={toggleBubbleSheetUI}
        >
          <Edit width={20} height={20} />
          Edit Submission Grades
        </button>
        <button
          className="flex items-center btn-primary"
          onClick={toggleBubbleSheetUI}
        >
          <FilePdf width={20} height={20} />
          View PDF Submission
        </button>
      </div>
      {bubbleSheetUI && (
        <PdfViewer
          courseId={courseId}
          submissionId={submissionId}
          userId={userId}
        />
      )}
      {!bubbleSheetUI && (
        <BubbleSheetUI
          submission={submission}
          courseId={courseId}
          examId={examId}
          submissionId={submissionId}
          disableEdit={disableEdit}
          refreshDispute={refreshDispute}
        />
      )}
    </div>
  );
};

export default ToggleBubbleSheet;
