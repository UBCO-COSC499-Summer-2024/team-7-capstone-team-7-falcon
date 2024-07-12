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
import { Column } from "../instructor/components/type";
import { DataItem } from "../instructor/components/type";
import { MdOutlineSearch } from "react-icons/md";
import { Label, TextInput, Button } from "flowbite-react";

type TableComponentProps<T> = {
  data: DataItem<T>[];
  columns: Column[];
  showSearch?: boolean;
};

const TableComponent = <T,>({
  data,
  columns,
  showSearch = true,
}: TableComponentProps<T>) => {
  const theme = useTheme(getTheme());
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredData = data.filter(
    (item) => item && item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container flex flex-col">
      {showSearch && (
        <form className="flex max-w-full flex-col">
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              id="search"
              type="text"
              value={search}
              icon={MdOutlineSearch}
              onChange={handleSearch}
              placeholder="Search by name"
            />
          </div>
        </form>
      )}
      <div className="flex w-full mt-4">
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
    </div>
  );
};

export default TableComponent;
