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
import { nodes } from "./mockData";
import { usePagination } from "@table-library/react-table-library/pagination";

const key = "Composed Table";

const Component = () => {
  const data = { nodes };

  const theme = useTheme(getTheme());
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };
  const handleDelete = (event: any) => {};
  return (
    <>
      <div className="container mx-auto py-8 flex flex-col  justify-center min-h-screen">
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
        <div className="flex w-full max-w-4xl mx-auto">
          <div className="w-1/2 overflow-x-auto">
            <Table data={data} theme={theme}>
              {(tableList: any) => (
                <>
                  <Header>
                    <HeaderRow className="bg-gray-700">
                      <HeaderCell className="py-2">#</HeaderCell>
                      <HeaderCell className="py-2">Name</HeaderCell>
                      <HeaderCell className="py-2">Score</HeaderCell>
                      <HeaderCell className="py-2">Exam Graded</HeaderCell>
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item: any) => (
                      <Row key={item.id} item={item} className="bg-white">
                        <Cell className="py-1">{item.id}</Cell>
                        <Cell className="py-2">{item.name}</Cell>
                        <Cell className="py-2">
                          <span className="inline-block bg-gray-200 text-[#8F3DDE] text-sm font-semibold py-1 px-3 rounded w-24">
                            {item.score}
                          </span>
                        </Cell>
                        <Cell className="py-2">{item.examgraded}</Cell>
                      </Row>
                    ))}
                  </Body>
                </>
              )}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Component;
