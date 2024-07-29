"use client";

import DisputeExamSubmissionCard from "@/app/(users)/instructor/components/disputeExamSubmissionCard";
import { examsAPI } from "@/app/api/examAPI";
import {
  ExamSubmissionDispute,
  StudentSubmission,
} from "@/app/typings/backendDataTypes";
import { Spinner } from "flowbite-react";
import { ArrowLeft } from "flowbite-react-icons/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import ToggleBubbleSheet from "../../../../../../../../components/toggleBubbleSheet";

const DisputeExamSubmissionPage = ({
  params,
}: {
  params: { disputeId: string; courseId: number; examId: number };
}) => {
  const disputeId = Number(params.disputeId);
  const courseId = Number(params.courseId);
  const [dispute, setDispute] = useState<ExamSubmissionDispute | null>(null);
  const [showSubmission, setShowSubmission] = useState(false);
  const [submission, setSubmission] = useState<StudentSubmission | null>(null);

  const fetchDispute = async () => {
    const response = await examsAPI.getExamSubmissionDispute(
      courseId,
      disputeId,
    );
    if (response.status === 200) {
      setDispute(response.data);
    }
  };

  const getSubmission = async () => {
    if (dispute) {
      const submissionResponse = await examsAPI.getSubmissionById(
        courseId,
        dispute.submission.id,
      );

      if (submissionResponse) {
        setSubmission(submissionResponse.data);
      }
    }
  };

  useEffect(() => {
    fetchDispute();
  }, []);

  useEffect(() => {
    getSubmission();
  }, [dispute]);

  return dispute ? (
    <div>
      <div className="flex items-center mb-3 space-x-3">
        <Link href="../" className="space-x-4 flex items-center btn-primary">
          <ArrowLeft />
          Back
        </Link>
        <h1 className="block text-xl font-bold">
          Exam&apos;s Submission Dispute
        </h1>
      </div>
      <DisputeExamSubmissionCard
        courseId={courseId}
        dispute={dispute}
        showSubmission={showSubmission}
        setShowSubmission={setShowSubmission}
        refreshDispute={fetchDispute}
        examId={params.examId}
      />
      <div className="mb-10" />
      {showSubmission && submission ? (
        <ToggleBubbleSheet
          courseId={courseId}
          submissionId={dispute.submission.id}
          examId={params.examId}
          submission={submission}
        />
      ) : null}
    </div>
  ) : (
    <Spinner className="mx-auto w-full" />
  );
};

export default DisputeExamSubmissionPage;
