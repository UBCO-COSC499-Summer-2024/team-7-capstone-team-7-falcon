"use client";

import React, { useEffect, useState } from "react";
import { Column, DataItem } from "./type";
import TableComponent from "./tableComponent";
import { usersAPI } from "../../../api/usersAPI";
import { User } from "../../../typings/backendDataTypes";

const user_columns: Column[] = [
  { label: "#", renderCell: (item) => item.student_id },
  { label: "Name", renderCell: (item) => item.first_name },
  { label: "Profile", renderCell: (item) => item.profile },
  { label: "Role", renderCell: (item) => item.role },
  { label: "Email", renderCell: (item) => item.email },
];

type PeopleTableProps = {
  course_id: number;
};

const PeopleTable: React.FC<PeopleTableProps> = ({ course_id }) => {
  const [data, setData] = useState<DataItem<User>[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await usersAPI.getUserDetails();
      console.log("user data: ", result);
      const users: DataItem<User>[] = result.data.data.map((item: any) => ({
        name: item.name,
        id: item.student_id,
        data: {
          id: item.student_id,
          name: item.name,
          avatar_url: item.picture,
          role: item.role,
          email: item.email,
        },
      }));
      setData(users);
      console.log("user data: ", users);
    };

    fetchData();
  }, []);

  if (!data) {
    return <p>Data not found</p>;
  }

  return <TableComponent<User> data={data} columns={user_columns} />;
};

export default PeopleTable;
