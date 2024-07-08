"use client";

import { Alert, Modal } from "flowbite-react";
import { useState } from "react";
import { BubbleSheetPayload } from "../../../typings/backendDataTypes";
import { examsAPI } from "../../../api/examAPI";
import { HiInformationCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";

interface BubbleSheetModalProps {
  onClose?(): void;
}

const BubbleSheetModal: React.FC<BubbleSheetModalProps> = ({ onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [isDownloadAvailable, setIsDownloadAvailable] =
    useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<string>("");
  const [fileId, setFileId] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number;
  }>({});
  const [validationError, setValidationError] = useState(false);
  const questionsPerColumn = 35;

  const handleClose = () => {
    setIsDownloadAvailable(false);
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOptionChange = (event: any) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= 200) {
      setQuestionCount(event.target.value);
    }
  };

  const handleSelectedOptionChange = (row: number, index: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [row]: index,
    }));
  };

  const downloadBubbleSheetFile = async () => {
    try {
      const response = await examsAPI.downloadBubbleSheet(fileId);
      const blob = new Blob([response.data], { type: "application/zip" });

      saveAs(blob, "bubble_sheet.zip");
      toast.success("Bubble sheet file downloaded");
    } catch (e) {
      toast.error("Failed to download bubble sheet file");
      setIsDownloadAvailable(false);
    }
  };

  const submitJob = async () => {
    setIsDownloadAvailable(false);
    const keys = Object.keys(selectedOptions);

    // verifies that all boxes are filled in
    if (keys.length != Number(questionCount)) {
      setValidationError(true);
      return;
    } else {
      setValidationError(false);
    }

    const answerIndexes: number[] = keys.map((key) => selectedOptions[key]);
    const payload: BubbleSheetPayload = {
      payload: {
        numberOfQuestions: Number(questionCount),
        defaultPointsPerQuestion: 1,
        numberOfAnswers: 5,
        instructions: "x",
        answers: answerIndexes,
      },
    };

    // make a request to create the job
    const response = await examsAPI.postBubbleSheet(payload);

    if (response.status === 202) {
      let fileIdReceived = false;
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1_500));

        const jobCompleteResponse = await examsAPI.getJobReadyStatus(
          response.data.jobId,
        );
        if (
          jobCompleteResponse &&
          jobCompleteResponse.data &&
          jobCompleteResponse.data?.data?.status === "completed"
        ) {
          setFileId(jobCompleteResponse.data?.data?.payload?.filePath);
          setIsDownloadAvailable(true);
          fileIdReceived = true;
        }

        if (fileIdReceived) {
          break;
        }
      }
    }
  };

  const options = ["A", "B", "C", "D", "E"];

  return (
    <Modal show={isModalOpen} onClose={handleClose} size="7xl">
      <Modal.Body>
        <div className="grid grid-cols-1 space-x-4">
          <div className="col-span-1 space-y-3">
            <div>
              <label
                htmlFor="number-input"
                className="block text-gray-700 mb-2"
              >
                No. of Questions:
              </label>
              <input
                type="number"
                id="number-input"
                value={questionCount}
                onChange={handleOptionChange}
                min={0}
                max={200}
                placeholder="1-200"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-4">
          {[
            ...Array(Math.ceil(Number(questionCount) / questionsPerColumn)),
          ].map((_, columnIndex) => (
            <div className="flex flex-col mt-4" key={columnIndex}>
              {[...Array(questionsPerColumn)].map((_, rowIndex) => {
                const questionIndex =
                  columnIndex * questionsPerColumn + rowIndex;
                if (questionIndex >= Number(questionCount)) return null;

                return (
                  <div className="flex mt-4 mx-1" key={questionIndex}>
                    <p className="pr-2">{questionIndex + 1}</p>
                    {options.map((option, index) => (
                      <label
                        key={index}
                        htmlFor={`radio-${questionIndex}-${index}`}
                        className="flex items-center cursor-pointer text-gray-700"
                      >
                        <input
                          type="radio"
                          id={`radio-${questionIndex}-${index}`}
                          name={`option-group-${questionIndex}`}
                          value={option}
                          checked={
                            selectedOptions[questionIndex] === Number(index)
                          }
                          onChange={() =>
                            handleSelectedOptionChange(questionIndex, index)
                          }
                          className="hidden peer"
                        />
                        <span className="relative w-6 h-6 inline-block mr-2 rounded-full border border-gray-400 bg-white peer-checked:bg-black transition duration-200">
                          <span className="absolute inset-0 flex items-center justify-center text-gray-700 peer-checked:text-black ">
                            {option}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="grid grid-cols-4">
        <div className="col-span-4 pb-4">
          {validationError && (
            <Alert color="failure" icon={HiInformationCircle} className="p-3">
              <span className="font-medium"></span>All answers are not filled
            </Alert>
          )}
        </div>
        <div className="col-span-1 flex justify-start space-x-2">
          <button className="btn-primary" onClick={submitJob}>
            Create
          </button>
          <button
            className="btn-primary disabled:bg-purple-400"
            disabled={!isDownloadAvailable}
            onClick={downloadBubbleSheetFile}
          >
            Download
          </button>
        </div>
        <div className="col-span-2 flex justify-center"></div>
        <div className="col-span-1 flex justify-end ">
          <button className="btn-secondary px-8" onClick={handleClose}>
            Close
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default BubbleSheetModal;
