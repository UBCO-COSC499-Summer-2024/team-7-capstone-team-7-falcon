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

const ExamTable = () => {
  const data = { nodes };

  const theme = useTheme(getTheme());
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };
  const handleDelete = (event: any) => {};
  return (
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
  );
};

export default ExamTable;
