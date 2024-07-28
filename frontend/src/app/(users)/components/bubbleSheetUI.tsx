"use client";
import React, { useEffect, useState } from "react";
import { DetailedSubmission } from "../../typings/backendDataTypes";
import { examsAPI } from "../../api/examAPI";

interface BubbleSheetUIProps {
  submissionId: number;
}

enum BubbleStyle {
  None = "none",
  Wrong = "wrong",
  Correct = "correct",
}

const BubbleSheetUI: React.FC<BubbleSheetUIProps> = ({ submissionId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [isCreateDisabled, setIsCreateDisabled] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number[];
  }>({});
  const [validationError, setValidationError] = useState(false);
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

  const questionsPerColumn = 35;
  const questionCount = detailedSubmission.answerList.length;
  const options = ["A", "B", "C", "D", "E"];

  // Computes the styles used for each circle in the bubble sheet
  const preComputeAnswers = () => {
    const questionStyleMap: BubbleStyle[][] = [];
    detailedSubmission.answerList.map((question, index) => {
      const { answered, expected } = question;
      console.log("question:", question, answered, expected);
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
      console.log("questionStyle:", questionStyle);
      questionStyleMap.push(questionStyle);
    });
    return questionStyleMap;
  };

  const questionStyleMap: BubbleStyle[][] = preComputeAnswers();
  console.log("styles:", questionStyleMap);

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

  // const submitJob = async () => {
  //     const keys = Object.keys(selectedOptions);

  //     if (keys.length !== questionCount) {
  //         setValidationError(true);
  //         return;
  //     } else {
  //         setValidationError(false);
  //     }

  //     for (const key of keys) {
  //         if (!selectedOptions[key] || selectedOptions[key].length === 0) {
  //         setValidationError(true);
  //         return;
  //         } else {
  //         setValidationError(false);
  //         }
  //     }

  //     setIsCreateDisabled(true);
  //     const answerIndexes: number[][] = keys.map((key) => selectedOptions[key]);
  //     // const payload: BubbleSheetPayload = {
  //     //     payload: {
  //     //     numberOfQuestions: questionCount,
  //     //     defaultPointsPerQuestion: 1,
  //     //     numberOfAnswers: 5,
  //     //     courseName,
  //     //     courseCode,
  //     //     examName,
  //     //     answers: answerIndexes,
  //     //     },
  //     // };
  //     // const response = await examsAPI.postBubbleSheet(payload);

  //     // if (response.status === 202) {
  //     //   toast.success("Bubble sheet job has been submitted to the server", {
  //     //     duration: 5_000,
  //     //   });
  //     // } else {
  //     //   toast.error("Failed to create bubble sheet");
  //     //   setIsCreateDisabled(false);
  //     // }
  // };

  return (
    <div className="flex flex-row mt-4">
      {[...Array(Math.ceil(Number(questionCount) / questionsPerColumn))].map(
        (_, columnIndex) => (
          <div className="flex flex-col mt-4" key={columnIndex}>
            {[...Array(questionsPerColumn)].map((_, rowIndex) => {
              const questionIndex = columnIndex * questionsPerColumn + rowIndex;
              if (questionIndex >= Number(questionCount)) return null;

              return (
                <div className="flex mt-4 mx-1" key={questionIndex}>
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
