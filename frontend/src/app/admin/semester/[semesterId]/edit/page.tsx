"use client";
import React from "react";
import { useState } from "react";
import { Status } from "../../../../typings/backendDataTypes";
import { ArrowLeft } from "flowbite-react-icons/outline";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import SemesterEditForm from "@/app/admin/components/editSemesterForm";

/**
 * Renders the edit semester page
 * @component
 * @returns TSX element
 */
const AdminSemesterManagement = async ({
  params,
}: {
  params: { semesterId: string };
}) => {
  const semId = Number(params.semesterId);

  return (
    <>
      <div className="space-y-5 p-0 m-0">
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <div className="p-1 space-y-2">
              <h1 className="text-3xl font-bold">Semesters</h1>
            </div>
          </div>
          <div className="justify-self-end space-y-4">
            <button type="button" className="btn-primary">
              <Link
                href={"../../semesters"}
                className="space-x-4 flex items-center"
              >
                <ArrowLeft />
                Back
              </Link>
            </button>
          </div>
        </div>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <Toaster />
        <SemesterEditForm semesterId={semId} />
      </div>
    </>
  );
};

export default AdminSemesterManagement;
