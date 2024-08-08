"use client";

import React, { useState } from "react";

import FAQComponent from "../../components/Accordion";

const generalfaqItems = [
  {
    question: "What is the process for creating an exam?",
    answer:
      "First, select a course and click the 'Create Exam' button. Next, enter the exam information and publish the exam.",
  },
  {
    question: "How do I update course details?",
    answer:
      "On the course page, click the 'Course Settings' button and make the necessary changes to the course information.",
  },
  {
    question: "How do I release student grades?",
    answer:
      "Click on the action button associated with an exam. This will bring you to a page with the option to release/hide grades.",
  },
];
const coursefaqItems = [
  {
    question: "How do I view the courses I am enrolled in?",
    answer:
      "Once signed in, the courses will be visible on the dashboard page.",
  },
  {
    question: "How do I update course details?",
    answer:
      "On the course page, click the 'Course Settings' button and make the necessary changes to the course information.",
  },
];
const examfaqItems = [
  {
    question: "What is the process for creating an exam?",
    answer:
      "First, select a course and click the 'Create Exam' button. Next, enter the exam information and publish the exam.",
  },
  {
    question:
      "Is it mandatory to create a custom bubble sheet when creating an exam?",
    answer: "No, this step is completely optional.",
  },
  {
    question:
      "Is it mandatory to create a custom bubble sheet when creating an exam?",
    answer: "No, this step is completely optional.",
  },

  {
    question:
      "How many questions am I allowed to add when setting up a custom bubble sheet exam?",
    answer: "You may include between 0 and 200 questions, inclusive.",
  },

  {
    question:
      "How many questions am I allowed to add when setting up a custom bubble sheet exam?",
    answer: "You may include between 0 and 200 questions, inclusive.",
  },

  {
    question: "How do I release student grades?",
    answer:
      "Click on the action button associated with an exam. This will bring you to a page with the option to release/hide grades.",
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
