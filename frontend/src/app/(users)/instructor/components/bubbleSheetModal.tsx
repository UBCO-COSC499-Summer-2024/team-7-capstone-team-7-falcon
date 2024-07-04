"use client";

import { Label, Modal, Textarea } from "flowbite-react";
import { useRef, useState } from "react";
import { BubbleSheetPayload } from "../../../typings/backendDataTypes";
import { examsAPI } from "../../../api/examAPI";

interface BubbleSheetModalProps {
  onClose?(): void;
}

const BubbleSheetModal: React.FC<BubbleSheetModalProps> = ({ onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [questionCount, setQuestionCount] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number;
  }>({});
  // const instructions = useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
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

  const downloadBubbleSheet = async () => {
    const keys = Object.keys(selectedOptions);

    if (keys.length != Number(questionCount)) {
      return;
    }

    const answerIndexes: number[] = keys.map((key) => Number(key));
    const payload: BubbleSheetPayload = {
      numberOfQuestions: Number(questionCount),
      defaultPointsPerQuestion: 1,
      numberOfAnswers: 5,
      instructions: "x",
      answers: answerIndexes,
    };

    const response = await examsAPI.postBubbleSheet(payload);
    console.log(response);
  };

  const options = ["A", "B", "C", "D", "E"];

  return (
    <Modal show={isModalOpen} onClose={handleClose}>
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
          {/* <div className="max-w-md flex col-span-2">
                <Textarea 
                id="comment" 
                placeholder="Enter instructions here..." 
                required rows={4} 
                ref={instructions}/>
              </div> */}
        </div>
        <div className="flex flex-col mt-4">
          {[...Array(Number(questionCount))].map((_, rowIndex) => (
            <div className="flex mt-4" key={rowIndex}>
              <p className="pr-2">{rowIndex + 1}</p>
              {options.map((option, index) => (
                <label
                  key={index}
                  htmlFor={`radio-${rowIndex}-${index}`}
                  className="flex items-center cursor-pointer text-gray-700"
                >
                  <input
                    type="radio"
                    id={`radio-${rowIndex}-${index}`}
                    name={`option-group-${rowIndex}`}
                    value={option}
                    checked={selectedOptions[rowIndex] === Number(index)}
                    onChange={() => handleSelectedOptionChange(rowIndex, index)}
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
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn-primary flex justify-end"
          onClick={downloadBubbleSheet}
        >
          Submit
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default BubbleSheetModal;
