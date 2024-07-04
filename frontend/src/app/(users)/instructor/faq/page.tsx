import React from "react";
import FAQComponent from "../../components/Accordion";
import Navigation from "../../components/navigation";

const faqItems = [
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

/**
 * InstructorFAQ component.
 * Renders the frequently asked questions page for instructors.
 * @component
 * @returns TSX Element
 */
const InstructorFAQ: React.FC = () => {
  return (
    <div>
      <h1>Frequently Asked Questions</h1>
      <FAQComponent items={faqItems} />
    </div>
  );
};

export default InstructorFAQ;
