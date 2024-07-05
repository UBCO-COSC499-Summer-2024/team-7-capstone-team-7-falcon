"use client";

import { Label, TextInput, FileInput } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { ExamData } from "../../../typings/backendDataTypes";
import { useState } from "react";
import { examsAPI } from "../../../api/examAPI";
import { Status } from "../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import ModalMessage from "../../components/modalMessage";

interface InputExamProps {
  course_id: number;
}

const InputExam: React.FC<InputExamProps> = ({ course_id }) => {
  const [status, setStatus] = useState(Status.Pending);
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
      {status === Status.Success && redirect(`../${course_id}`)}
      {status === Status.Failure && (
        <ModalMessage message={"Error creating exam"} onClose={resetStatus} />
      )}
      {status === Status.InvalidDate && (
        <ModalMessage message={"Invalid date entered"} onClose={resetStatus} />
      )}
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 p-4 ring ring-gray-300 rounded-md">
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

          <Label className="block" htmlFor="pdf" value="Exam paper" />
          <div className="flex w-1/6 h-1/8 items-center justify-center">
            <Label
              htmlFor="pdf"
              className="flex w-full cursor-pointer flex-col items-center
                    justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100
                    dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  className="mb-4 w-8 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5
                        5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0
                        0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400 ">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  PDF ONLY
                </p>
              </div>
              <FileInput id="pdf" onChange={handleInput} className="hidden" />
            </Label>
          </div>
          <button
            type="submit"
            className="text-white bg-purple-700 hover:bg-purple-800
                focus:ring-4 focus:outline-none focus:ring-purple-300
                font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Publish
          </button>
        </div>
      </form>
    </>
  );
};

export default InputExam;
