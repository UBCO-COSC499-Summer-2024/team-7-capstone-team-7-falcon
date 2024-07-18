"use client";
import React, { useEffect, useState } from "react";
import { usersAPI } from "../../api/usersAPI";
import { coursesAPI } from "../../api/coursesAPI";
import CountCard from "./CountCard";

const DashboardDataProvider: React.FC = () => {
  const [courseCount, setCourseCount] = useState<number>(0);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [professorsCount, setProfessorsCount] = useState<number>(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch course count
        const courseCount = await coursesAPI.getAllCoursesCount();
        setCourseCount(courseCount);

        // Fetch users count
        const response = await usersAPI.getAllUsersCount();

        const totalMembersCount = response.reduce(
          (acc: number, curr: { role: string; count: number }) =>
            acc + curr.count,
          0,
        );
        setMembersCount(totalMembersCount);

        const professors = response.find(
          (item: { role: string }) => item.role === "professor",
        );
        if (professors) {
          setProfessorsCount(professors.count);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-column justify-start py-4">
      <CountCard className=" mx-4" count={courseCount} title="Courses" />
      <CountCard className=" mx-4" count={membersCount} title="Members" />
      <CountCard className=" mx-4" count={professorsCount} title="Professors" />
    </div>
  );
};

export default DashboardDataProvider;
