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

  return (
    <Table columns={columns} data={{ nodes: filteredData }} theme={theme}>
      {() => (
        <>
          <Header>
            <HeaderRow className="bg-gray-700">
              {columns.map((column) => (
                <HeaderCell key={column.accessor as string} className="py-2">
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
  );
};

export default TableComponent;
