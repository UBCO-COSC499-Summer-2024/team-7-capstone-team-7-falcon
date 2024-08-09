"use client";

import { Label, TextInput } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { ExamData } from "../../../typings/backendDataTypes";
import { useState } from "react";
import { examsAPI } from "../../../api/examAPI";
import { Status } from "../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import { Plus } from "flowbite-react-icons/outline";
import BubbleSheetModal from "./bubbleSheetModal";
import toast, { Toaster } from "react-hot-toast";
import { datePickerTheme } from "@/app/components/datePickerTheme";

interface CreateExamFormProps {
  courseId: number;
  courseName: string;
  courseCode: string;
}

const CreateExamForm: React.FC<CreateExamFormProps> = ({
  courseId,
  courseCode,
  courseName,
}) => {
  const [status, setStatus] = useState(Status.Pending);
  const [isBubbleSheetOpen, setBubbleSheetOpen] = useState(false);
  const [examData, setData] = useState<ExamData>({
    exam_name: "",
    exam_date: parseInt(new Date().getTime().toString()) + 86_400_000,
  });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...examData, [event.target.id]: event.target.value });
  };

  const handleDate = (date: Date) => {
    setData({ ...examData, exam_date: date.getTime() });
  };

  const resetStatus = () => {
    setStatus(Status.Pending);
  };

  const resetBubbleSheetModal = () => {
    setBubbleSheetOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (examData.exam_name.trim().length === 0) {
      toast.error("Exam name cannot be empty!");
      return;
    }

    if (examData.exam_name.length >= 46) {
      toast.error(
        "Exam name is too long, it can not be longer than 46 characters!",
      );
      return;
    }

    if (examData.exam_date < Date.now()) {
      toast.error("Exam date must be in the future");
      return;
    }

    const result = await examsAPI.createExam(examData, courseId);
    if (result.status == 200) {
      setStatus(Status.Success);
    } else {
      toast.error("Failed to create exam");
      resetStatus();
    }
  };

  const handleBubbleSheetModal = () => {
    if (examData.exam_name.trim().length === 0) {
      toast.error("Exam name must not be empty!");
      return;
    }

    if (examData.exam_name.length >= 46) {
      toast.error(
        "Exam name is too long, it can not be longer than 46 characters!",
      );
      return;
    }

    setBubbleSheetOpen(true);
  };

  const setDateToTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  };

  return (
    <>
      {isBubbleSheetOpen && (
        <BubbleSheetModal
          onClose={resetBubbleSheetModal}
          courseCode={courseCode}
          courseName={courseName}
          examName={examData.exam_name}
        />
      )}
      {status === Status.Success && redirect(`../${courseId}/exam`)}
      <form onSubmit={handleSubmit}>
        <Toaster />
        <div className="space-y-5 p-4 ring ring-gray-300 rounded-md flex flex-col">
          <Label className="block" htmlFor="exam_name" value="Exam Name" />
          <TextInput
            className="w-1/4"
            id="exam_name"
            onChange={handleInput}
            type="text"
            sizing="md"
          />

          <Label className="block" htmlFor="exam_date" value="Exam Date" />
          <Datepicker
            className="w-1/4"
            onSelectedDateChanged={handleDate}
            id="exam_date"
            minDate={setDateToTomorrow()}
            showTodayButton={false}
            theme={datePickerTheme}
          />
          <Label
            className="justify-center my-4"
            htmlFor="pdf"
            value="Generate a custom bubble sheet exam (Optional)"
          />
          <div className="w-1/12">
            <div
              className="flex flex-col justify-start w-5/6 rounded-md border-2 py-4 cursor-pointer"
              onClick={() => handleBubbleSheetModal()}
            >
              <Plus className="ml-8 text-purple-700 justify-center" />
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-purple-700 hover:bg-purple-800
                focus:ring-4 focus:outline-none focus:ring-purple-300
                font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4"
          >
            Publish
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateExamForm;
