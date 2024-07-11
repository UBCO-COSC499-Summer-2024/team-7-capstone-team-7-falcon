"use client";

import React, { useState } from "react";

import FAQComponent from "../../components/Accordion";

const generalfaqItems = [
  {
    question: "How to create an exam for students?",
    answer:
      "Select a course and then click on the Create Exam button. Enter the exam credentials and publish the exam",
  },
  {
    question: "How to edit the course information?",
    answer:
      "Select course settings button on the course page and edit the course information as required",
  },
  {
    question: "How to release grades for students?",
    answer:
      "Select the analytics button on the course page and click on the release grades button.",
  },
];
const coursefaqItems = [
  {
    question: "How to view courses I am enrolled in?",
    answer:
      "Instructors will need to sign in with their credentials to view the list of courses on the Course Dashboard page.",
  },
  {
    question: "How to edit the course information?",
    answer:
      "Select course settings button on the course page and edit the course information as required",
  },
];
const examfaqItems = [
  {
    question: "How to create an exam for students?",
    answer:
      "Select a course and then click on the Create Exam button. Enter the exam credentials and publish the exam",
  },

  {
    question: "How to release grades for students?",
    answer:
      "Select the analytics button on the course page and click on the release grades button.",
  },
];

/**
 * InstructorFAQ component.
 * Renders the frequently asked questions page for instructors.
 * @component
 * @returns TSX Element
 */
const InstructorFAQ: React.FC = () => {
  const [selectedFAQItems, setSelectedFAQItems] = useState(generalfaqItems);
  const [activeSection, setActiveSection] = useState("General");

  const handleSectionClick = (faqItems: any, sectionName: string) => {
    setSelectedFAQItems(faqItems);
    setActiveSection(sectionName);
  };
  return (
    <div>
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
                  onClick={() => handleSectionClick(coursefaqItems, "Courses")}
                >
                  Courses
                </button>
              </li>
              <li>
                <button
                  className={` ${activeSection === "Exams" ? "text-purple-800 underline" : "text-gray-500 hover:underline"}`}
                  onClick={() => handleSectionClick(examfaqItems, "Exams")}
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
      <div>
        <h1>Frequently Asked Questions</h1>
        <FAQComponent items={generalfaqItems} />
      </div>
    </div>
  );
};

export default InstructorFAQ;
