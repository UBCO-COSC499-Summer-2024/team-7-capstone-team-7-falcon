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
    <div className="container pt-10 flex flex-col items-center">
      <div className="w-full overflow-x-auto">
        <label htmlFor="search">Search:</label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 pl-2"
          placeholder="Search by Name"
        />
      </div>

      <div className="flex w-full max-w-4xl mt-4">
        <Table columns={columns} data={{ nodes: filteredData }} theme={theme}>
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
                {filteredData.map((item) => (
                  <Row key={item.name} item={item} className="bg-white">
                    {columns.map((column) => (
                      <Cell key={column.label} className="py-2">
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
  );
};

export default TableComponent;
