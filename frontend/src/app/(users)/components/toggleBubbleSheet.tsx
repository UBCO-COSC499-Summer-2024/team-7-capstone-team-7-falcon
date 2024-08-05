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
  return (
    <div className="flex overflow-x-visible space-x-2">
      <BubbleSheetUI
        submission={submission}
        courseId={courseId}
        examId={examId}
        submissionId={submissionId}
        disableEdit={disableEdit}
        refreshDispute={refreshDispute}
      />
      <PdfViewer
        courseId={courseId}
        submissionId={submissionId}
        userId={userId}
      />
    </div>
  );
};

export default ToggleBubbleSheet;
