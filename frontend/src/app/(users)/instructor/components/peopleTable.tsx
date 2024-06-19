"use client";

import React from "react";
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
import { nodes } from "./data";
// import { usePagination } from "@table-library/react-table-library/pagination";

const key = "Composed Table";

const UserTable = () => {
  const data = { nodes };

  const theme = useTheme(getTheme());
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };
  const handleDelete = (event: any) => {};
  return (
    <Table data={data} theme={theme}>
      {(tableList: any) => (
        <>
          <Header>
            <HeaderRow className="bg-gray-700">
              <HeaderCell className="py-2">#</HeaderCell>
              <HeaderCell className="py-2">Name</HeaderCell>
              <HeaderCell className="py-2">Role</HeaderCell>
              <HeaderCell className="py-2">Email</HeaderCell>
              <HeaderCell className="py-2">Actions</HeaderCell>
            </HeaderRow>
          </Header>

          <Body>
            {tableList.map((item: any) => (
              <Row key={item.id} item={item} className="bg-white">
                <Cell className="py-1">{item.id}</Cell>
                <Cell className="py-2">{item.name}</Cell>
                <Cell className="py-2">
                  <span className="inline-block bg-gray-200 text-[#8F3DDE] text-sm font-semibold py-1 px-3 rounded w-24">
                    {item.role}
                  </span>
                </Cell>
                <Cell className="py-2 overflow-x-auto">{item.email}</Cell>
                <Cell className="py-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-[#8F3DDE] flex items-center text-white px-2 py-1 rounded"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm-2 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1Zm13-6a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span className="text-xs"> Remove Student</span>
                  </button>
                </Cell>
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
  );
};

export default UserTable;
