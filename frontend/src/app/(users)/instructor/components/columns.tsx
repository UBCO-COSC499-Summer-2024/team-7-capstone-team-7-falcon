import { DataItem } from "./type";

interface Column {
  Header: string;
  accessor: string;
}

export const COLUMNS = [
  {
    Header: "id",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Score",
    accessor: "score",
    className: "score-column",
  },
  {
    Header: "Exam Graded",
    accessor: "examgraded",
  },
];
