"use client";

import React, { useState } from "react";
import FAQComponent from "../../components/Accordion";

const generalfaqItems = [
  {
    id: 1,
    question: "How do I sign in to my account?",
    answer:
      "Students can either create an account and login with an email and password combination, or sign in using a Google account.",
  },
  {
    id: 2,
    question: "How can I view my graded exams?",
    answer:
      "Select a course from the course dashboard. Click on the view exam button under the 'Graded Exams' tab on the course page.",
  },
];

const courseFaqItems = [
  {
    id: 1,
    question: "How do I join a course?",
    answer:
      "Your instructor will provide you with a course invite link. Click on the link to register yourself in the course.",
  },
];

const examFaqItems = [
  {
    id: 1,
    question: "How can I view upcoming exams for a particular course?",
    answer:
      "Select a course from the dashboard. Click on the upcoming exams tab on the course page to view the list of upcoming exams.",
  },
  {
    id: 2,
    question: "How can I view my graded exams?",
    answer:
      "Select a course from the course dashboard. Click on the view exam button under the 'Graded Exams' tab on the course page.",
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
