"use client";

import React, { useState } from "react";
import FAQComponent from "../../components/Accordion";

const generalfaqItems = [
  {
    id: 1,
    question: "How to sign in to the account?",
    answer:
      "Students can create an account and login with the credentials or sign in with google. They will be required to provide their student id to verify their account",
  },
  {
    id: 2,
    question: "How to view the graded exams?",
    answer:
      "Select a course from the course dashboard. Click on the view exam button under the Graded Exams tab on the course page.",
  },
];

const courseFaqItems = [
  {
    id: 1,
    question: "How to join a course?",
    answer:
      "The Course Invite link will be sent to you by your professor. Click on the invite link and you will be able to access the course",
  },
];

const examFaqItems = [
  {
    id: 1,
    question: "How to view upcoming exams in a particular course?",
    answer:
      "Select a particular course from the dashboard. Click on the upcoming exams on the course page to view the list of exams.",
  },
  {
    id: 2,
    question: "How can I view my graded exam?",
    answer:
      "Select a course from the course dashboard. Click on the view exam button under the Graded Exams tab on the course page.",
  },
];

/**
 * StudentFAQ component.
 * Renders the frequently asked questions page for Students.
 * @component
 * @returns TSX Element
 */
const StudentFAQ: React.FC = () => {
  const [selectedFAQItems, setSelectedFAQItems] = useState(generalfaqItems);
  const [activeSection, setActiveSection] = useState("General");

  const handleSectionClick = (faqItems: any, sectionName: string) => {
    setSelectedFAQItems(faqItems);
    setActiveSection(sectionName);
  };
  return (
    <div className="container mx-auto">
      {/* Header Section */}

      <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
      <hr className="border-t-1 border-black mt-2" />

      {/* Main Content Section */}
      <div className="flex justify-between h-screen">
        {/* Left List Section */}
        <div className="w-1/3 p-4">
          <ul className="list-none list-inside">
            <button
              className={` ${activeSection === "General" ? "text-purple-800 underline" : "text-gray-500 hover:underline"}`}
              onClick={() => handleSectionClick(generalfaqItems, "General")}
            >
              General
            </button>

            <li>
              <button
                className={` ${activeSection === "Courses" ? "text-purple-800 underline" : "text-gray-500 hover:underline"}`}
                onClick={() => handleSectionClick(courseFaqItems, "Courses")}
              >
                Courses
              </button>
            </li>
            <li>
              <button
                className={` ${activeSection === "Exams" ? "text-purple-800 underline" : "text-gray-500 hover:underline"}`}
                onClick={() => handleSectionClick(examFaqItems, "Exams")}
              >
                Exams
              </button>
            </li>
          </ul>
        </div>

        {/* FAQ Component Section */}
        <div className="w-2/3 p-4 flex items-start justify-start border-b">
          <FAQComponent items={selectedFAQItems} />
        </div>
      </div>
    </div>
  );
};

export default StudentFAQ;
