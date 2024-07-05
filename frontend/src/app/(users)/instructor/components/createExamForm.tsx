"use client";

import { Label, TextInput, FileInput } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { ExamData } from "../../../typings/backendDataTypes";
import { useState } from "react";
import { examsAPI } from "../../../api/examAPI";
import { Status } from "../../../typings/backendDataTypes";
import ModalMessage from "../../components/modalMessage";
import { redirect } from "next/navigation";
import { Plus } from "flowbite-react-icons/outline";
import BubbleSheetModal from "./bubbleSheetModal";

interface CreateExamFormProps {
  course_id: number;
}

const CreateExamForm: React.FC<CreateExamFormProps> = ({ course_id }) => {
  const [status, setStatus] = useState(Status.Pending);
  const [isBubbleSheetOpen, setBubbleSheetOpen] = useState(false);
  const [examData, setData] = useState<ExamData>({
    exam_name: "",
    exam_date: -1,
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
    if (examData.exam_date < Date.now()) {
      setStatus(Status.InvalidDate);
      return;
    }
    const result = await examsAPI.createExam(examData, course_id);
    if (result.status == 200) {
      setStatus(Status.Success);
    } else {
      setStatus(Status.Failure);
    }
  };

  return (
    <>
      {isBubbleSheetOpen && (
        <BubbleSheetModal onClose={resetBubbleSheetModal} />
      )}
      {status === Status.Success && redirect(`../${course_id}`)}
      {status === Status.Failure && (
        <ModalMessage message={"Error creating exam"} onClose={resetStatus} />
      )}
      {status === Status.InvalidDate && (
        <ModalMessage message={"Invalid date entered"} onClose={resetStatus} />
      )}
      <form onSubmit={handleSubmit}>
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
          />
          <Label
            className="justify-center my-4"
            htmlFor="pdf"
            value="Exam paper"
          />
          <div className="w-1/12">
            <div
              className="flex flex-col justify-start w-5/6 rounded-md border-2 py-4 cursor-pointer"
              onClick={() => setBubbleSheetOpen(true)}
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
