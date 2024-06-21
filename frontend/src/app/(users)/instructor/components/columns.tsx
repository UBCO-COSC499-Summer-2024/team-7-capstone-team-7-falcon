import { DataItem } from "./type";

interface Column {
  Header: string;
  accessor: keyof DataItem;
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
  },
  {
    Header: "Exam Graded",
    accessor: "examgraded",
  },
];
