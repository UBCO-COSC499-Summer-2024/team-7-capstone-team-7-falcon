"use client";
import React, { ChangeEvent, useState } from "react";
import { StudentSubmission } from "../../typings/backendDataTypes";
import { examsAPI } from "../../api/examAPI";
import toast from "react-hot-toast";
import { Alert } from "flowbite-react";
import { useRouter } from "next/navigation";

interface BubbleSheetUIProps {
  submission: StudentSubmission;
  examId: number;
  courseId: number;
  submissionId: number;
  disableEdit?: boolean;
  refreshDispute?: () => void;
}

enum BubbleStyle {
  None = "none",
  Wrong = "wrong",
  Correct = "correct",
}

const BubbleSheetUI: React.FC<BubbleSheetUIProps> = ({
  submission,
  examId,
  courseId,
  submissionId,
  disableEdit,
  refreshDispute,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number[];
  }>({});
  const router = useRouter();
  const [detailedSubmission, setDetailedSubmission] = useState(
    submission.answers,
  );

  // If answer list doesn't exist it will only render an error banner
  if (!detailedSubmission.answer_list) {
    return (
      <Alert color="red" className="w-full mb-3">
        This submission was graded incorrectly. An answer list is missing.
      </Alert>
    );
  }

  const questionsPerColumn = 30;
  const questionCount = detailedSubmission.answer_list.length;
  const options = ["A", "B", "C", "D", "E"];

  const handleInputChange = async (
    e: ChangeEvent<HTMLInputElement>,
    questionIndex: number,
  ) => {
    const value = Number(e.target.value);

    if (isNaN(parseInt(e.target.value))) {
      return;
    }

    if (value < 0 || value > 1) {
      toast.error("Score must be 0 or 1");
      return;
    }

    if (value % 1 !== 0) {
      toast.error("Score must be a whole number");
      return;
    }

    const updatedAnswerList = { ...detailedSubmission };
    updatedAnswerList.answer_list[questionIndex] = {
      ...updatedAnswerList.answer_list[questionIndex],
      score: value,
    };

    setDetailedSubmission(updatedAnswerList);

    const response = await examsAPI.updateGrade(
      examId,
      courseId,
      submissionId,
      detailedSubmission,
    );

    if (response && response.status === 200) {
      toast.success("Answers updated", {
        duration: 1_500,
      });
      router.refresh();
      if (refreshDispute) {
        refreshDispute();
      }
    } else {
      toast.error("Error updating answers");
    }
  };

  // Computes the styles used for each circle in the bubble sheet
  const preComputeAnswers = () => {
    const questionStyleMap: BubbleStyle[][] = [];
    detailedSubmission.answer_list.map((question, index) => {
      const { answered, expected } = question;
      const questionStyle: BubbleStyle[] = [];
      for (let i = 0; i < options.length; i++) {
        if (expected.includes(i)) {
          questionStyle[i] = BubbleStyle.Correct;
        } else if (answered.includes(i)) {
          questionStyle[i] = BubbleStyle.Wrong;
        } else {
          questionStyle[i] = BubbleStyle.None;
        }
      }
      questionStyleMap.push(questionStyle);
    });
    return questionStyleMap;
  };

  const questionStyleMap: BubbleStyle[][] = preComputeAnswers();

  const handleSelectedOptionChange = (row: number, index: number) => {
    setSelectedOptions((prev) => {
      const selected = prev[row] || [];

      if (selected.includes(index)) {
        return {
          ...prev,
          [row]: selected.filter((i) => i !== index),
        };
      } else {
        return {
          ...prev,
          [row]: [...selected, index],
        };
      }
    });
  };

  // Returns true if the question and option were filled out by the student in the submission
  function isCheckedByDefault(questionIndex: number, index: any) {
    const { answered } = detailedSubmission.answer_list[questionIndex];
    if (answered.includes(index)) {
      return true;
    }
    return false;
  }

  return (
    <div className="flex flex-row overflow-x-scroll w-3/4">
      {[...Array(Math.ceil(Number(questionCount) / questionsPerColumn))].map(
        (_, columnIndex) => (
          <div className="flex flex-col" key={columnIndex}>
            {[...Array(questionsPerColumn)].map((_, rowIndex) => {
              const questionIndex = columnIndex * questionsPerColumn + rowIndex;
              if (questionIndex >= Number(questionCount)) return null;
              return (
                <div className="flex mt-4 mx-3 justify" key={questionIndex}>
                  <p className="w-8 block font-bold mr-2">
                    {questionIndex + 1}
                  </p>
                  {options.map((option, index) => {
                    const status = questionStyleMap[questionIndex][index];
                    let borderClass = "border border-gray-400";
                    if (status === BubbleStyle.Correct) {
                      borderClass = "border-4 border-green-400";
                    } else if (status === BubbleStyle.Wrong) {
                      borderClass = "border-4 border-red-700";
                    }

                    return (
                      <label
                        key={index}
                        htmlFor={`checkbox-${questionIndex}-${index}`}
                        className="flex items-center cursor-pointer text-gray-700"
                      >
                        <input
                          type="checkbox"
                          id={`checkbox-${questionIndex}-${index}`}
                          name={`option-group-${questionIndex}`}
                          value={option}
                          checked={
                            isCheckedByDefault(questionIndex, index) ||
                            selectedOptions[questionIndex]?.includes(index)
                          }
                          onChange={() =>
                            handleSelectedOptionChange(questionIndex, index)
                          }
                          className="hidden peer"
                          disabled={true}
                        />
                        <span
                          className={`relative w-6 h-6 inline-block mr-2 rounded-full bg-white peer-checked:bg-black transition duration-200 ${borderClass}`}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-gray-700 peer-checked:text-black">
                            {option}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                  <input
                    type="text"
                    defaultValue={
                      detailedSubmission.answer_list[questionIndex].score
                    }
                    onChange={(e) => handleInputChange(e, questionIndex)}
                    className={
                      `mx-1 p-0 w-5 justify-right text-center ` +
                      (disableEdit ? "bg-gray-200" : "")
                    }
                    disabled={disableEdit}
                  />
                </div>
              );
            })}
          </div>
        ),
      )}
    </div>
  );
};

export default BubbleSheetUI;
