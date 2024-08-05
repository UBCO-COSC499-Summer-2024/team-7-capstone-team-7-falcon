"use client";
import React, { useState, useEffect } from "react";
import { TextInput, Label, Datepicker, Alert, Spinner } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import { semestersAPI } from "@/app/api/semestersAPI";
import { SemesterData, SemesterValid } from "@/app/typings/backendDataTypes";
import { useRouter } from "next/navigation";
import { datePickerTheme } from "@/app/components/datePickerTheme";

interface SemesterEditFormProps {
  semesterId: number;
}

const SemesterEditForm: React.FC<SemesterEditFormProps> = ({ semesterId }) => {
  const [semesterValid, setSemesterValid] = useState(SemesterValid.Invalid);
  const [formData, setFormData] = useState<SemesterData>({
    name: "",
    starts_at: -1,
    ends_at: -1,
  } as SemesterData);
  const router = useRouter();
  const [savingChanges, setSavingChanges] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const semester: SemesterData = await semestersAPI.getSemester(semesterId);
      setFormData({
        name: semester.name,
        starts_at: semester.starts_at,
        ends_at: semester.ends_at,
      } as SemesterData);
    } catch (error) {
      toast.error("Failed to load semester data");
    }
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setSavingChanges(true);

      // validate dates
      if (formData.starts_at < Date.now() || formData.ends_at < Date.now()) {
        setSemesterValid(SemesterValid.DatesInThePast);
        setSavingChanges(false);
        return;
      }

      if (formData.starts_at > formData.ends_at) {
        setSemesterValid(SemesterValid.EndDateBeforeStartDate);
        setSavingChanges(false);
        return;
      }

      setSemesterValid(SemesterValid.Valid);

      const updatedSemester = await semestersAPI.editSemester(
        semesterId,
        formData,
      );
      console.log(updatedSemester);
      if (updatedSemester && updatedSemester.status === 204) {
        toast.success("Semester successfully updated.");

        fetchData();
      } else {
        toast.error(updatedSemester.response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update semester.");
    } finally {
      setSavingChanges(false);
    }
  };

  const setCalendarDate = (daysAhead: number) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + daysAhead);

    return tomorrow;
  };

  const DeleteSemester = async () => {
    try {
      await semestersAPI.deleteSemester(semesterId);
      toast.success("Semester successfully deleted.");
      setTimeout(() => {
        router.push("../../semesters");
      }, 2000);
    } catch (error) {
      toast.error("Failed to delete semester.");
    }
  };

  return (
    <div>
      {formData.starts_at &&
      formData.ends_at &&
      formData.starts_at > 0 &&
      formData.ends_at > 0 ? (
        <form method="PATCH" onSubmit={handleSaveChanges}>
          <div className="space-y-4 p-4 ring ring-gray-100 rounded-md flex flex-col">
            <Label htmlFor="name">
              <h2>Semester Name</h2>
            </Label>
            <TextInput
              id="name"
              name="name"
              className="mb-3"
              value={formData.name}
              placeholder="Enter semester name"
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <div className="flex space-x-10">
              <div className="mb-4">
                <Label htmlFor="starts_at" className="mb-3">
                  <h2 className="pt-2">Semester Start Date</h2>
                </Label>
                <div className="items-center mb-4">
                  {formData && formData.starts_at > 0 && (
                    <Datepicker
                      className="w-1/4"
                      id="starts_at"
                      name="starts_at"
                      value={new Date(
                        Number(formData.starts_at),
                      ).toLocaleString()}
                      onSelectedDateChanged={(date: Date) =>
                        setFormData({ ...formData, starts_at: date.getTime() })
                      }
                      required
                      theme={datePickerTheme}
                      inline={true}
                      showTodayButton={false}
                      showClearButton={false}
                      minDate={setCalendarDate(1)}
                      defaultDate={new Date(Number(formData.starts_at))}
                    />
                  )}
                </div>
              </div>
              <div>
                <Label
                  htmlFor="ends_at"
                  className="block text-gray-700 text-sm font-bold"
                >
                  <h2 className="pt-2">Semester End Date</h2>
                </Label>
                {formData && formData.ends_at > 0 && (
                  <Datepicker
                    className="w-1/4"
                    id="ends_at"
                    name="ends_at"
                    theme={datePickerTheme}
                    onSelectedDateChanged={(date: Date) =>
                      setFormData({ ...formData, ends_at: date.getTime() })
                    }
                    value={new Date(Number(formData.ends_at)).toLocaleString()}
                    defaultDate={new Date(Number(formData.ends_at))}
                    required
                    inline={true}
                    showClearButton={false}
                    showTodayButton={false}
                  />
                )}
              </div>
            </div>

            {semesterValid === SemesterValid.DatesInThePast && (
              <div className="mb-4">
                <Alert color="failure" icon={HiInformationCircle}>
                  <span className="font-medium">
                    Date(s) in the past! &nbsp;
                  </span>
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

            <div>
              <button
                type="submit"
                className="btn-primary w-ful disabled:bg-purple-400"
                disabled={savingChanges}
              >
                {savingChanges ? "Saving Changes..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <Spinner className="w-full" />
      )}
      <div className="ring-1 rounded ring-red-700 pt-4 mt-4 flex flex-col p-4">
        <p className="font-bold text-lg mb-2">Danger Zone</p>
        <p className="font-bold mt-2">Delete this semester</p>
        <p>
          Once you delete this semester, courses using this semester will be
          archived.
        </p>
        <button
          className="ring-1 rounded ring-red-700 p-1 m-3 items-center"
          onClick={DeleteSemester}
        >
          <p className="text-red-700 text-lg">Delete this semester</p>
        </button>
      </div>
    </div>
  );
};

export default SemesterEditForm;
