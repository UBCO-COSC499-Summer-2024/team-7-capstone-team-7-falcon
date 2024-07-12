"use client";
import React from "react";
import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Edit } from "flowbite-react-icons/solid";
import SearchBar from "../components/searchBar";
import CreateSemesterForm from "../components/createSemesterForm";
import { Status } from "../../typings/backendDataTypes";
import SemesterTable from "../components/semesterTable";

/**
 * Renders the admin semester management page.
 * @component
 * @returns TSX element
 */
const AdminSemesterManagement: React.FC = () => {
  const [status, setStatus] = useState(Status.Pending);

  const resetStatus = () => {
    setStatus(Status.Pending);
  };

  return (
    <>
      {status === Status.Success && (
        <CreateSemesterForm onClose={resetStatus} />
      )}
      <div className="space-y-5 p-0 m-0">
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <div className="p-1 space-y-2">
              <h1 className="text-4xl font-bold">Semesters</h1>
            </div>
          </div>
          <div className="justify-self-end space-y-4">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setStatus(Status.Success)}
            >
              <div className="space-x-4 flex items-center">
                <Edit />
                Add semester
              </div>
            </button>
          </div>
        </div>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <SemesterTable />
      </div>
    </>
  );
};

export default AdminSemesterManagement;
