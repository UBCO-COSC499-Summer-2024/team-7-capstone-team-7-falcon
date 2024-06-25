import { DataItem } from "./type";

export interface Column {
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
    Header: "email",
    accessor: "email",
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
  {
    Header: "Role",
    accessor: "role",
  },
  { Header: "", accessor: "" },

  { Header: "ExamName", accessor: "" },
  { Header: "Exam Published", accessor: "exam published" },
  {
    Header: "Grade Released",
    accessor: "grade released",
  },

  { Header: "Actions", accessor: "actions" },
];
