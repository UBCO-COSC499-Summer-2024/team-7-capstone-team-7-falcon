"use client";
import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Edit } from "flowbite-react-icons/solid";
import SearchBar from "../components/searchBar";

/**
 * Renders the admin semester management page.
 * @component
 * @returns TSX element
 */
const AdminSemesterManagement: React.FC = () => {
  return (
    <div className="space-y-5 p-0 m-0">
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <div className="p-1 space-y-2">
            <h1 className="text-4xl font-bold">Semesters</h1>
          </div>
        </div>
        <div className="justify-self-end space-y-4">
          <button type="button" className="btn-primary">
            <Link href={""} className="space-x-4 flex items-center">
              <Edit />
              Add semester
            </Link>
          </button>
        </div>
      </div>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <SearchBar placeholder="Search for courses" />
    </div>
  );
};

export default AdminSemesterManagement;
