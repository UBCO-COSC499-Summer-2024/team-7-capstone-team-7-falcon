import React, { useEffect, useState } from "react";
import { semestersAPI } from "@/app/api/semestersAPI";
import { Semester } from "@/app/typings/backendDataTypes";
import { Alert, Label, Select } from "flowbite-react";

interface SemesterSelectProps {
  required: boolean;
  name: string;
  labelText: string;
  value?: number; // Adding value prop
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Adding onChange prop
}

const SemesterSelect: React.FC<SemesterSelectProps> = ({
  required,
  name,
  labelText,
  value,
  onChange,
}) => {
  const [courseSemesters, setCourseSemesters] = useState<Semester[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchSemesters = async (): Promise<void> => {
    const fetchedSemesters = await semestersAPI.getAllSemesters().catch((e) => {
      return undefined;
    });
    setCourseSemesters(fetchedSemesters);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (courseSemesters.length === 0) fetchSemesters();
  }, []);

  return (
    <>
      <Label htmlFor="semesterID">
        <h2 className="pt-2">{labelText}</h2>
      </Label>
      {courseSemesters !== undefined ? (
        <Select
          id="semesterID"
          name={name}
          required={required}
          value={value}
          onChange={onChange}
        >
          <option value="">Select a semester</option>{" "}
          {/* Adding a default option */}
          {courseSemesters.map((semester: Semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </Select>
      ) : (
        isLoaded && <Alert color="failure">Failed to fetch semesters</Alert>
      )}
    </>
  );
};

export default SemesterSelect;
