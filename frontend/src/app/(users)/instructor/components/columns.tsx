import { DataItem } from "./type";

export interface Column {
  Header: string;
  accessor: string;
  className: string;
}

export const COLUMNS = [
  {
    Header: "id",
    accessor: "id",
    renderCell: (item: any) => item.id,
  },
  {
    Header: "Name",
    accessor: "name",
    renderCell: (item: any) => item.name,
  },

  {
    Header: "email",
    accessor: "email",
    className: "py-2 overflow-x-auto",
    renderCell: (item: any) => item.email,
  },
  {
    Header: "Score",
    accessor: "score",
    className: "score-column",
    renderCell: (item: any) => item.score,
  },
  {
    Header: "Exam Graded",
    accessor: "examgraded",
    renderCell: (item: any) => item.examgraded,
  },
  {
    Header: "Role",
    accessor: "role",
    renderCell: (item: any) => item.role,
  },

  {
    Header: "ExamName",
    accessor: "examname",
    renderCell: (item: any) => item.examname,
  },

  {
    Header: "Exam Published",
    accessor: "exam published",
    renderCell: (item: any) => item.exampublished,
  },

  {
    Header: "Grade Released",
    accessor: "grade released",
    renderCell: (item: any) => item.gradereleased,
  },

  {
    Header: "Actions",
    accessor: "actions",
    renderCell: (item: any) => item.actions,
  },
];
