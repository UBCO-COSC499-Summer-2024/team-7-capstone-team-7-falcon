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
  const [isLoaded, setIsLoaded] = useState(false);
  /**
   * Fetches all semesters from the API and sets them in the state.
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const fetchSemesters = async (): Promise<void> => {
    const fetchedSemesters = await semestersAPI
      .getAllSemestersLimited()
      .catch((_) => {
        return undefined;
      });
    setCourseSemesters(fetchedSemesters);
    setIsLoaded(true);
  };

  /**
   * Fetches semesters when the modal is opened and the semesters are not already loaded.
   * @function
   * @returns {void}
   */
  useEffect(() => {
    if (courseSemesters.length === 0) fetchSemesters();
  }, []);

  return (
    <>
      <Label htmlFor="semesterID">
        <h2 className="pt-2">{labelText}</h2>
      </Label>
      {courseSemesters !== undefined ? (
        <Select id="semesterID" name={name} required={required}>
          {courseSemesters.map((semester: Semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </Select>
      ) : (
        isLoaded && <Alert color="failure">Failed to fetch semesters</Alert> // Only show the alert if the semesters have been loaded from backend but are empty
      )}
    </>
  );
};

export default SemesterSelect;
