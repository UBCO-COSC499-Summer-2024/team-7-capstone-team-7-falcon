"use client"
import React from "react";
import { Sidebar } from "flowbite-react";
import { useUserInfo } from "../contexts/userContext";
import Image from "next/image";
import StudentNavigation from "../(users)/student/components/navigation";
import { ArrowRightToBracket } from "flowbite-react-icons/outline";
import Link from "next/link";
import InstructorNavigation from "../(users)/instructor/components/navigation";

/**
 * Renders the sidebar component which shows on all pages in routes
 *
 * @component
 * @returns TSX Element
 */
const PageSidebar: React.FC = () => {
  const { userInfo } = useUserInfo();

  return (
    <Sidebar id="sidebar"
      className="absolute inset-y-0 left-0 hidden md:flex h-full flex-col border-r bg-[#F7F7F7]"
    >
      <div className="flex flex-col justify-between h-full py-4 px-4">
        <div>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">OwlMark</h1>
            <div className="flex items-center flex-col">
              <Image
                className="rounded-full"
                src={userInfo.avatarUrl}
                width={96}
                height={96}
                alt={`Profile image of ${userInfo.firstName} ${userInfo.lastName}`}
              />
              <h2 className="mt-3 text-center">
                Welcome back,<br /><span className="font-bold">{userInfo.firstName} {userInfo.lastName}</span>
              </h2>
            </div>
          </div>

          <Sidebar.Items className="mt-20 flex items-center flex-col">
            {userInfo.role === "student" && <StudentNavigation />}
            {userInfo.role === "instructor" && <InstructorNavigation />}
          </Sidebar.Items>
        </div>

        <div className="flex justify-center">
          <Link href='/logout' className="flex items-center space-x-2 text-sm">
            <ArrowRightToBracket />
            <span>Sign out</span>
          </Link>
        </div>
      </div>
    </Sidebar>
  );
};

export default PageSidebar;
