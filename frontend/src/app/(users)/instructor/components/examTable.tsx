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
import { COLUMNS } from "./columns"; //
import { DataItem } from "./type";

const ExamTable: React.FC = ({ data, columns }) => {
  const theme = useTheme(getTheme());
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredData = data.nodes.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Table columns={COLUMNS} data={{ nodes: filteredData }} theme={theme}>
      {() => (
        <>
          <Header>
            <HeaderRow className="bg-gray-700">
              {COLUMNS.map((column) => (
                <HeaderCell key={column.accessor as string} className="py-2">
                  {column.Header}
                </HeaderCell>
              ))}
            </HeaderRow>
          </Header>

          <Body>
            {filteredData.map((item) => (
              <Row key={item.id} item={item} className="bg-white">
                {COLUMNS.map((column) => (
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

export default ExamTable;
