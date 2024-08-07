"use client";

import React, { useState, useEffect } from "react";
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
import { Pagination } from "flowbite-react";
import { MdOutlineSearch } from "react-icons/md";
import { TextInput } from "flowbite-react";
import { Column, DataItem } from "./type";

type TableComponentProps<T> = {
  data: DataItem<T>[];
  columns: Column[];
  showSearch?: boolean;
  showPagination?: boolean;
  inputPlaceholderText?: string;
};

const TableComponent = <T,>({
  data,
  columns,
  showSearch = true,
  showPagination = true,
  inputPlaceholderText = "Search by name",
}: TableComponentProps<T>) => {
  const theme = useTheme(getTheme());
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Reset to the first page whenever search term changes
    setCurrentPage(1);
  }, [search]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const filteredData = data.filter(
    (item) => item && item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="container flex flex-col">
      {showSearch && (
        <form className="flex max-w-full flex-col" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              id="search"
              type="text"
              value={search}
              icon={MdOutlineSearch}
              onChange={handleSearch}
              placeholder={inputPlaceholderText}
            />
          </div>
        </form>
      )}
      <div className="flex w-full mt-4">
        <Table columns={columns} data={{ nodes: paginatedData }} theme={theme}>
          {() => (
            <>
              <Header>
                <HeaderRow className="bg-gray-700">
                  {columns.map((column) => (
                    <HeaderCell key={column.label} className="py-2">
                      {column.label}
                    </HeaderCell>
                  ))}
                </HeaderRow>
              </Header>
              <Body>
                {paginatedData.map((item) => (
                  <Row key={item.name} item={item} className="bg-white">
                    {columns.map((column) => (
                      <Cell key={column.label} className="py-3 min-w-fit">
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
      {showPagination && (
        <div className="flex overflow-x-auto sm:justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            showIcons
          />
        </div>
      )}
    </div>
  );
};

export default TableComponent;
