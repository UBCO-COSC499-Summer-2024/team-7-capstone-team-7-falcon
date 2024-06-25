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
import { DataItem } from "./type";
import { Column } from "./columns";
import { usePagination } from "@table-library/react-table-library/pagination";

type TableComponentProps = {
  data: DataItem[];
  columns: Column[];
};

const TableComponent: React.FC<TableComponentProps> = ({ data, columns }) => {
  const theme = useTheme(getTheme());
  const [search, setSearch] = React.useState("");

  function generateColumns(data: DataItem[]) {}

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 2,
    },
    onChange: onPaginationChange,
  });
  return (
    <div className="container pt-10 flex flex-col items-center">
      <div className="w-full overflow-x-auto">
        <label htmlFor="search"></label>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
          <input
            id="search"
            type="text"
            value={search}
            onChange={handleSearch}
            className="border border-gray-300 pl-10  w-full"
            placeholder="Search for Member"
          />
        </div>
      </div>

      <div className="flex w-100% max-w-4xl">
        <Table
          columns={columns}
          data={{ nodes: filteredData }}
          theme={theme}
          pagination={pagination}
          layout={{ fixedHeader: true }}
        >
          {() => (
            <>
              <Header>
                <HeaderRow className="bg-gray-700">
                  {columns.map((column) => (
                    <HeaderCell
                      key={column.accessor as string}
                      className="py-2"
                    >
                      {column.Header}
                    </HeaderCell>
                  ))}
                </HeaderRow>
              </Header>

              <Body>
                {filteredData.map((item) => (
                  <Row key={item.id} item={item} className="bg-white">
                    {columns.map((column) => (
                      <Cell key={column.accessor as string} className="py-2">
                        {item[column.accessor]}
                      </Cell>
                    ))}
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Total Pages: {pagination.state.getTotalPages(data)}</span>

        <span>
          Page:{" "}
          {pagination.state.getPages(data).map((_: any, index: any) => (
            <button
              key={index}
              type="button"
              style={{
                fontWeight: pagination.state.page === index ? "bold" : "normal",
              }}
              onClick={() => pagination.fns.onSetPage(index)}
            >
              {index + 1}
            </button>
          ))}
        </span>
      </div>
    </div>
  );
};

export default TableComponent;
