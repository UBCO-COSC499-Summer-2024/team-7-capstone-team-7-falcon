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
import { usePagination } from "@table-library/react-table-library/pagination";
import { Column } from "./type";
import { DataItem } from "./type";

type TableComponentProps<T> = {
  data: DataItem<T>[];
  columns: Column[];
};

const TableComponent = <T,>({ data, columns }: TableComponentProps<T>) => {
  const theme = useTheme(getTheme());
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const onPaginationChange = () => {};
  // const pagination = usePagination(data, {
  //   state: {
  //     page: 0,
  //     size: 2,
  //   },
  //   onChange: onPaginationChange,
  // });

  return (
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

        <div className="w-full max-w-4xl overflow-x-auto">
          <Table columns={columns} data={{ nodes: filteredData }} theme={theme}>
            {() => (
              <>
                <Header>
                  <HeaderRow className="bg-gray-700 text-black">
                    {columns.map((column) => (
                      <HeaderCell
                        key={column.label}
                        className="py-2 px-4 text-xs"
                      >
                        {column.label}
                      </HeaderCell>
                    ))}
                  </HeaderRow>
                </Header>

                <Body>
                  {filteredData.map((item) => (
                    <Row key={item.name} item={item} className="bg-white">
                      {columns.map((column) => (
                        <Cell key={column.label} className="py-2 px-4 text-sm">
                          {column.renderCell(item.data)}
                        </Cell>
                      ))}
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
