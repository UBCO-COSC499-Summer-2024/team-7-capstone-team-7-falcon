"use client";

import React, { ReactNode } from "react";
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
import { nodes } from "./mockData";
import { usePagination } from "@table-library/react-table-library/pagination";
import ExamTable from "./examTable";

const key = "Composed Table";

const TableComponent = ({ children }: { children: ReactNode }) => {
  const data = { nodes };

  const theme = useTheme(getTheme());
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };
  const handleDelete = (event: any) => {};
  return (
    <>
      <div className="container pt-10 flex flex-col items-center">
        <div className="w-1/2 overflow-x-auto">
          <label htmlFor="search"></label>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                ></path>
              </svg>
            </span>
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearch}
              className="border border-gray-300 pl-10 pr-4 py-2 w-full"
              placeholder="Search for Member"
            />
          </div>
        </div>
        <div className="flex w-100% max-w-4xl">{children}</div>
      </div>
    </>
  );
};

export default TableComponent;
