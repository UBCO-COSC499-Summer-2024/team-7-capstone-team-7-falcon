"use client";
import React, { useEffect, useState } from "react";
import { Column, DataItem } from "./type";
import TableComponent from "./tableComponent";
import { coursesAPI } from "../../../api/coursesAPI";
import { CourseUser } from "../../../typings/backendDataTypes";
import Link from "next/link";
import Avatar from "../../../components/avatar";

const user_columns: Column[] = [
  { label: "#", renderCell: (item) => item.id },
  {
    label: "Name",
    renderCell: (item) => (
      <div className="flex space-x-4 items-center">
        <Avatar
          avatarUrl={item.user.avatar_url}
          firstName={item.user.first_name}
          lastName={item.user.last_name}
          imageTextHeight={`w-12`}
          imageTextWidth={`w-12`}
          textSize={1}
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
    renderCell: (item) => (
      <Link href={`./course/${item.id}`}>
        <button type="button" className="btn-primary flex p-1 px-4">
          Remove Student
        </button>
      </Link>
    ),
  },
];

type PeopleTableProps = {
  course_id: number;
};

const PeopleTable: React.FC<PeopleTableProps> = ({ course_id }) => {
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
  }, []);

  if (!data) {
    return <p>Data not found</p>;
  }

  return <TableComponent<CourseUser> data={data} columns={user_columns} />;
};

export default PeopleTable;
