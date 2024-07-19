"use client";
import React, { useEffect, useState } from "react";
import { Column, DataItem } from "../../components/type";
import TableComponent from "../../components/tableComponent";
import Link from "next/link";
import { User } from "@/app/typings/backendDataTypes";
import { usersAPI } from "../../api/usersAPI";
import Avatar from "../../components/avatar";
import { UserSettings } from "flowbite-react-icons/solid";

const user_columns: Column[] = [
  { label: "#", renderCell: (item) => item.id },
  {
    label: "Name",
    renderCell: (item) => (
      <div className="flex sm:space-x-0 md:space-x-4 items-center">
        <Avatar
          avatarUrl={item.avatar_url}
          firstName={item.first_name}
          lastName={item.last_name}
          imageTextHeight={`w-12`}
          imageTextWidth={`w-12`}
          textSize={1}
          imageHeight={48}
          imageWidth={48}
        />
        <span className="mt-1">
          {item.first_name} {item?.last_name ?? ""}
        </span>
      </div>
    ),
  },
  {
    label: "Role",
    renderCell: (item) => (
      <div className="text-purple-700 font-bold focus:outline-none">
        <select
          onChange={(e) => usersAPI.updateUserRole(item.id, e.target.value)}
          className="dropdown-menu rounded-md border-0 bg-gray-100 focus:outline-none"
          defaultValue={item.role}
          style={{ boxShadow: "none" }}
        >
          <option value="professor">Professor</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>
      </div>
    ),
  },
  { label: "Email", renderCell: (item) => item.email },
  { label: "Registration Method", renderCell: (item) => item.auth_type },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={`./users/${item.id}/edit`}>
        <UserSettings className="text-purple-700" />
      </Link>
    ),
  },
];

const UserTable: React.FC = () => {
  const [userData, setData] = useState<DataItem<User>[]>();

  // gets the data once on mount
  useEffect(() => {
    const fetchData = async () => {
      // getAllUsers throws an error that if it fails that is caught by error.tsx
      const response = await usersAPI.getAllUsers();
      console.log(response.data.data);
      const usersDataItem: DataItem<User>[] = response.data.data.map(
        (item: User) => ({
          id: item.id,
          name: item.first_name + " " + item.last_name,
          data: item,
        }),
      );
      setData(usersDataItem);
    };
    fetchData();
  }, []);

  console.log(userData);
  if (!userData) {
    return <p>Loading...</p>;
  }

  return <TableComponent<User> data={userData} columns={user_columns} />;
};

export default UserTable;
