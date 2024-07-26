"use client";

import { examsAPI } from "@/app/api/examAPI";
import { ExamSubmissionDispute } from "@/app/typings/backendDataTypes";
import { Card, Label, Badge, Dropdown } from "flowbite-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DisputeExamSubmissionChangeGradeModal from "./disputeExamSubmissionChangeGradeModal";

interface DisputeExamSubmissionCardProps {
  courseId: number;
  dispute: ExamSubmissionDispute;
  showSubmission: boolean;
  setShowSubmission: (showSubmission: boolean) => void;
  refreshDispute: () => void;
}

const DisputeExamSubmissionCard: React.FC<DisputeExamSubmissionCardProps> = ({
  courseId,
  dispute,
  showSubmission,
  setShowSubmission,
  refreshDispute,
}) => {
  const [showModal, setShowModal] = useState(false);

  const badgeColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "warning";
      case "REJECTED":
        return "red";
      case "REVIEWING":
        return "blue";
      default:
        return "success";
    }
  };

  const updateStatus = async (status: number) => {
    const disputeStatusToText: { [key: number]: string } = {
      1: "RESOLVED",
      2: "REJECTED",
      3: "REVIEWING",
    };

    const response = await examsAPI.updateExamSubmissionDisputeStatus(
      courseId,
      dispute.id,
      disputeStatusToText[status],
    );
    if (response.status === 200) {
      toast.success("Dispute status updated successfully");
      refreshDispute();
    } else {
      toast.error("Failed to update dispute status");
    }
  };
  const handleModal = () => {
    setShowModal(true);
  };

  return (
    <Card>
      {showModal && (
        <DisputeExamSubmissionChangeGradeModal
          setShowModal={setShowModal}
          refreshDispute={refreshDispute}
          dispute={dispute}
        />
      )}
      <div className="space-y-3">
        <div className="flex-wrap flex gap-2">
          <Label className="font-bold">Created at:</Label>
          <Badge color="purple" size="sm">
            {new Date(Number(dispute.created_at)).toLocaleString()}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Label className="font-bold">Status:</Label>
          <Badge color={badgeColor(dispute.status)} size="sm">
            {`${dispute.status.charAt(0)}${dispute.status.slice(1).toLowerCase()}`}
          </Badge>
        </div>

        <div>
          <Label className="font-bold">Submission Details:</Label>
          <div className="flex flex-wrap gap-2 mt-1 space-x-3">
            <div className="gap-2 space-y-1">
              <Label>Student Name:</Label>{" "}
              <Badge className="text-sm" color="purple">
                {dispute.submission.student.user.first_name}{" "}
                {dispute.submission.student.user.last_name ?? ""}
              </Badge>
            </div>

            <div className="gap-2 space-y-1">
              <Label>Student ID:</Label>{" "}
              <Badge className="text-sm" color="purple">
                {dispute.submission.student.student_id}
              </Badge>
            </div>

            <div className="gap-2 space-y-1">
              <Label>Submission Date:</Label>{" "}
              <Badge className="text-sm" color="purple">
                {new Date(
                  Number(dispute.submission.created_at),
                ).toLocaleString()}
              </Badge>
            </div>

            <div className="gap-2 space-y-1">
              <Label>Submission Score:</Label>{" "}
              <Badge className="text-sm" color="purple">
                {dispute.submission.score}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Label className="font-bold">Dispute Description:</Label>
        <p className="text-sm mt-3">{dispute.description}</p>
      </div>

      <div className="space-y-3">
        <Label className="font-bold block">Actions:</Label>
        <div className="flex space-x-2">
          <button
            className="btn-primary p-2"
            onClick={() => setShowSubmission(!showSubmission)}
          >
            {showSubmission ? "Hide Submission" : "Show Submission"}
          </button>
          <Dropdown
            label="Update status"
            theme={{
              floating: {
                target:
                  "bg-purple-700 hover:bg-purple-700 focus:bg-purple-700 dark:enabled:bg-purple-700 focus:ring-4 focus:ring-purple-700 enabled:hover:bg-purple-700 dark:bg-purple-700 dark:focus:ring-purple-700 dark:enabled:hover:bg-purple-700",
              },
            }}
          >
            <Dropdown.Item onPointerDown={() => updateStatus(1)}>
              Resolve
            </Dropdown.Item>
            <Dropdown.Item onPointerDown={() => updateStatus(2)}>
              Reject
            </Dropdown.Item>
            <Dropdown.Item onPointerDown={() => updateStatus(3)}>
              In Review
            </Dropdown.Item>
          </Dropdown>

          <button className="btn-primary p-2" onClick={() => handleModal()}>
            Update Grade
          </button>
        </div>
      </div>
    </Card>
  );
};

export default DisputeExamSubmissionCard;
