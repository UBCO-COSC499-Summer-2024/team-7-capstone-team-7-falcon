"use client";

import React, { useEffect, useState } from "react";
import { coursesAPI } from "../api/coursesAPI";
import axios from "axios";
import CourseCountCard from "../admin/components/CourseCountCard";
import MembersCountCard from "./components/MembersCountCard";
import ProfessorsCountCard from "./components/ProfessorsCountCard";

const AdminDashboard: React.FC = () => {
  const [courseCount, setCourseCount] = useState(0);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [professorsCount, setProfessorsCount] = useState<number>(0);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      /*Replace with your actual endpoints to fetch all courses, members, and professors
      const coursesResponse = await axios.get('/api/course/all');
      const membersResponse = await axios.get('/api/members/all'); // Replace with your endpoint
      const professorsResponse = await axios.get('/api/professors/all'); // Replace with your endpoint

      setCourseCount(coursesResponse.data.length); // Assuming response.data is an array of courses
      setMembersCount(membersResponse.data.length); // Assuming response.data is an array of members
      setProfessorsCount(professorsResponse.data.length); //  Assuming response.data is an array of professors */
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error if needed
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 gap-0.5 mb-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <CourseCountCard courseCount={courseCount} className="w-64 mb-4" />
        <MembersCountCard membersCount={membersCount} className="w-64 mb-4" />
        <ProfessorsCountCard
          professorsCount={professorsCount}
          className="w-64 mb-4"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
