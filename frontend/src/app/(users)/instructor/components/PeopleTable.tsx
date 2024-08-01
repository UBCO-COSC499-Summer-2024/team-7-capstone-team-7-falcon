"use client";

import React, { useEffect, useState } from "react";
import { Column, DataItem } from "../../../components/type";
import { coursesAPI } from "../../../api/coursesAPI";
import { CourseUser } from "../../../typings/backendDataTypes";
import TableComponent from "../../../components/tableComponent";
import Avatar from "../../../components/avatar";
import Link from "flowbite-react";

const user_columns: Column[] = [
  { label: "#", renderCell: (item) => item.id },
  {
    label: "Name",
    renderCell: (item) => (
      <div className="flex sm:space-x-0 md:space-x-4 items-center">
        <Avatar
          avatarUrl={item.user.avatar_url}
          firstName={item.user.first_name}
          lastName={item.user.last_name}
          imageTextHeight={`w-12`}
          imageTextWidth={`w-12`}
          textSize={1}
          imageHeight={48}
          imageWidth={48}
        />
        <span className="mt-1">
          {item.user.first_name} {item.user?.last_name ?? ""}
        </span>
      </div>
    ),
  },
  { label: "Role", renderCell: (item) => item.role },
  {
    label: "Actions",
    renderCell: (item) =>
      item.role === "student" ? (
        <Link href={`./course/${item.id}`}>
          <button type="button" className="btn-primary flex p-1 px-4">
            Remove Student
          </button>
        </Link>
      ) : (
        <div>No available actions</div>
      ),
  },
];

type PeopleTableProps = {
  course_id: number;
  onRemoveClick: (userId: number) => void;
};

const PeopleTable: React.FC<PeopleTableProps> = ({
  course_id,
  onRemoveClick,
}) => {
  const [data, setData] = useState<DataItem<CourseUser>[] | null>(null);

  // gets the data once on mount
  useEffect(() => {
    const fetchData = async () => {
      const result = await coursesAPI.getCourseMembers(course_id);

      const users: DataItem<CourseUser>[] = result.data.data.map(
        (item: CourseUser) => ({
          id: item.id,
          name: `${item.user.first_name} ${item.user?.last_name}`,
          data: {
            id: item.user.id,
            user: {
              avatar_url: item.user.avatar_url,
              first_name: item.user.first_name,
              last_name: item.user?.last_name,
              email: item.user.email,
            },
            role: item.course_role,
          },
        }),
      );
      setData(users);
    };
    fetchData();
  }, [course_id]);

  if (!data) {
    return <p>Data not found</p>;
  }

  return (
    <TableComponent<CourseUser>
      data={data}
      columns={user_columns.map((col) =>
        col.label === "Actions"
          ? {
              ...col,
              renderCell: (item) => col.renderCell(item, onRemoveClick),
            }
          : col,
      )}
    />
  );
};

export default PeopleTable;
