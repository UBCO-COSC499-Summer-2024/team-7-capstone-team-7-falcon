"use client";
import React, { ChangeEvent, useState } from "react";
import { StudentSubmission } from "../../typings/backendDataTypes";
import { examsAPI } from "../../api/examAPI";
import toast from "react-hot-toast";

interface BubbleSheetUIProps {
  submission: StudentSubmission;
  examId: number;
  courseId: number;
  submissionId: number;
  disableEdit?: boolean;
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
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number[];
  }>({});

  const [detailedSubmission, setDetailedSubmission] = useState(
    submission.answers,
  );

  //useeffect that updates whenever the data is updated too that is making a patch request

  const questionsPerColumn = 75;
  const questionCount = detailedSubmission.answer_list.length;
  const options = ["A", "B", "C", "D", "E"];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    questionIndex: number,
  ) => {
    const value = Number(e.target.value);
    const score = value === 0 || value === 1 ? value : 0;

    const updatedAnswerList = { ...detailedSubmission };
    updatedAnswerList.answer_list[questionIndex] = {
      ...updatedAnswerList.answer_list[questionIndex],
      score: score,
    };

    setDetailedSubmission(updatedAnswerList);
  };

  const handleKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      const response = await examsAPI.updateGradeWithAnswers(
        examId,
        courseId,
        submissionId,
        detailedSubmission,
      );
      if (response && response.status === 200) {
        toast.success("Answers updated", {
          duration: 5_000,
        });
      } else {
        toast.error("Error updating answers");
      }
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
    <div className="flex flex-row mt-4">
      {[...Array(Math.ceil(Number(questionCount) / questionsPerColumn))].map(
        (_, columnIndex) => (
          <div className="flex flex-col mt-4" key={columnIndex}>
            {[...Array(questionsPerColumn)].map((_, rowIndex) => {
              const questionIndex = columnIndex * questionsPerColumn + rowIndex;
              if (questionIndex >= Number(questionCount)) return null;
              return (
                <div className="flex mt-4 mx-1 justify" key={questionIndex}>
                  <p className="pr-2">{questionIndex + 1}</p>
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
                    onKeyDown={handleKeyPress}
                    className="mx-1 p-0 w-2/12 justify-right"
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
