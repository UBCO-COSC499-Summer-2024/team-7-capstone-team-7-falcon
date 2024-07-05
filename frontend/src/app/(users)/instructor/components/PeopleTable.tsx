"use client";
import React, { useEffect, useState } from "react";
import { Column, DataItem } from "./type";
import TableComponent from "./tableComponent";
import { coursesAPI } from "../../../api/coursesAPI";
import { CourseUser } from "../../../typings/backendDataTypes";
import Link from "next/link";
import Image from "next/image";

const user_columns: Column[] = [
  { label: "#", renderCell: (item) => item.id },
  {
    label: "Name",
    renderCell: (item) => (
      <div className="flex space-x-4">
        <Image
          src={item.user.avatar_url}
          alt="Avatar"
          style={{ borderRadius: "50%" }}
          width={35}
          height={35}
        />
        <span className="mt-1">{item.user.name}</span>
      </div>
    ),
  },
  { label: "Role", renderCell: (item) => item.course_role },
  { label: "Email", renderCell: (item) => item.email },
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
      console.log("user data: ", result);
      const users: DataItem<CourseUser>[] = result.data.data.map(
        (item: any) => ({
          id: item.id,
          name: item.name,
          data: {
            id: item.id,
            user: {
              avatar_url: item.user.avatar_url,
              name: `${item.user.first_name} ${item.user.last_name}`,
            },
            role: item.course_role,
            email: item.email,
          },
        }),
      );
      setData(users);
      console.log("user data: ", users);
    };

    fetchData();
  }, []);

  if (!data) {
    return <p>Data not found</p>;
  }

  return <TableComponent<CourseUser> data={data} columns={user_columns} />;
};

export default PeopleTable;
