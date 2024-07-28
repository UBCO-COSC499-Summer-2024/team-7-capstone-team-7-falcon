"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { DetailedSubmission } from "../../typings/backendDataTypes";
import { examsAPI } from "../../api/examAPI";
import toast from "react-hot-toast";

interface BubbleSheetUIProps {
  submissionId: number;
}

enum BubbleStyle {
  None = "none",
  Wrong = "wrong",
  Correct = "correct",
}

const BubbleSheetUI: React.FC<BubbleSheetUIProps> = ({ submissionId }) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number[];
  }>({});
  const [detailedSubmission, setDetailedSubmission] =
    useState<DetailedSubmission>({
      errorFlag: false,
      answerList: [],
    });

  useEffect(() => {
    const getSubmission = async () => {
      const detailedSubmission: DetailedSubmission =
        await examsAPI.getSubmissionByQuestion(submissionId);
      setDetailedSubmission(detailedSubmission);
    };
    getSubmission();
  }, []);

  //useeffect that updates whenever the data is updated too that is making a patch request

  const questionsPerColumn = 75;
  const questionCount = detailedSubmission.answerList.length;
  const options = ["A", "B", "C", "D", "E"];

  const [grade, setGrade] = useState<number[]>();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGrade(Number(e.target.value));
  };

  const handleKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      examsAPI.updateGrade(examId, courseId, submissionId, grade);
    }
  };

  // Computes the styles used for each circle in the bubble sheet
  const preComputeAnswers = () => {
    const questionStyleMap: BubbleStyle[][] = [];
    detailedSubmission.answerList.map((question, index) => {
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
    const { answered } = detailedSubmission.answerList[questionIndex];
    if (answered.includes(index)) {
      return true;
    }
    return false;
  }

  const submitJob = async () => {
    const payload = {};

    const response = await examsAPI.postBubbleSheet(payload);
    if (response.status === 202) {
      toast.success("Answers updated", {
        duration: 5_000,
      });
    } else {
      toast.error("Error updating answers");
    }
  };

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
                    value={detailedSubmission.answerList[questionIndex].score}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="mx-1 p-0 w-2/12 justify-end"
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
