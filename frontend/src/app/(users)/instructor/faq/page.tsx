"use client";

import React from "react";
import FAQComponent from "../../components/Accordian";

const faqItems = [
  {
    question: "How to join a course",
    answer: "Using the course invite link",
  },
  {
    question: "How to join a course",
    answer: "Using the course invite link",
  },
  {
    question: "How to join a course",
    answer: "Using the course invite link",
  },
];

/**
 * InstructorFAQ component.
 * Renders the frequently asked questions page for instructors.
 * @component
 * @returns TSX Element
 */
const InstructorFAQ: React.FC = () => {
  return (
    <div>
      <h1><FAQComponent items = {faqItems} /></h1>
    </div>
  );
};

export default InstructorFAQ;
