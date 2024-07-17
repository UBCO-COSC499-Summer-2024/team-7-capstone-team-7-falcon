"use client";

import {
  Button,
  Modal,
  Label,
  TextInput,
  Datepicker,
  Alert,
} from "flowbite-react";
import { useState, useEffect } from "react";
import {
  SemesterData,
  SemesterValid,
  Status,
} from "../../typings/backendDataTypes";
import { HiInformationCircle } from "react-icons/hi";
import { semestersAPI } from "../../api/semestersAPI";

interface CreateSemesterFormProps {
  onClose(): void;
}

const CreateSemesterForm: React.FC<CreateSemesterFormProps> = ({ onClose }) => {
  const [status, setStatus] = useState(Status.Pending);
  const [semesterValid, setSemesterValid] = useState(SemesterValid.Invalid);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [semesterData, setSemesterData] = useState<SemesterData>({
    name: "",
    starts_at: -1,
    ends_at: -1,
  });

  const resetStatus = () => {
    setStatus(Status.Pending);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // setRedirect(true);
    e.preventDefault();
    setStatus(Status.Pending);

    // validate dates
    if (
      semesterData.starts_at < Date.now() ||
      semesterData.ends_at < Date.now()
    ) {
      setSemesterValid(SemesterValid.DatesInThePast);
      return;
    }

    if (semesterData.starts_at > semesterData.ends_at) {
      setSemesterValid(SemesterValid.EndDateBeforeStartDate);
      return;
    }

    setSemesterValid(SemesterValid.Valid);

    // send data to the database
    const result = await semestersAPI.createSemester(semesterData);

    if (result.status == 201) {
      setStatus(Status.Success);
      handleClose();
    } else {
      setStatus(Status.Failure);
    }
  };

  return (
    <>
      <Modal size="3xl" show={isModalOpen} onClose={handleClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="mb-4">
            <Label
              className="block text-gray-700 text-xl font-bold mb-2"
              htmlFor="name"
            >
              Create new semester
            </Label>
          </div>
          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Semester Name
            </Label>
            <TextInput
              className="w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="name"
              type="text"
              value={semesterData.name}
              onChange={(e) =>
                setSemesterData({ ...semesterData, name: e.target.value })
              }
              placeholder="2024W1"
              required
            />
          </div>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="starts_at"
            >
              Start Date
            </Label>
            <Datepicker
              className="w-1/4"
              id="starts_at"
              onSelectedDateChanged={(date: Date) =>
                setSemesterData({ ...semesterData, starts_at: date.getTime() })
              }
              required
            />
          </div>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="starts_at"
            >
              End Date
            </Label>
            <Datepicker
              className="w-1/4"
              id="ends_at"
              onSelectedDateChanged={(date: Date) =>
                setSemesterData({ ...semesterData, ends_at: date.getTime() })
              }
              required
            />
          </div>

          {semesterValid === SemesterValid.DatesInThePast && (
            <div className="mb-4">
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Date(s) in the past! &nbsp;</span>
                Please select a date in the future.
              </Alert>
            </div>
          )}

          {semesterValid === SemesterValid.EndDateBeforeStartDate && (
            <div className="mb-4">
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">
                  End date before start date! &nbsp;
                </span>
                Please select an end date that is after the start date.
              </Alert>
            </div>
          )}

          {status === Status.Failure && (
            <div className="mb-4">
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Error! &nbsp;</span>
                An error occurred. Please try again!
              </Alert>
            </div>
          )}

          <div className="flex justify-center">
            <Button color="purple" onClick={handleSubmit}>
              Create Semester
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateSemesterForm;
