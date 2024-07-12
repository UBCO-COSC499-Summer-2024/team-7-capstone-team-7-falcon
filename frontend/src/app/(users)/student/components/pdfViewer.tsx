"use client";
import React, { useEffect, useState } from "react";
import { examsAPI } from "../../../api/examAPI";

const PdfViewer: React.FC<{
  courseId: number;
  submissionId: number;
  userId: number;
}> = ({ courseId, submissionId, userId }) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await examsAPI.getStudentSubmissionPDF(
          courseId,
          submissionId,
          userId,
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const pdfBlobUrl = URL.createObjectURL(blob);
        setPdfUrl(pdfBlobUrl);
      } catch (error) {
        console.error("Error generating pdf:", error);
      }
    };

    fetchPdf();
  }, []);
  
  return (
    <div>
      {pdfUrl ? (
        // TODO: Change height from pixels to relative units
        <iframe src={pdfUrl} width="90%" height="1000px" title="PDF Viewer" />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default PdfViewer;
