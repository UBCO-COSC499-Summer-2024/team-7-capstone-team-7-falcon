"use client";

import { coursesAPI } from "@/app/api/coursesAPI";
import TableComponent from "@/app/components/tableComponent";
import { Column, DataItem } from "@/app/components/type";
import { CourseAdminDetails } from "@/app/typings/backendDataTypes";
import { UserEdit } from "flowbite-react-icons/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

const tableColumn: Column[] = [
  { label: "#", renderCell: (item) => item.courseId },
  { label: "Course Code", renderCell: (item) => item.courseCode },
  {
    label: "Semester",
    renderCell: (item) => item.semesterName,
  },
  {
    label: "Created By",
    renderCell: (item) =>
      `${item.creator.firstName} ${item.creator.lastName ?? ""}`,
  },
  {
    label: "Members Enrolled",
    renderCell: (item) => item.members,
  },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={`./course/${item.courseId}/edit`}>
        <button
          type="button"
          className="btn-primary flex p-1 px-4 items-center space-x-1"
        >
          <UserEdit />
          <span>Edit</span>
        </button>
      </Link>
    ),
  },
];

const CoursesTable: React.FC = () => {
  const [courses, setCourses] = useState<DataItem<CourseAdminDetails>[] | null>(
    null,
  );

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await coursesAPI.getAllCourses();

      if (response.status === 200 && response.data.length > 0) {
        const courses: DataItem<CourseAdminDetails>[] = response.data.map(
          (course) => ({
            name: course.courseCode,
            id: course.courseId,
            data: {
              courseId: course.courseId,
              courseCode: course.courseCode,
              semesterName: course.semesterName,
              members: course.members,
              creator: {
                firstName: course.creator.firstName,
                lastName: course.creator.lastName,
              },
            },
          }),
        );

        setCourses(courses);
      }
    };

    fetchCourses();
  }, []);
  return (
    <div className="flex flex-col items-left">
      {courses ? (
        <TableComponent<CourseAdminDetails>
          data={courses}
          columns={tableColumn}
        />
      ) : (
        <div className="pl-3 pt-4 p-2">No data available</div>
      )}
    </div>
  );
};

export default CoursesTable;
