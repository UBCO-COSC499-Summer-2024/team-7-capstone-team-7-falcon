"use client";

import { Button, Modal, Label, TextInput, Datepicker } from "flowbite-react";
import { useState } from "react";
import { SemesterData } from "../../typings/backendDataTypes";
import { semestersAPI } from "../../api/semestersAPI";
import toast from "react-hot-toast";
import { datePickerTheme } from "@/app/components/datePickerTheme";

interface CreateSemesterFormProps {
  onClose(): void;
}

const CreateSemesterForm: React.FC<CreateSemesterFormProps> = ({ onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [semesterData, setSemesterData] = useState<SemesterData>({
    name: "",
    starts_at: parseInt(new Date().getTime().toString()) + 86_400_000,
    ends_at: parseInt(new Date().getTime().toString()) + 86_400_000 * 2,
  });

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (semesterData.name.trim().length === 0) {
      toast.error("Semester name cannot be empty!");
      return;
    }

    // validate dates
    if (
      semesterData.starts_at < Date.now() ||
      semesterData.ends_at < Date.now()
    ) {
      toast.error("Semester start date and end date must be in future!");
      return;
    }

    if (semesterData.starts_at > semesterData.ends_at) {
      toast.error("End date must be after start date!");
      return;
    }

    // send data to the database
    const result = await semestersAPI.createSemester(semesterData);

    if (result.status == 201) {
      toast.success("Semester created successfully");
      handleClose();
    } else {
      toast.error("Failed to create semester");
    }
  };

  const setCalendarDate = (daysAhead: number) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + daysAhead);

    return tomorrow;
  };

  return (
    <>
      <Modal
        size="7xl"
        show={isModalOpen}
        onClose={handleClose}
        popup
        className="h-[500px]"
      >
        <Modal.Header />
        <Modal.Body className="h-[500px]">
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
              placeholder="Semester name"
              required
            />
          </div>

          <div className="flex space-x-10">
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
                  setSemesterData({
                    ...semesterData,
                    starts_at: date.getTime(),
                  })
                }
                required
                inline={true}
                theme={datePickerTheme}
                showTodayButton={false}
                minDate={setCalendarDate(1)}
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
                inline={true}
                theme={datePickerTheme}
                showTodayButton={false}
                minDate={setCalendarDate(2)}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              color="purple"
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                handleSubmit(e)
              }
            >
              Create Semester
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateSemesterForm;
