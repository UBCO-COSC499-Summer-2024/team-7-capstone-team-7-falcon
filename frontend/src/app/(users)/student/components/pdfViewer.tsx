"use client";
import React, { useEffect, useState } from "react";
import { examsAPI } from "../../../api/examAPI";
import { Edit, FilePdf } from "flowbite-react-icons/solid";
import BubbleSheetUI from "../../components/bubbleSheetUI";

const PdfViewer: React.FC<{
  courseId: number;
  submissionId: number;
  userId: number;
}> = ({ courseId, submissionId, userId }) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [bubbleSheetUI, setBubbleSheetUI] = useState<boolean>(true);

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

  const toggleBubbleSheetUI = () => {
    setBubbleSheetUI(!bubbleSheetUI);
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10 flex m-2 bg-purple-700 rounded-md">
        <Edit
          width={50}
          height={50}
          onClick={toggleBubbleSheetUI}
          className={`p-1 ${bubbleSheetUI ? "btn-primary" : "btn-secondary"}`}
        />
        <FilePdf
          width={50}
          height={50}
          onClick={toggleBubbleSheetUI}
          className={`p-1 ${!bubbleSheetUI ? "btn-primary" : "btn-secondary"}`}
        />
      </div>
      {bubbleSheetUI && (
        <div>
          {pdfUrl ? (
            // TODO: Change height from pixels to relative units
            <iframe
              src={pdfUrl}
              width="100%"
              height="1000px"
              title="PDF Viewer"
            />
          ) : (
            <p>Loading PDF...</p>
          )}
        </div>
      )}
      {!bubbleSheetUI && <BubbleSheetUI submissionId={submissionId} />}
    </div>
  );
};

export default PdfViewer;
