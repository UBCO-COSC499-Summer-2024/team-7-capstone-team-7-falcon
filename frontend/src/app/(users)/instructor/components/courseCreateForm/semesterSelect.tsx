import React, { useEffect, useState } from "react";
import { semestersAPI } from "@/app/api/semestersAPI";
import { Semester } from "@/app/typings/backendDataTypes";
import { Alert, Label, Select } from "flowbite-react";

interface SemesterSelectProps {
  required: boolean;
  name: string;
  labelText: string;
}

const SemesterSelect: React.FC<SemesterSelectProps> = ({
  required,
  name,
  labelText,
}) => {
  const [courseSemesters, setCourseSemesters] = useState<Semester[]>([]);

  /**
   * Fetches all semesters from the API and sets them in the state.
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const fetchSemesters = async (): Promise<void> => {
    const fetchedSemesters = await semestersAPI.getAllSemesters();
    setCourseSemesters(fetchedSemesters);
  };

  /**
   * Fetches semesters when the modal is opened and the semesters are not already loaded.
   * @function
   * @returns {void}
   */
  useEffect(() => {
    if (courseSemesters === undefined || courseSemesters.length === 0)
      fetchSemesters();
  }, []);

  return (
    <>
      <Label htmlFor="semesterID">
        <h2 className="pt-2">{labelText}</h2>
      </Label>
      {courseSemesters !== undefined ? (
        <Select id="semesterID" name="semester_id" required>
          {courseSemesters.map((semester: Semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </Select>
      ) : (
        <Alert color="failure">Failed to fetch semesters</Alert>
      )}
    </>
  );
};

export default SemesterSelect;
