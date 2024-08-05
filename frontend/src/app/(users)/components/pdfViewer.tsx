"use client";
import React, { useEffect, useState } from "react";
import { examsAPI } from "../../api/examAPI";
import toast from "react-hot-toast";
import { Spinner } from "flowbite-react";

const PdfViewer: React.FC<{
  courseId: number;
  submissionId: number;
  userId?: number;
  width?: string;
}> = ({ courseId, submissionId, userId }) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        let response;
        if (!userId) {
          response = await examsAPI.getSubmissionPDFbySubmissionId(
            courseId,
            submissionId,
          );
        } else {
          response = await examsAPI.getStudentSubmissionPDF(
            courseId,
            submissionId,
            userId,
          );
        }
        const blob = new Blob([response.data], { type: "application/pdf" });
        const pdfBlobUrl = URL.createObjectURL(blob);
        setPdfUrl(pdfBlobUrl);
      } catch (error) {
        toast.error("Error generating pdf");
      }
    };

    fetchPdf();
  }, []);

  return (
    <div className="relative w-full h-full">
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="1000px"
          title="PDF Viewer"
          className="h-100"
        />
      ) : (
        <Spinner className="mx-auto w-full" />
      )}
    </div>
  );
};

export default PdfViewer;
