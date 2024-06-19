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
import { nodes } from "./examdata";
import { usePagination } from "@table-library/react-table-library/pagination";

const key = "Composed Table";

const Component = () => {
  const data = { nodes };

  const theme = useTheme(getTheme());
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };
  const handleView = (event: any) => {};
  return (
    <>
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl mb-4">
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
        <div className="w-full max-w-4xl overflow-x-auto">
          <Table data={data} theme={theme}>
            {(tableList: any) => (
              <>
                <Header>
                  <HeaderRow className="bg-gray-700">
                    <HeaderCell className="py-2">Name</HeaderCell>
                    <HeaderCell className="py-2">Exam Published</HeaderCell>
                    <HeaderCell className="py-2">Grade Released</HeaderCell>
                    <HeaderCell className="py-2">Grade</HeaderCell>
                    <HeaderCell className="py-2">Actions</HeaderCell>
                  </HeaderRow>
                </Header>

                <Body>
                  {tableList.map((item: any) => (
                    <Row key={item.id} item={item} className="bg-white">
                      <Cell className="py-2">{item.name}</Cell>
                      <Cell className="py-2">{item.exampublished}</Cell>
                      <Cell className="py-2"> {item.gradereleased}</Cell>
                      <Cell className="py-2">
                        <span className="inline-block bg-gray-200 text-[#8F3DDE] text-sm font-semibold py-1 px-3 rounded w-24">
                          {item.grade}
                        </span>
                      </Cell>
                      <Cell className="py-2">
                        <button
                          onClick={() => handleView(item.name)}
                          className="bg-[#8F3DDE] flex items-center text-white px-2 py-1 rounded"
                        >
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="white"
                              stroke-width="2"
                              d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                            />
                            <path
                              stroke="white"
                              stroke-width="2"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>

                          <span className="text-xs"> View</span>
                        </button>
                      </Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
        </div>
      </div>
    </>
  );
};

export default Component;
