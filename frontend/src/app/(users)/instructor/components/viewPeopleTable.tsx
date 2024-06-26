"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Column, DataItem } from "./type";
import TableComponent from "./tableComponent";
import { usersAPI } from "../../../api/usersAPI";
import { User } from "../../../typings/backendDataTypes";

const user_columns: Column[] = [
  { label: "#", renderCell: (item) => item.id },
  { label: "Name", renderCell: (item) => item.name },
  { label: "Role", renderCell: (item) => item.role },
  { label: "Email", renderCell: (item) => item.email },
  { label: "Actions", renderCell: (item) => item.actions },
];

const PeopleTable: React.FC = () => {
  const [data, setData] = useState<DataItem<User>[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await usersAPI.getUserDetails();
      console.log("user data: ", result);
      const users: DataItem<User>[] = result.data.data.map((item: any) => ({
        name: item.name,
        id: item.id,
        data: {
          id: item.id,
          name: item.name,
          role: item.role,
          email: item.email,
          actions: item.actions,
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
