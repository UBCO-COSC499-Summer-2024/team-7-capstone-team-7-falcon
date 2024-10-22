"use client";
import React, { useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { Role, useUserInfo } from "../contexts/userContext";
import { usersAPI } from "@/app/api/usersAPI";
import StudentNavigation from "../(users)/student/components/navigation";
import { ArrowRightToBracket } from "flowbite-react-icons/outline";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import InstructorNavigation from "../(users)/instructor/components/navigation";
import AdminNavigation from "../admin/components/navigation";
import Avatar from "./avatar";
import OwlLogo from "./owlLogo";

/**
 * Renders the sidebar component which shows on all pages in routes
 *
 * @component
 * @returns TSX Element
 */
const PageSidebar: React.FC = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUserInfo();

  const handleLogout = async () => {
    router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout/`);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await usersAPI.getUserDetails();
        let userRole;
        if (userDetails?.role === "professor") {
          userRole = Role.INSTRUCTOR;
        } else if (userDetails?.role === "admin") {
          userRole = Role.ADMIN;
        } else {
          userRole = Role.STUDENT;
        }

        setUserInfo({
          ...userInfo,
          firstName: userDetails?.first_name ?? "",
          lastName: userDetails?.last_name ?? null,
          email: userDetails?.email ?? "",
          role: userRole,
          avatarUrl: userDetails?.avatar_url ?? null,
        });
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <Sidebar
      id="sidebar"
      className="hidden md:flex h-screen flex-col bg-white w-72 shadow-lg"
    >
      <div className="flex flex-col justify-between h-full py-4 px-4">
        <div>
          <div className="flex flex-col items-center">
            <div className="align-right">
              <div className="flex items-center mb-10">
                <OwlLogo className="w-16" />
                <h1 className="text-2xl font-bold mb-4">OwlMark</h1>
              </div>
            </div>
            <div className="flex items-center flex-col">
              <Avatar
                avatarUrl={userInfo.avatarUrl ?? undefined}
                firstName={userInfo.firstName}
                lastName={userInfo.lastName ?? undefined}
              />
              <h2 className="mt-3 text-center">
                Welcome back,
                <br />
                <span className="font-bold">
                  {userInfo.firstName} {userInfo.lastName ?? ""}
                </span>
              </h2>
            </div>
          </div>

          <Sidebar.Items className="mt-10 flex items-center flex-col">
            {userInfo.role === "student" && <StudentNavigation />}
            {userInfo.role === "instructor" && <InstructorNavigation />}
            {userInfo.role === "admin" && <AdminNavigation />}
          </Sidebar.Items>
        </div>

        <div className="flex justify-center">
          <Button color="border-transparent" onClick={handleLogout}>
            <ArrowRightToBracket className="h-5" />
            Sign out
          </Button>
        </div>
      </div>
    </Sidebar>
  );
};

export default PageSidebar;
